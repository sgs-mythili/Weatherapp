import { z } from "zod";

export const favoriteSchema = z.object({
  city: z.string().trim().min(2, "City must be at least 2 characters"),

  nickname: z.string().trim().optional(),

  notes: z.string().max(100, "Notes must be 100 characters or less").optional(),
});

export type FavoriteFormData =z.infer<typeof favoriteSchema>;