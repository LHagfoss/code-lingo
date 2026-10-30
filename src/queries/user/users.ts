import { cache } from "react";
import { auth } from "@/auth";
import { createClient } from "@/utils/supabase/server";

export const getUser = cache(async (email: string) => {
    const supabase = await createClient();
    const { data } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();
    return data;
});

export const createUser = async (
    email: string,
    name?: string | null,
    image?: string | null,
) => {
    const supabase = await createClient();
    const { data, error } = await supabase
        .from("users")
        .insert({ email, name, image })
        .select()
        .single();

    if (error) {
        console.error("Failed to create user:", error);
        return null;
    }
    return data;
};

export const getAuthUser = cache(async () => {
    const session = await auth();
    const email = session?.user?.email;

    if (!email) return null;

    const supabase = await createClient();
    const { data: dbUser } = await supabase
        .from("users")
        .select("*")
        .eq("email", email)
        .single();

    return dbUser;
});
