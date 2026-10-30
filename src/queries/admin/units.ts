import { cache } from "react";
import { createClient } from "@/utils/supabase/server";

export const getUnitWithLessons = cache(async (unitId: string) => {
    const supabase = await createClient();
    const { data: unit } = await supabase
        .from("units")
        .select(`
        *,
        lessons (*)
      `)
        .eq("id", unitId)
        .single();

    if (unit?.lessons) {
        unit.lessons.sort((a: any, b: any) => a.order - b.order);
    }

    return unit;
});
