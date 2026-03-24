import type { FastifyPluginAsync } from 'fastify';
import { CalculationInputSchema, type CalculationInput, type CalculationResult } from '@measurtent/shared';
import { calculate as defaultCalculate } from '@measurtent/engine';
import { loadConfig as defaultLoadConfig, type TentConfig } from '@measurtent/config';

export type CalculateFn = (input: CalculationInput, config: TentConfig) => CalculationResult;
export type LoadConfigFn = (tenantId?: string) => Promise<TentConfig>;

export interface CalculateRouteOptions {
  calculate?: CalculateFn;
  loadConfig?: LoadConfigFn;
}

function getTenantId(headerValue: string | string[] | undefined): string | undefined {
  if (Array.isArray(headerValue)) {
    return headerValue[0];
  }

  return headerValue;
}

export const calculateRoute: FastifyPluginAsync<CalculateRouteOptions> = async (app, options) => {
  const calculate = options.calculate ?? defaultCalculate;
  const loadConfig = options.loadConfig ?? defaultLoadConfig;

  app.post(
    '/calculate',
    {
      schema: {
        tags: ['calculate'],
        summary: 'Calculate tent and seating requirements',
        body: {
          type: 'object',
          additionalProperties: true,
          description: 'Validated against shared CalculationInput Zod schema.',
        },
        response: {
          200: {
            type: 'object',
            additionalProperties: true,
            description: 'CalculationResult payload from the core engine.',
          },
        },
      },
    },
    async (request, reply) => {
      const parsedInput = CalculationInputSchema.safeParse(request.body);

      if (!parsedInput.success) {
        return reply.code(400).send({
          message: 'Invalid calculation payload',
          issues: parsedInput.error.issues,
        });
      }

      const tenantId = getTenantId(request.headers['x-tenant-id']);
      const config = await loadConfig(tenantId);
      const result = calculate(parsedInput.data, config);

      return reply.code(200).send(result);
    },
  );
};

export default calculateRoute;
