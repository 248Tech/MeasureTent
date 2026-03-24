import type { FastifyPluginAsync } from 'fastify';
import swagger from '@fastify/swagger';
import swaggerUi from '@fastify/swagger-ui';

export interface SwaggerPluginOptions {
  title?: string;
  version?: string;
}

export const swaggerPlugin: FastifyPluginAsync<SwaggerPluginOptions> = async (app, options) => {
  const title = options?.title ?? 'MeasureTent API';
  const version = options?.version ?? '1.0.0';

  await app.register(swagger, {
    openapi: {
      info: {
        title,
        version,
        description: 'MeasureTent calculation API',
      },
      servers: [{ url: '/' }],
    },
  });

  await app.register(swaggerUi, {
    routePrefix: '/docs',
    uiConfig: {
      docExpansion: 'list',
      deepLinking: true,
    },
  });
};

export default swaggerPlugin;
