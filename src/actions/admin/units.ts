"use server";

import { getAuthUser } from "@/queries/user/users";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { unitSchema } from "@/schemas/courses";

// Validation Schema
// Removed local schema

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
}

// Helper to ensure admin access
async function ensureAdmin() {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function createUnitAction(
    courseId: string,
    prevState: any,
    formData: FormData,
) {
    try {
        await ensureAdmin();

        const rawData = {
            title: formData.get("title"),
            description: formData.get("description"),
            order: formData.get("order"),
        };

        const validatedFields = unitSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please fix the errors below.",
                success: false,
            };
        }

        const { title, description, order } = validatedFields.data;
        const supabase = getAdminClient();

        // Check for duplicate order
        const { data: existingUnit } = await supabase
            .from("units")
            .select("id")
            .eq("course_id", courseId)
            .eq("order", order)
            .single();

        if (existingUnit) {
            return {
                message: `Order number ${order} is already taken.`,
                errors: { order: ["This order number is already used"] },
                success: false,
            };
        }

        const { error } = await supabase.from("units").insert({
            course_id: courseId,
            title,
            description,
            order,
        });

        if (error) {
            console.error("Create Unit Error:", error);
            return {
                message: "Database Error: Failed to create unit.",
                success: false,
            };
        }
    } catch (error) {
        return { message: "Unauthorized or Server Error", success: false };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    return { message: "Unit created successfully!", success: true };
}

export async function deleteUnitAction(unitId: string, courseId: string) {
    try {
        await ensureAdmin();
        const supabase = getAdminClient();

        const { error } = await supabase
            .from("units")
            .delete()
            .eq("id", unitId);

        if (error) {
            console.error("Delete Unit Error:", error);
            throw new Error("Failed to delete unit");
        }
    } catch (error) {
        console.error("Delete Action Error:", error);
    }

    revalidatePath(`/admin/courses/${courseId}`);
}

export async function moveUnitAction(
    unitId: string,
    courseId: string,
    direction: "up" | "down",
) {
    try {
        await ensureAdmin();
        const supabase = getAdminClient();

        // 1. Get current unit
        const { data: currentUnit } = await supabase
            .from("units")
            .select("order")
            .eq("id", unitId)
            .single();

        if (!currentUnit) throw new Error("Unit not found");

        const currentOrder = currentUnit.order;

        // 2. Find neighbor
        const { data: neighborUnit } = await supabase
            .from("units")
            .select("id, order")
            .eq("course_id", courseId)
            .eq(
                "order",
                direction === "up" ? currentOrder - 1 : currentOrder + 1,
            )
            .single();

        if (neighborUnit) {
            // 3. Swap (Use a temp value to avoid unique constraint if strict, but standard update usually works if not deferred.
            // Safest: Update neighbor to -1, Update current to neighbor's, Update neighbor to current's.

            // Step A: Move neighbor out of the way
            await supabase
                .from("units")
                .update({ order: -1 })
                .eq("id", neighborUnit.id);

            // Step B: Move current to neighbor's spot
            await supabase
                .from("units")
                .update({ order: neighborUnit.order })
                .eq("id", unitId);

            // Step C: Move neighbor to current's spot
            await supabase
                .from("units")
                .update({ order: currentOrder })
                .eq("id", neighborUnit.id);
        }
    } catch (error) {
        console.error("Move Unit Error:", error);
    }

    revalidatePath(`/admin/courses/${courseId}`);
}
