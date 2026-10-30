"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/queries/user/users";
import { lessonSchema } from "@/schemas/lessons";

function getAdminClient() {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !supabaseServiceRoleKey) {
        throw new Error("Missing Supabase environment variables");
    }

    return createClient(supabaseUrl, supabaseServiceRoleKey);
}

async function ensureAdmin() {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function createLessonAction(
    unitId: string,
    _prevState: unknown,
    formData: FormData,
) {
    try {
        await ensureAdmin();

        const rawData = {
            title: formData.get("title"),
            order: formData.get("order"),
        };

        const validatedFields = lessonSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please fix the errors below.",
                success: false,
            };
        }

        const { title, order } = validatedFields.data;
        const supabase = getAdminClient();

        // Check for duplicate order
        const { data: existingLesson } = await supabase
            .from("lessons")
            .select("id")
            .eq("unit_id", unitId)
            .eq("order", order)
            .single();

        if (existingLesson) {
            return {
                message: `Order number ${order} is already taken.`,
                errors: { order: ["This order number is already used"] },
                success: false,
            };
        }

        const { error } = await supabase.from("lessons").insert({
            unit_id: unitId,
            title,
            order,
        });

        if (error) {
            console.error("Create Lesson Error:", error);
            return {
                message: "Database Error: Failed to create lesson.",
                success: false,
            };
        }
    } catch (_error) {
        return { message: "Unauthorized or Server Error", success: false };
    }

    revalidatePath(`/admin/units/${unitId}`);
    return { message: "Lesson created successfully!", success: true };
}

export async function deleteLessonAction(lessonId: string, unitId: string) {
    try {
        await ensureAdmin();
        const supabase = getAdminClient();

        const { error } = await supabase
            .from("lessons")
            .delete()
            .eq("id", lessonId);

        if (error) {
            console.error("Delete Lesson Error:", error);
            throw new Error("Failed to delete lesson");
        }
    } catch (error) {
        console.error("Delete Action Error:", error);
    }

    revalidatePath(`/admin/units/${unitId}`);
}

export async function moveLessonAction(
    lessonId: string,
    unitId: string,
    direction: "up" | "down",
) {
    try {
        await ensureAdmin();
        const supabase = getAdminClient();

        const { data: currentLesson } = await supabase
            .from("lessons")
            .select("order")
            .eq("id", lessonId)
            .single();

        if (!currentLesson) throw new Error("Lesson not found");

        const currentOrder = currentLesson.order;

        let query = supabase
            .from("lessons")
            .select("id, order")
            .eq("unit_id", unitId);

        if (direction === "up") {
            query = query
                .lt("order", currentOrder)
                .order("order", { ascending: false });
        } else {
            query = query
                .gt("order", currentOrder)
                .order("order", { ascending: true });
        }

        const { data: neighborLesson } = await query.limit(1).single();

        if (neighborLesson) {
            // Swap orders
            // 1. Set neighbor to temp (-1)
            await supabase
                .from("lessons")
                .update({ order: -1 })
                .eq("id", neighborLesson.id);

            // 2. Set current to neighbor's old order
            await supabase
                .from("lessons")
                .update({ order: neighborLesson.order })
                .eq("id", lessonId);

            // 3. Set neighbor (from temp) to current's old order
            await supabase
                .from("lessons")
                .update({ order: currentOrder })
                .eq("id", neighborLesson.id);
        }
    } catch (error) {
        console.error("Move Lesson Error:", error);
    }

    revalidatePath(`/admin/units/${unitId}`);
}
