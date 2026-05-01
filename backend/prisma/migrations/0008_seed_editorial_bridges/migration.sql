-- Seed three editorial bridge-page records (home / our-story /
-- seasonaldrops-hemanta) so admins can immediately edit them in
-- /admin/bridge-pages once Decision #31 deploys.
--
-- Uses ON CONFLICT (slug) DO NOTHING so this migration is idempotent and
-- safe to re-run; admin edits to existing rows are never overwritten.
-- All editorial-slot columns are left NULL by default — the public pages
-- fall back to bundled-asset paths until admin uploads replacements.

INSERT INTO "ShopBridgePage" (
  id, slug, "navLabel", "heroEyebrow", "heroTitle", "heroDescriptionJson",
  "heroImage", "heroImageAlt", "heroQuote", "introTitle", "introDescription",
  "createdAt", "updatedAt"
) VALUES
  (
    'editbridge-home-0001',
    'home',
    'Home',
    'Seijaku: Quietly Arranged',
    'Perfume rituals for modern calm',
    '["Signature scents paired with handcrafted Bengal forms — made to gift or keep."]'::jsonb,
    '/images/Ritual set HP Hero 1.png',
    'Home page hero',
    'Quietly arranged.',
    'Editorial slots for the home page',
    'This bridge holds the editorial media for the home page hero and the four "Explore fragrance rituals" cards. Edit the Home / Card N image fields to replace any bundled defaults.',
    NOW(), NOW()
  ),
  (
    'editbridge-ourstory-0001',
    'our-story',
    'Our Story',
    'Our Story',
    'Seijaku began with a quiet conviction',
    '["The objects we live with shape the quality of our inner lives."]'::jsonb,
    '/images/japanese fan hero Our Story.png',
    'Our Story page hero',
    'Founded in Kolkata. Rooted in craft. Guided by season.',
    'Editorial slots for the Our Story page',
    'This bridge holds the Our Story hero image and the two "In the Making" video loops. Set Ritual video 1/2 URL to the looping mp4; the public page autoplays muted.',
    NOW(), NOW()
  ),
  (
    'editbridge-hemanta-0001',
    'seasonaldrops-hemanta',
    'Hemanta Seasonal Drop',
    'Hemanta',
    'Seasonal Drop 01',
    '["100 years of Rabindranath Tagore''s Raktakarabi"]'::jsonb,
    '/images/Hemanta drop HP banner 1.png',
    'Hemanta Seasonal Drop hero banner',
    'There is a particular quality of light in Bengal at the onset of Hemanta.',
    'Editorial slots for the Hemanta seasonaldrop page',
    'This bridge holds the Hemanta hero, the four form-character images (Nandini / Raja / Ispani / Rishi), and the three mid-page image breaks.',
    NOW(), NOW()
  )
ON CONFLICT (slug) DO NOTHING;
