-- CreateEnum
CREATE TYPE "Role" AS ENUM ('SUPER_ADMIN', 'ADMIN', 'EDITOR', 'MODERATOR', 'MEMBER');

-- CreateEnum
CREATE TYPE "FacilityCategory" AS ENUM ('RELIGIOUS', 'EDUCATIONAL', 'HEALTH_EMERGENCY', 'CONSTRUCTION', 'LOCAL_SERVICES', 'GOVERNMENT', 'COMMUNITY_ORG');

-- CreateEnum
CREATE TYPE "MediaType" AS ENUM ('PHOTO', 'VIDEO');

-- CreateEnum
CREATE TYPE "ApplicationStatus" AS ENUM ('PENDING', 'APPROVED', 'REJECTED');

-- CreateEnum
CREATE TYPE "AdoptionTarget" AS ENUM ('ROAD', 'GATE');

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "passwordHash" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "phone" TEXT,
    "avatar" TEXT,
    "role" "Role" NOT NULL DEFAULT 'MEMBER',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "lastLoginAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Page" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleBn" TEXT,
    "content" TEXT NOT NULL,
    "contentBn" TEXT,
    "metaTitle" TEXT,
    "metaDesc" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "Page_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Category" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Article" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleBn" TEXT,
    "excerpt" TEXT,
    "content" TEXT NOT NULL,
    "contentBn" TEXT,
    "coverImage" TEXT,
    "isPublished" BOOLEAN NOT NULL DEFAULT false,
    "publishedAt" TIMESTAMP(3),
    "viewCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,
    "categoryId" TEXT,

    CONSTRAINT "Article_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleBn" TEXT,
    "description" TEXT NOT NULL,
    "coverImage" TEXT,
    "location" TEXT,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "Event_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Notice" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleBn" TEXT,
    "content" TEXT NOT NULL,
    "attachment" TEXT,
    "isPinned" BOOLEAN NOT NULL DEFAULT false,
    "isPublished" BOOLEAN NOT NULL DEFAULT true,
    "publishedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "authorId" TEXT,

    CONSTRAINT "Notice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CommitteeMember" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT,
    "role" TEXT NOT NULL,
    "roleBn" TEXT,
    "photo" TEXT,
    "bio" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "term" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CommitteeMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resident" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "fullNameBn" TEXT,
    "houseNo" TEXT NOT NULL,
    "road" TEXT,
    "block" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "membershipNo" TEXT,
    "photo" TEXT,
    "isVerified" BOOLEAN NOT NULL DEFAULT false,
    "isPublic" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Resident_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Facility" (
    "id" TEXT NOT NULL,
    "category" "FacilityCategory" NOT NULL,
    "name" TEXT NOT NULL,
    "nameBn" TEXT,
    "description" TEXT,
    "address" TEXT,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "image" TEXT,
    "order" INTEGER NOT NULL DEFAULT 0,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Facility_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Gallery" (
    "id" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "titleBn" TEXT,
    "description" TEXT,
    "coverImage" TEXT,
    "type" "MediaType" NOT NULL DEFAULT 'PHOTO',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gallery_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Media" (
    "id" TEXT NOT NULL,
    "url" TEXT NOT NULL,
    "thumbnail" TEXT,
    "caption" TEXT,
    "type" "MediaType" NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "galleryId" TEXT,

    CONSTRAINT "Media_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "MembershipApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "houseNo" TEXT NOT NULL,
    "road" TEXT,
    "block" TEXT,
    "nidNumber" TEXT,
    "occupation" TEXT,
    "documents" TEXT[],
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MembershipApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CarStickerApplication" (
    "id" TEXT NOT NULL,
    "fullName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "houseNo" TEXT NOT NULL,
    "vehicleType" TEXT NOT NULL,
    "brandModel" TEXT NOT NULL,
    "registrationNo" TEXT NOT NULL,
    "color" TEXT,
    "documents" TEXT[],
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CarStickerApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AdoptionRequest" (
    "id" TEXT NOT NULL,
    "target" "AdoptionTarget" NOT NULL,
    "applicantName" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "organization" TEXT,
    "locationRef" TEXT NOT NULL,
    "message" TEXT,
    "status" "ApplicationStatus" NOT NULL DEFAULT 'PENDING',
    "adminNote" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AdoptionRequest_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ContactMessage" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "phone" TEXT,
    "subject" TEXT,
    "message" TEXT NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ContactMessage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Setting" (
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Setting_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE INDEX "User_role_idx" ON "User"("role");

-- CreateIndex
CREATE UNIQUE INDEX "Page_slug_key" ON "Page"("slug");

-- CreateIndex
CREATE INDEX "Page_slug_idx" ON "Page"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Article_slug_key" ON "Article"("slug");

-- CreateIndex
CREATE INDEX "Article_isPublished_publishedAt_idx" ON "Article"("isPublished", "publishedAt");

-- CreateIndex
CREATE INDEX "Article_slug_idx" ON "Article"("slug");

-- CreateIndex
CREATE UNIQUE INDEX "Event_slug_key" ON "Event"("slug");

-- CreateIndex
CREATE INDEX "Event_startsAt_idx" ON "Event"("startsAt");

-- CreateIndex
CREATE INDEX "Notice_publishedAt_idx" ON "Notice"("publishedAt");

-- CreateIndex
CREATE INDEX "CommitteeMember_term_order_idx" ON "CommitteeMember"("term", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Resident_membershipNo_key" ON "Resident"("membershipNo");

-- CreateIndex
CREATE INDEX "Resident_houseNo_idx" ON "Resident"("houseNo");

-- CreateIndex
CREATE INDEX "Resident_fullName_idx" ON "Resident"("fullName");

-- CreateIndex
CREATE INDEX "Facility_category_order_idx" ON "Facility"("category", "order");

-- CreateIndex
CREATE UNIQUE INDEX "Gallery_slug_key" ON "Gallery"("slug");

-- CreateIndex
CREATE INDEX "Media_galleryId_order_idx" ON "Media"("galleryId", "order");

-- CreateIndex
CREATE INDEX "MembershipApplication_status_idx" ON "MembershipApplication"("status");

-- CreateIndex
CREATE INDEX "CarStickerApplication_status_idx" ON "CarStickerApplication"("status");

-- CreateIndex
CREATE INDEX "AdoptionRequest_target_status_idx" ON "AdoptionRequest"("target", "status");

-- CreateIndex
CREATE INDEX "ContactMessage_isRead_createdAt_idx" ON "ContactMessage"("isRead", "createdAt");

-- AddForeignKey
ALTER TABLE "Page" ADD CONSTRAINT "Page_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Article" ADD CONSTRAINT "Article_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event" ADD CONSTRAINT "Event_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Notice" ADD CONSTRAINT "Notice_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Media" ADD CONSTRAINT "Media_galleryId_fkey" FOREIGN KEY ("galleryId") REFERENCES "Gallery"("id") ON DELETE CASCADE ON UPDATE CASCADE;
