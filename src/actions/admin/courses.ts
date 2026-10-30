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

// Helper to ensure admin access
async function ensureAdmin() {
    const user = await getAuthUser();
    if (!user || user.role !== "admin") {
        throw new Error("Unauthorized");
    }
    return user;
}

export async function createCourseAction(_prevState: any, formData: FormData) {
    try {
        await ensureAdmin();

        const title = formData.get("title") as string;
        const imageFile = formData.get("image") as File;

        if (!title || title.length < 3) {
            return { message: "Title must be at least 3 chars." };
        }

        // Generate slug
        const slug = title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        let image_src = "";
        if (imageFile && imageFile.size > 0) {
            const path = `${slug}-${Date.now()}.${imageFile.name
                .split(".")
                .pop()}`;
            image_src = await uploadImage(imageFile, "courses", path);
        }

        const supabase = getAdminClient();

        const { error } = await supabase.from("courses").insert({
            title,
            image_src,
            slug,
        });

        if (error) {
            console.error("Create Course Error:", error);
            return { message: "Database Error: Failed to create course." };
        }
    } catch (_error) {
        return { message: "Unauthorized or Server Error" };
    }

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    redirect("/admin/courses");
}

export async function deleteCourseAction(courseId: string) {
    try {
        await ensureAdmin();
        const supabase = getAdminClient();

        const { error } = await supabase
            .from("courses")
            .delete()
            .eq("id", courseId);

        if (error) {
            console.error("Delete Course Error:", error);
            throw new Error("Failed to delete course");
        }
    } catch (error) {
        console.error("Delete Action Error:", error);
        // In a real app, we might want to return an error state to the client
    }

    revalidatePath("/admin/courses");
    revalidatePath("/courses");
}

export async function updateCourseAction(
    courseId: string,
    _prevState: any,
    formData: FormData,
) {
    try {
        await ensureAdmin();

        const title = formData.get("title") as string;
        const imageFile = formData.get("image") as File;

        if (!title || title.length < 3) {
            return {
                message: "Title must be at least 3 chars.",
                success: false,
            };
        }

        const supabase = getAdminClient();

        // Prepare update object
        const updates: any = { title };

        if (imageFile && imageFile.size > 0) {
            const slug = title
                .toLowerCase()
                .replace(/ /g, "-")
                .replace(/[^\w-]+/g, "");
            const path = `${slug}-${Date.now()}.${imageFile.name
                .split(".")
                .pop()}`;
            updates.image_src = await uploadImage(imageFile, "courses", path);
        } else if (formData.get("image_src")) {
            // Fallback if they somehow sent a text url (backward compatibility)
            updates.image_src = formData.get("image_src");
        }

        const { error } = await supabase
            .from("courses")
            .update(updates)
            .eq("id", courseId);

        if (error) {
            console.error("Update Course Error:", error);
            return {
                message: "Database Error: Failed to update course.",
                success: false,
            };
        }
    } catch (_error) {
        return { message: "Unauthorized or Server Error", success: false };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { message: "Course updated successfully!", success: true };
}
