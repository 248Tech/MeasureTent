import type { TentConfig } from '@measurtent/config';
import type { AddOnKey } from '@measurtent/shared';

export function calculateAddOnSqFt(
  addOns: readonly AddOnKey[],
  catalog: TentConfig['addOns'],
): number {
  const uniqueAddOns = new Set(addOns);

  let totalSqFt = 0;
  for (const addOnName of uniqueAddOns) {
    const addOn = catalog[addOnName];
    if (!addOn) {
      throw new Error(`Unknown add-on: ${addOnName}`);
    }

    if (!Number.isFinite(addOn.sqft) || addOn.sqft < 0) {
      throw new Error(`Invalid sqft for add-on: ${addOnName}`);
    }

    totalSqFt += addOn.sqft;
  }

  return totalSqFt;
}
