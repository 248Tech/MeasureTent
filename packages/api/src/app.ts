import fastify, { type FastifyInstance } from 'fastify';
import { sensiblePlugin } from './plugins/sensible.js';
import { swaggerPlugin } from './plugins/swagger.js';
import { calculateRoute, type CalculateRouteOptions } from './routes/v1/calculate.js';

export interface BuildAppOptions extends CalculateRouteOptions {
  logger?: boolean;
}

export async function buildApp(options: BuildAppOptions = {}): Promise<FastifyInstance> {
  const app = fastify({
    logger: options.logger ?? true,
  });

  await app.register(sensiblePlugin);
  await app.register(swaggerPlugin);

  app.get(
    '/health',
    {
      schema: {
        tags: ['health'],
        response: {
          200: {
            type: 'object',
            required: ['status'],
            properties: {
              status: { type: 'string', const: 'ok' },
            },
            additionalProperties: false,
          },
        },
      },
    },
    async () => ({ status: 'ok' as const }),
  );

  await app.register(calculateRoute, {
    prefix: '/v1',
    ...(options.calculate ? { calculate: options.calculate } : {}),
    ...(options.loadConfig ? { loadConfig: options.loadConfig } : {}),
  });

  return app;
}

export default buildApp;
