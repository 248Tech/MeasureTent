import type { TentConfig } from '@measurtent/config';
import type { Geometry, TentRecommendation, TentType } from '@measurtent/shared';

function roundUpToIncrement(value: number, increment: number): number {
  if (value <= 0) {
    return increment;
  }

  return Math.ceil(value / increment) * increment;
}

export function recommendTentSize(
  requiredSqFt: number,
  tentType: TentType,
  config: TentConfig,
): TentRecommendation {
  if (!Number.isFinite(requiredSqFt) || requiredSqFt < 0) {
    throw new Error('requiredSqFt must be a finite non-negative number');
  }

  const tentTypeConfig = config.tentTypes[tentType];

  if (!tentTypeConfig) {
    throw new Error(`Unknown tent type: ${tentType}`);
  }

  if (tentTypeConfig.widthIncrements.length === 0) {
    throw new Error(`Tent type ${tentType} has no width increments configured`);
  }

  const targetSqFt = requiredSqFt * tentTypeConfig.bufferFactor;
  const sortedWidths = [...tentTypeConfig.widthIncrements].sort((a, b) => a - b);

  let best: TentRecommendation | null = null;

  for (const width of sortedWidths) {
    if (!Number.isFinite(width) || width <= 0) {
      throw new Error(`Invalid width increment for tent type ${tentType}`);
    }

    const length = roundUpToIncrement(targetSqFt / width, tentTypeConfig.lengthIncrement);
    const area = width * length;

    if (area < targetSqFt) {
      continue;
    }

    if (!best || area < best.area || (area === best.area && width < best.width)) {
      best = { width, length, area };
    }
  }

  if (!best) {
    throw new Error(`No tent size can satisfy ${requiredSqFt} sq ft for type ${tentType}`);
  }

  return best;
}

export function buildGeometry(recommendation: TentRecommendation): Geometry {
  return {
    width: recommendation.width,
    length: recommendation.length,
  };
}
