-- Fix FK: watchlists.user_id soll auf public.users(id) zeigen (Clerk-basiertes Modell)
-- Vorher: references auth.users(id) → Nachher: references public.users(id)

ALTER TABLE public.watchlists
  DROP CONSTRAINT IF EXISTS watchlists_user_id_fkey;

ALTER TABLE public.watchlists
  ADD CONSTRAINT watchlists_user_id_fkey
  FOREIGN KEY (user_id)
  REFERENCES public.users(id)
  ON DELETE SET NULL;
