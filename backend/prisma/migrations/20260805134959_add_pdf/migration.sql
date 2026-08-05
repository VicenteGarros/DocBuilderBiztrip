-- CreateTable
CREATE TABLE "Pdf" (
    "id" TEXT NOT NULL,
    "proposalId" TEXT NOT NULL,
    "data" BYTEA NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Pdf_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Pdf_proposalId_key" ON "Pdf"("proposalId");

-- AddForeignKey
ALTER TABLE "Pdf" ADD CONSTRAINT "Pdf_proposalId_fkey" FOREIGN KEY ("proposalId") REFERENCES "Proposal"("id") ON DELETE CASCADE ON UPDATE CASCADE;
