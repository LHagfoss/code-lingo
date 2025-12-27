import { z } from "zod";

export const onboardingSchema = z.object({
    username: z
        .string()
        .min(3, "Username must be at least 3 characters")
        .max(20, "Username must be at most 20 characters"),
    courseId: z.string().min(1, "Please select a course"),
});
