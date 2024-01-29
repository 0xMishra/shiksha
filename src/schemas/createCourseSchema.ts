import * as z from "zod";

export const createCourseSchema = z.object({
  name: z.string().min(4),
  price: z.string(),
  banner: z.string().min(10),
});
