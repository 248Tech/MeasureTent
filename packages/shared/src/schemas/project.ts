import { z } from 'zod';
import type { ProjectInput, ProjectRecord } from '../types';

const projectNameSchema = z.string().trim().min(1).max(120);
const projectDescriptionSchema = z.string().trim().max(500);

export const ProjectInputSchema: z.ZodType<ProjectInput> = z.object({
  name: projectNameSchema,
  description: projectDescriptionSchema.nullable().optional(),
});

export const ProjectRecordSchema: z.ZodType<ProjectRecord> = z.object({
  id: z.string().min(1),
  name: projectNameSchema,
  description: projectDescriptionSchema.nullable(),
  userId: z.string().min(1),
  tenantId: z.string().min(1),
  createdAt: z.coerce.date(),
  updatedAt: z.coerce.date(),
  deletedAt: z.coerce.date().nullable(),
});

export const ProjectCreateSchema = ProjectInputSchema;

export const ProjectUpdateSchema: z.ZodType<Pick<ProjectInput, 'name'>> = z.object({
  name: projectNameSchema,
});
