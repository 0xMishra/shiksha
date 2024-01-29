import * as z from "zod";

export const addChaptersToCourseSchema = z.object({
  name: z.string().min(3),
  desc: z.string().min(5),
  videoUrl: z.string().min(10),
  courseId: z.string().min(10),
});
