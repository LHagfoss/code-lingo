import { createClient } from "@/utils/supabase/server";
import { cache } from "react";
import { getAuthUser } from "@/queries/user/users";

export const getCourseById = cache(async (id: number) => {
    const supabase = await createClient();
    const { data: course } = await supabase
        .from("courses")
        .select("*")
        .eq("id", id)
        .single();
    return course;
});

export const getCourses = cache(async () => {
    const supabase = await createClient();
    const { data: courses } = await supabase
        .from("courses")
        .select("*")
        .order("id");
    return courses || [];
});

export const getCourseContent = cache(async () => {
    const supabase = await createClient();
    const user = await getAuthUser();

    const { data: courses } = await supabase
        .from("courses")
        .select(`
        *,
        units (
          *,
          lessons (*)
        )
      `)
        .order("id");

    if (!courses || courses.length === 0) return null;

    if (user?.active_course_id) {
        const activeCourse = courses.find(
            (c) => c.id === user.active_course_id,
        );
        if (activeCourse) return activeCourse;
    }

    return courses[0];
});
