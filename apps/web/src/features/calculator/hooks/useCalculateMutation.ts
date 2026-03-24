import { useMutation } from '@tanstack/react-query';
import { calculateTent } from '../api/calculateClient';
import type { CalculatorInput } from '../contracts';

export function useCalculateMutation(tenantId?: string) {
  return useMutation({
    mutationFn: (payload: CalculatorInput) =>
      calculateTent(payload, tenantId ? { tenantId } : {}),
  });
}
