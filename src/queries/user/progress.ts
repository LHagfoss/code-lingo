import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { cache } from "react";
import { getAuthUser } from "@/queries/user/users";

export function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
}

export const getUserProgress = cache(async (userId: string) => {
    const supabase = getAdminClient();
    const { data } = await supabase
        .from("user_progress")
        .select("*")
        .eq("user_id", userId);
    return data;
});

export const upsertUserProgress = async (
    userId: string,
    lessonId: number,
    isCompleted: boolean = true,
) => {
    const supabase = getAdminClient();

    const { data, error } = await supabase
        .from("user_progress")
        .upsert({
            user_id: userId,
            lesson_id: lessonId,
            completed: isCompleted,
            updated_at: new Date().toISOString(),
        })
        .select()
        .single();

    if (error) {
        console.error("Error saving progress:", error);
        throw new Error("Failed to save progress");
    }

    return data;
};

export async function saveQuizProgress(lessonId: number) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("User not found");
    }

    try {
        await upsertUserProgress(user.id, lessonId, true);

        revalidatePath("/learn");
        revalidatePath("/");

        return { success: true };
    } catch (error) {
        console.error("Save failed:", error);
        return { success: false };
    }
}
