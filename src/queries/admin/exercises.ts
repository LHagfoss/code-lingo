import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

export const getExerciseWithOptions = cache(async (exerciseId: string) => {
    const supabase = await createClient();
    const { data: exercise } = await supabase
        .from("exercises")
        .select(`
        *,
        challenge_options (*)
      `)
        .eq("id", exerciseId)
        .single();

    return exercise;
});
