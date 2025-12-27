"use server";

import { getAuthUser } from "@/queries/user/users";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { exerciseSchema } from "@/schemas/lessons";

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

export async function createExerciseAction(
    lessonId: string,
    prevState: any,
    formData: FormData,
) {
    try {
        await ensureAdmin();

        const rawData = {
            question: formData.get("question"),
            type: formData.get("type") || "SELECT",
        };

        const validatedFields = exerciseSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please fix the errors below.",
                success: false,
            };
        }

        const { question, type } = validatedFields.data;
        const supabase = getAdminClient();

        const { error } = await supabase.from("exercises").insert({
            lesson_id: lessonId,
            question,
            type,
        });

        if (error) {
            console.error("Create Exercise Error:", error);
            return {
                message: "Database Error: Failed to create exercise.",
                success: false,
            };
        }
    } catch (error) {
        return { message: "Unauthorized or Server Error", success: false };
    }

    revalidatePath(`/admin/lessons/${lessonId}`);
    return { message: "Exercise created successfully!", success: true };
}

export async function deleteExerciseAction(
    exerciseId: string,
    lessonId: string,
) {
    try {
        await ensureAdmin();
        const supabase = getAdminClient();

        const { error } = await supabase
            .from("exercises")
            .delete()
            .eq("id", exerciseId);

        if (error) {
            console.error("Delete Exercise Error:", error);
            throw new Error("Failed to delete exercise");
        }
    } catch (error) {
        console.error("Delete Action Error:", error);
    }

    revalidatePath(`/admin/lessons/${lessonId}`);
}
