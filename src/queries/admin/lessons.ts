import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

export const getLessonWithExercises = cache(async (lessonId: string) => {
    const supabase = await createClient();
    const { data: lesson } = await supabase
        .from("lessons")
        .select(`
        *,
        exercises (*)
      `)
        .eq("id", lessonId)
        .single();

    if (lesson && lesson.exercises) {
        lesson.exercises.sort(
            (a: any, b: any) => (a.order ?? 0) - (b.order ?? 0),
        );
    }

    return lesson;
});

export const getNextLessonOrder = cache(async (unitId: string) => {
    const supabase = await createClient();

    const { data } = await supabase

        .from("lessons")

        .select("order")

        .eq("unit_id", unitId)

        .order("order", { ascending: false })

        .limit(1)

        .single();

    return (data?.order ?? 0) + 1;
});
