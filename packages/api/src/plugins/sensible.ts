import type { FastifyPluginAsync } from 'fastify';
import sensible from '@fastify/sensible';

export const sensiblePlugin: FastifyPluginAsync = async (app) => {
  await app.register(sensible);
};

export default sensiblePlugin;
