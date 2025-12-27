import { z } from "zod";

export const courseSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(50),
    image_src: z.string().min(3, "Image URL must be at least 3 characters"),
});

export const unitSchema = z.object({
    title: z.string().min(3, "Title must be at least 3 characters").max(50),
    description: z
        .string()
        .min(10, "Description must be at least 10 characters"),
    order: z.coerce.number().min(1, "Order must be at least 1"),
});
