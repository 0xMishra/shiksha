-- CreateTable
CREATE TABLE "CourseReview" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "ratings" INTEGER NOT NULL DEFAULT 0,
    "courseId" TEXT NOT NULL,
    "creatorId" TEXT NOT NULL,

    CONSTRAINT "CourseReview_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_courseId_fkey" FOREIGN KEY ("courseId") REFERENCES "Course"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CourseReview" ADD CONSTRAINT "CourseReview_creatorId_fkey" FOREIGN KEY ("creatorId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
