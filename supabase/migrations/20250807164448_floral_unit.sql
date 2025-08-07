/*
  # Add price column to products table

  1. Changes
    - Add `price` column to `products` table with type `text`
    - Set default value to empty string for existing records
    - Make the column NOT NULL to ensure data consistency

  2. Notes
    - This resolves the "Could not find the 'price' column" error
    - Existing products will have empty price values that can be updated later
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'price'
  ) THEN
    ALTER TABLE products ADD COLUMN price text NOT NULL DEFAULT '';
  END IF;
END $$;