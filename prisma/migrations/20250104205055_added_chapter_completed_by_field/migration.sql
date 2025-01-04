-- CreateTable
CREATE TABLE "_ChapterToUser" (
    "A" INTEGER NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_ChapterToUser_AB_unique" ON "_ChapterToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_ChapterToUser_B_index" ON "_ChapterToUser"("B");

-- AddForeignKey
ALTER TABLE "_ChapterToUser" ADD CONSTRAINT "_ChapterToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Chapter"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_ChapterToUser" ADD CONSTRAINT "_ChapterToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
