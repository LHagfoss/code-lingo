"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { getAuthUser } from "@/queries/user/users";
import { optionSchema } from "@/schemas/lessons";

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

export async function createOptionAction(
    exerciseId: string,
    _prevState: any,
    formData: FormData,
) {
    try {
        await ensureAdmin();

        const rawData = {
            text: formData.get("text"),
            correct: formData.get("correct") === "on", // Checkbox sends "on" if checked
        };

        const validatedFields = optionSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please fix the errors below.",
                success: false,
            };
        }

        const { text, correct } = validatedFields.data;
        const supabase = getAdminClient();

        // STRICT MODE: If this option is correct, uncheck all others first
        if (correct) {
            await supabase
                .from("challenge_options")
                .update({ correct: false })
                .eq("exercise_id", exerciseId);
        }

        const { error } = await supabase.from("challenge_options").insert({
            exercise_id: exerciseId,
            text,
            correct,
            image_src: null,
            audio_src: null,
        });

        if (error) {
            console.error("Create Option Error:", error);
            return {
                message: "Database Error: Failed to create option.",
                success: false,
            };
        }
    } catch (_error) {
        return { message: "Unauthorized or Server Error", success: false };
    }

    revalidatePath(`/admin/exercises/${exerciseId}`);
    return { message: "Option created successfully!", success: true };
}

export async function deleteOptionAction(optionId: string, exerciseId: string) {
    try {
        await ensureAdmin();
        const supabase = getAdminClient();

        const { error } = await supabase
            .from("challenge_options")
            .delete()
            .eq("id", optionId);

        if (error) {
            console.error("Delete Option Error:", error);
            throw new Error("Failed to delete option");
        }
    } catch (error) {
        console.error("Delete Action Error:", error);
    }

    revalidatePath(`/admin/exercises/${exerciseId}`);
}
