"use server";

import { getAuthUser } from "@/queries/user/users";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
}

export async function updateUserNameAction(formData: FormData) {
    const user = await getAuthUser();
    if (!user) throw new Error("Not authenticated");

    const newName = formData.get("name") as string;

    const supabase = getAdminClient();

    const { error } = await supabase
        .from("users")
        .update({ name: newName })
        .eq("id", user.id);

    if (error) {
        console.error("Update failed:", error);
        throw new Error("Update failed");
    }

    revalidatePath("/");
    return { success: true };
}

export async function updateUserActiveCourse(courseId: number) {
    const user = await getAuthUser();
    if (!user) throw new Error("Not authenticated");

    const supabase = getAdminClient();

    const { error } = await supabase
        .from("users")
        .update({ active_course_id: courseId })
        .eq("id", user.id);

    if (error) {
        console.error("Failed to update active course", error);
        throw new Error("Failed to update active course");
    }

    revalidatePath("/learn");
    revalidatePath("/courses");
    redirect("/learn");
}
