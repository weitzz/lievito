ALTER TABLE "Product"
ADD COLUMN "category" TEXT NOT NULL DEFAULT 'Tradicionais',
ADD COLUMN "vegetarian" BOOLEAN NOT NULL DEFAULT false;

UPDATE "Product"
SET "category" = 'Vegetarianas', "vegetarian" = true
WHERE "name" IN ('Margherita', 'Vegetariana');

UPDATE "Product"
SET "category" = 'Especiais', "vegetarian" = true
WHERE "name" = 'Quatro Queijos';

CREATE INDEX "Product_category_idx" ON "Product"("category");
CREATE INDEX "Product_vegetarian_idx" ON "Product"("vegetarian");
CREATE INDEX "Product_price_idx" ON "Product"("price");
CREATE INDEX "Order_status_idx" ON "Order"("status");

UPDATE "Product" SET "image" = 'calabresa.png' WHERE "name" = 'Calabresa com Cebola';
UPDATE "Product" SET "image" = 'margherita.png' WHERE "name" = 'Margherita';
UPDATE "Product" SET "image" = 'quatro-queijos.png' WHERE "name" = 'Quatro Queijos';
UPDATE "Product" SET "image" = 'pepperoni.png' WHERE "name" = 'Pepperoni';
UPDATE "Product" SET "image" = 'portuguesa.png' WHERE "name" = 'Portuguesa';
UPDATE "Product" SET "image" = 'vegetariana.png' WHERE "name" = 'Vegetariana';
