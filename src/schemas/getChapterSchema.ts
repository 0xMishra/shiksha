import * as z from "zod";

export const getChapterSchema = z.object({
  courseId: z.string(),
  description: z.string(),
  id: z.string(),
  isCompleted: z.boolean().default(false),
  name: z.string(),
  videoUrl: z.string(),
});
