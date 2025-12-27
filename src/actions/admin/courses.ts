"use server";

import { getAuthUser } from "@/queries/user/users";
import { createClient } from "@supabase/supabase-js";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { courseSchema } from "@/schemas/courses";

// Validation Schema
// Removed local schema definition

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

export async function createCourseAction(prevState: any, formData: FormData) {
    try {
        await ensureAdmin();

        const rawData = {
            title: formData.get("title"),
            image_src: formData.get("image_src"),
        };

        const validatedFields = courseSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please fix the errors below.",
            };
        }

        const { title, image_src } = validatedFields.data;
        const supabase = getAdminClient();

        // Generate a simple slug from title
        const slug = title
            .toLowerCase()
            .replace(/ /g, "-")
            .replace(/[^\w-]+/g, "");

        const { error } = await supabase.from("courses").insert({
            title,
            image_src,
            slug,
        });

        if (error) {
            console.error("Create Course Error:", error);
            return { message: "Database Error: Failed to create course." };
        }
    } catch (error) {
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
    prevState: any,
    formData: FormData,
) {
    try {
        await ensureAdmin();

        const rawData = {
            title: formData.get("title"),
            image_src: formData.get("image_src"),
        };

        const validatedFields = courseSchema.safeParse(rawData);

        if (!validatedFields.success) {
            return {
                errors: validatedFields.error.flatten().fieldErrors,
                message: "Please fix the errors below.",
                success: false,
            };
        }

        const { title, image_src } = validatedFields.data;
        const supabase = getAdminClient();

        const { error } = await supabase
            .from("courses")
            .update({ title, image_src })
            .eq("id", courseId);

        if (error) {
            console.error("Update Course Error:", error);
            return {
                message: "Database Error: Failed to update course.",
                success: false,
            };
        }
    } catch (error) {
        return { message: "Unauthorized or Server Error", success: false };
    }

    revalidatePath(`/admin/courses/${courseId}`);
    revalidatePath("/admin/courses");
    revalidatePath("/courses");
    return { message: "Course updated successfully!", success: true };
}
