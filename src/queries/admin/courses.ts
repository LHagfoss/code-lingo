import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

export const getCourseWithUnits = cache(async (courseId: string) => {
    const supabase = await createClient();
    const { data: course } = await supabase
        .from("courses")
        .select(`
        *,
        units (*)
      `)
        .eq("id", courseId)
        .single();

    if (course?.units) {
        course.units.sort((a: any, b: any) => a.order - b.order);
    }

    return course;
});

export const getNextUnitOrder = cache(async (courseId: string) => {
    const supabase = await createClient();

    const { data } = await supabase

        .from("units")

        .select("order")

        .eq("course_id", courseId)

        .order("order", { ascending: false })

        .limit(1)

        .single();

    return (data?.order ?? 0) + 1;
});
