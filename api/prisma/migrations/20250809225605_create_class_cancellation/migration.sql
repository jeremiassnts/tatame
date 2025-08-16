-- CreateTable
CREATE TABLE "class_cancellation" (
    "id" TEXT NOT NULL,
    "reference_date" TIMESTAMP(3) NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL,
    "class_id" TEXT NOT NULL,

    CONSTRAINT "class_cancellation_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "class_cancellation" ADD CONSTRAINT "class_cancellation_class_id_fkey" FOREIGN KEY ("class_id") REFERENCES "classes"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
