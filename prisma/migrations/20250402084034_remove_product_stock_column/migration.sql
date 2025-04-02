/*
  Warnings:

  - You are about to drop the column `stock` on the `Product` table. All the data in the column will be lost.
  - The primary key for the `StockMovement` table will be changed. If it partially fails, the table could be left without primary key constraint.

*/
-- AlterTable
ALTER TABLE "Product" DROP COLUMN "stock";

-- AlterTable
ALTER TABLE "StockMovement" DROP CONSTRAINT "StockMovement_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "StockMovement_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "StockMovement_id_seq";
