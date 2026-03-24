import type { TentConfig } from '@measurtent/config';
import type { CalculationInput, CalculationResult } from '@measurtent/shared';
import { calculateAddOnSqFt } from './addons';
import { buildGeometry, recommendTentSize } from './geometry';

function assertNonNegativeInteger(value: number, label: string): void {
  if (!Number.isInteger(value) || value < 0) {
    throw new Error(`${label} must be a non-negative integer`);
  }
}

export function calculate(input: CalculationInput, config: TentConfig): CalculationResult {
  assertNonNegativeInteger(input.guestCount, 'guestCount');

  const seatingStyleConfig = config.seatingStyles[input.seatingStyle];
  if (!seatingStyleConfig) {
    throw new Error(`Unknown seating style: ${input.seatingStyle}`);
  }

  const addOnSqFt = calculateAddOnSqFt(input.addOns, config.addOns);
  const requiredSqFt =
    input.guestCount * seatingStyleConfig.sqftPerPerson + addOnSqFt + config.aisleBuffer;

  const recommendedTentSize = recommendTentSize(requiredSqFt, input.tentType, config);
  const tables =
    input.seatingStyle === 'reception' || input.seatingStyle === 'theater'
      ? 0
      : Math.ceil(input.guestCount / Math.max(1, seatingStyleConfig.seatsPerTable));

  return {
    requiredSqFt,
    recommendedTentSize,
    tables,
    chairs: input.guestCount,
    geometry: buildGeometry(recommendedTentSize),
  };
}
