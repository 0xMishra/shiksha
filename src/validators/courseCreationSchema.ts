import { z } from "zod";

export const courseCreationSchema = z.object({
  name: z.string().trim().min(3),
  description: z.string().trim().optional(),
  price: z.number().default(0),
});

export type courseCreationType = z.infer<typeof courseCreationSchema>;
