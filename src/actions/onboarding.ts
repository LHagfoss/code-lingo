"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/queries/user/users";
import { onboardingSchema } from "@/schemas/auth";

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
}

export async function completeOnboardingAction(
    _prevState: any,
    formData: FormData,
) {
    const user = await getAuthUser();
    if (!user) {
        return { error: "Unauthorized" };
    }

    const rawData = {
        username: formData.get("username"),
        courseId: formData.get("courseId"),
    };

    const validatedFields = onboardingSchema.safeParse(rawData);

    if (!validatedFields.success) {
        return {
            errors: validatedFields.error.flatten().fieldErrors,
            message: "Please fix the errors below.",
        };
    }

    const { username, courseId } = validatedFields.data;

    const supabase = getAdminClient();

    const { error } = await supabase
        .from("users")
        .update({
            username: username,
            active_course_id: courseId,
            onboarding_completed: true,
        })
        .eq("id", user.id);

    if (error) {
        console.error("Onboarding Error:", error);
        return { message: "Database Error: Failed to save profile." };
    }

    revalidatePath("/learn");
    redirect("/learn");
}
