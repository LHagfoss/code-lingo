import { z } from "zod";

export const lessonSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(50),
    order: z.coerce.number().min(1, "Order must be at least 1"),
});

export const exerciseSchema = z.object({
    question: z.string().min(5, "Question must be at least 5 characters"),
    type: z
        .enum(["SELECT", "ASSIST", "INFO", "CODE_ARRANGE"])
        .default("SELECT"),
});

export const optionSchema = z.object({
    text: z.string().min(1, "Option text cannot be empty"),
    correct: z.boolean(),
});
