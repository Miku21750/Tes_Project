/*
  Warnings:

  - Added the required column `CaseId` to the `ActionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `ActionLog` ADD COLUMN `CaseId` VARCHAR(191) NOT NULL;

-- AddForeignKey
ALTER TABLE `ActionLog` ADD CONSTRAINT `ActionLog_CaseId_fkey` FOREIGN KEY (`CaseId`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE CASCADE;
