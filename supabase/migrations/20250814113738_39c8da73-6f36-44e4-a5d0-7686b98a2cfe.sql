-- Update existing products with sample paypage_id (this should be updated with real values)
-- For now, I'll set the paypage_id that the user provided (3a86b) for testing
UPDATE public.products 
SET icount_paypage_id = '3a86b' 
WHERE title LIKE '%אקסלרטור%' OR title LIKE '%עסק%' OR title LIKE '%business%';