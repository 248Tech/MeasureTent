import { z } from 'zod';
import {
  ADD_ON_KEYS,
  SEATING_STYLES,
  TENT_TYPES,
  type CalculationResult,
  type Geometry,
  type TentRecommendation,
} from '../types';

export const GeometrySchema: z.ZodType<Geometry> = z.object({
  width: z.number().finite().positive(),
  length: z.number().finite().positive(),
});

export const TentRecommendationSchema: z.ZodType<TentRecommendation> = z.object({
  width: z.number().finite().positive(),
  length: z.number().finite().positive(),
  area: z.number().finite().positive(),
});

export const CalculationInputSchema = z.object({
  guestCount: z.number().int().positive(),
  seatingStyle: z.enum(SEATING_STYLES),
  tentType: z.enum(TENT_TYPES),
  addOns: z.array(z.enum(ADD_ON_KEYS)),
});

export const CalculationResultSchema: z.ZodType<CalculationResult> = z.object({
  requiredSqFt: z.number().finite().nonnegative(),
  recommendedTentSize: TentRecommendationSchema,
  tables: z.number().int().nonnegative(),
  chairs: z.number().int().nonnegative(),
  geometry: GeometrySchema,
});
