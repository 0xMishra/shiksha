import { z } from "zod";

export const courseCreationSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().optional(),
  price: z.number().default(0),
});

export type courseCreationType = z.infer<typeof courseCreationSchema>;

export const chapterCreationSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().optional(),
  video: z.string(),
});

export type chapeterCreationType = z.infer<typeof chapterCreationSchema>;
