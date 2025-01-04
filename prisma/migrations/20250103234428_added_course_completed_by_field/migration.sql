-- CreateTable
CREATE TABLE "_completed by" (
    "A" TEXT NOT NULL,
    "B" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_completed by_AB_unique" ON "_completed by"("A", "B");

-- CreateIndex
CREATE INDEX "_completed by_B_index" ON "_completed by"("B");

-- AddForeignKey
ALTER TABLE "_completed by" ADD CONSTRAINT "_completed by_A_fkey" FOREIGN KEY ("A") REFERENCES "Course"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_completed by" ADD CONSTRAINT "_completed by_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
