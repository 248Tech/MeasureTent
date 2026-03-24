import { calculateInputSchema, calculateResultSchema, type CalculatorInput, type CalculatorResult } from '../contracts';

interface CalculateRequestOptions {
  tenantId?: string;
}

export async function calculateTent(
  payload: CalculatorInput,
  options: CalculateRequestOptions = {},
): Promise<CalculatorResult> {
  const validPayload = calculateInputSchema.parse(payload);
  const response = await fetch('/v1/calculate', {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      ...(options.tenantId ? { 'x-tenant-id': options.tenantId } : {}),
    },
    body: JSON.stringify(validPayload),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(bodyText || `Calculation failed with status ${response.status}`);
  }

  const json = (await response.json()) as unknown;
  return calculateResultSchema.parse(json);
}
