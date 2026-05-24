-- AlterTable
ALTER TABLE "Tenant" ADD COLUMN     "bannerUrl" TEXT,
ADD COLUMN     "logoUrl" TEXT,
ADD COLUMN     "primaryColor" TEXT DEFAULT '#4f46e5',
ADD COLUMN     "secondaryColor" TEXT DEFAULT '#7c3aed',
ADD COLUMN     "storeDescription" TEXT,
ADD COLUMN     "storeName" TEXT;
