-- CreateTable
CREATE TABLE `ActionLog` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `model` VARCHAR(100) NOT NULL,
    `dataOld` VARCHAR(50) NOT NULL,
    `dataNew` VARCHAR(50) NOT NULL,
    `changedBy` INTEGER NULL,
    `ChangeAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `ActionLog` ADD CONSTRAINT `ActionLog_changedBy_fkey` FOREIGN KEY (`changedBy`) REFERENCES `User`(`IDUser`) ON DELETE SET NULL ON UPDATE CASCADE;
