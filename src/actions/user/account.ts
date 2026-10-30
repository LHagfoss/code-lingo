"use server";

import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { getAuthUser } from "@/queries/user/users";
import { uploadImage } from "@/utils/supabase/storage";

function getAdminClient() {
    return createClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.SUPABASE_SERVICE_ROLE_KEY!,
    );
}

export async function updateProfileAction(_prevState: any, formData: FormData) {
    const user = await getAuthUser();
    if (!user) return { message: "Not authenticated", success: false };

    const name = formData.get("name") as string;
    const imageFile = formData.get("image") as File;

    if (!name || name.trim().length < 2) {
        return {
            message: "Name must be at least 2 characters",
            success: false,
        };
    }

    const supabase = getAdminClient();

    const updates: any = { name };

    if (imageFile && imageFile.size > 0) {
        const path = `${user.id}-${Date.now()}.${imageFile.name.split(".").pop()}`;
        updates.image = await uploadImage(imageFile, "avatars", path);
    }

    const { error } = await supabase
        .from("users")
        .update(updates)
        .eq("id", user.id);

    if (error) {
        console.error("Update failed:", error);
        return { message: "Failed to update profile", success: false };
    }

    revalidatePath("/profile");
    revalidatePath("/learn");
    return { message: "Profile updated!", success: true };
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
