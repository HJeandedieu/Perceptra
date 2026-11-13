CREATE TABLE "LoginRate" ("id" TEXT NOT NULL, "attempts" INTEGER NOT NULL DEFAULT 1, "expiresAt" TIMESTAMP(3) NOT NULL, CONSTRAINT "LoginRate_pkey" PRIMARY KEY ("id"));
CREATE INDEX "LoginRate_expiresAt_idx" ON "LoginRate"("expiresAt");
