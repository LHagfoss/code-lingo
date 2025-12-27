import { createClient } from "@/utils/supabase/server";
import { cache } from "react";

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

    if (unit && unit.lessons) {
        unit.lessons.sort((a: any, b: any) => a.order - b.order);
    }

    return unit;
});
