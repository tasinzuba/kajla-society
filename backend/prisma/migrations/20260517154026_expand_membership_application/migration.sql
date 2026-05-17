/*
  Warnings:

  - You are about to drop the column `block` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `documents` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `houseNo` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `nidNumber` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `occupation` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `MembershipApplication` table. All the data in the column will be lost.
  - You are about to drop the column `road` on the `MembershipApplication` table. All the data in the column will be lost.
  - Added the required column `mobile` to the `MembershipApplication` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "MembershipApplication" DROP COLUMN "block",
DROP COLUMN "documents",
DROP COLUMN "houseNo",
DROP COLUMN "nidNumber",
DROP COLUMN "occupation",
DROP COLUMN "phone",
DROP COLUMN "road",
ADD COLUMN     "agreedDeclaration" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "bloodGroup" TEXT,
ADD COLUMN     "children" JSONB,
ADD COLUMN     "dateOfBirth" TIMESTAMP(3),
ADD COLUMN     "designation" TEXT,
ADD COLUMN     "fatherName" TEXT,
ADD COLUMN     "fullNameBn" TEXT,
ADD COLUMN     "gender" TEXT,
ADD COLUMN     "membershipType" TEXT NOT NULL DEFAULT 'Life',
ADD COLUMN     "mobile" TEXT NOT NULL,
ADD COLUMN     "motherName" TEXT,
ADD COLUMN     "nidUrl" TEXT,
ADD COLUMN     "officePhone" TEXT,
ADD COLUMN     "organization" TEXT,
ADD COLUMN     "photoUrl" TEXT,
ADD COLUMN     "profession" TEXT,
ADD COLUMN     "propertyOwner" TEXT,
ADD COLUMN     "propertyScheduleSummary" TEXT,
ADD COLUMN     "proposerMembershipNo" TEXT,
ADD COLUMN     "proposerName" TEXT,
ADD COLUMN     "relationshipToProperty" TEXT,
ADD COLUMN     "residenceAddress" TEXT,
ADD COLUMN     "residencePhone" TEXT,
ADD COLUMN     "seconderMembershipNo" TEXT,
ADD COLUMN     "seconderName" TEXT,
ADD COLUMN     "spouseName" TEXT,
ADD COLUMN     "taxReceiptUrl" TEXT;
