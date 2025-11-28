-- AlterTable
ALTER TABLE `invoicetable` ADD COLUMN `ChangedOn` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    ADD COLUMN `CreatedOn` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0);

-- AlterTable
ALTER TABLE `quotationtable` ADD COLUMN `CaseID` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `down_payment_table` (
    `ID_DP_table` INTEGER NOT NULL AUTO_INCREMENT,
    `CaseID` VARCHAR(191) NULL,
    `DPAmount` DECIMAL(12, 2) NOT NULL DEFAULT 0,
    `DPDate` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `PaymentType` VARCHAR(20) NULL,
    `DPNote` TEXT NULL,
    `CreatedBy` INTEGER NOT NULL,
    `CreatedOn` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),
    `ChangedOn` DATETIME(0) NOT NULL DEFAULT CURRENT_TIMESTAMP(0),

    PRIMARY KEY (`ID_DP_table`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `down_payment_table` ADD CONSTRAINT `down_payment_table_CaseID_fkey` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `down_payment_table` ADD CONSTRAINT `down_payment_table_CreatedBy_fkey` FOREIGN KEY (`CreatedBy`) REFERENCES `User`(`IDUser`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `quotationtable` ADD CONSTRAINT `quotationtable_CaseID_fkey` FOREIGN KEY (`CaseID`) REFERENCES `caseinformation`(`CaseID`) ON DELETE RESTRICT ON UPDATE CASCADE;
