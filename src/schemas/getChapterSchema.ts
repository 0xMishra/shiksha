import * as z from "zod";

export const getChapterSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string(),
  videoUrl: z.string(),
  courseId: z.string(),
});
