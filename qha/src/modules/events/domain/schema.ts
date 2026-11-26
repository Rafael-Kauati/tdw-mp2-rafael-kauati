import { z } from 'zod';

/**
 * Schemas do formato BRUTO da API (snake_case, muitos campos opcionais/null).
 * Só declaramos os campos que usamos: o zod ignora os restantes.
 * `.nullish()` = pode faltar OU vir null (a API usa ambos, ex.: "pitch": null).
 */

export const rawEventSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  starts_at: z.string().min(1),
  ends_at: z.string().nullish(),

  venue_id: z.string().nullish(),
  venue_name: z.string().nullish(),
  address: z.string().nullish(),
  distrito: z.string().nullish(),
  concelho: z.string().nullish(),
  lat: z.number().nullish(),
  lon: z.number().nullish(),

  url: z.string().nullish(),
  image_url: z.string().nullish(),
  description: z.string().nullish(),
  pitch: z.string().nullish(),

  genre: z.string().nullish(),
  tags: z.array(z.string()).nullish(),
  price_min: z.number().nullish(),
  sold_out: z.union([z.number(), z.boolean()]).nullish(),
  relevance_score: z.number().nullish(),
  first_seen_at: z.string().nullish(),
});

export type RawEvent = z.infer<typeof rawEventSchema>;

export const rawStatsSchema = z.object({
  total_events: z.number(),
  active_venues: z.number(),
  active_concelhos: z.number(),
  active_distritos: z.number(),
  distritos: z.array(z.string()),
  by_distrito: z.record(
    z.string(),
    z.object({
      events: z.number(),
      venues: z.number(),
      concelhos: z.number(),
    }),
  ),
  total_venues_in_catalog: z.number(),
});

export type RawStats = z.infer<typeof rawStatsSchema>;

/**
 * O ficheiro completo. `events` e `stats` ficam como `unknown` de propósito:
 * validamos evento a evento (e as estatísticas à parte), para que UM item
 * mau não invalide as 5000+ linhas. `stats` é `.optional()` porque no zod 4 um
 * `z.unknown()` simples seria obrigatório (a chave teria de existir).
 */
export const rawFeedSchema = z.object({
  generated_at: z.string().nullish(),
  stats: z.unknown().optional(),
  events: z.array(z.unknown()),
});