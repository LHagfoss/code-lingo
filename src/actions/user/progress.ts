"use server";

import { revalidatePath } from "next/cache";
import { upsertUserProgress } from "@/queries/user/progress";
import { getAuthUser } from "@/queries/user/users";

export type ActionState = {
    message: string;
    success: boolean;
};

/**
 * OPTION 1: For the Dashboard Buttons
 * Compatible with the 'useActionState' hook in React forms.
 */
export async function completeLessonAction(
    lessonId: number,
    _prevState: ActionState,
    _formData: FormData,
): Promise<ActionState> {
    const user = await getAuthUser();

    if (!user) {
        return { success: false, message: "User not found" };
    }

    try {
        await upsertUserProgress(user.id, lessonId, true);

        revalidatePath("/learn");
        revalidatePath("/courses");
        revalidatePath("/");

        return { success: true, message: "Lesson complete!" };
    } catch (error) {
        console.error("Action failed:", error);
        return { success: false, message: "Failed to save." };
    }
}

/**
 * OPTION 2: For the Quiz Component
 * A standard async function easier to call from client-side JavaScript.
 */
export async function saveQuizProgress(lessonId: number) {
    const user = await getAuthUser();

    if (!user) {
        throw new Error("User not found");
    }

    try {
        await upsertUserProgress(user.id, lessonId, true);

        // Revalidate relevant pages so the checkmark appears immediately
        revalidatePath("/learn");
        revalidatePath("/courses");

        return { success: true };
    } catch (error) {
        console.error("Save failed:", error);
        return { success: false };
    }
}
