import { z } from 'zod';
import type { AuthCredentials, LoginInput, RegisterInput, TokenPair } from '../types';

const emailSchema = z.string().trim().email();
const passwordSchema = z.string().min(8).max(128);
const tenantIdSchema = z.string().trim().min(1).max(128);

export const AuthCredentialsSchema: z.ZodType<AuthCredentials> = z.object({
  email: emailSchema,
  password: passwordSchema,
});

export const LoginSchema: z.ZodType<LoginInput> = AuthCredentialsSchema;

export const RegisterSchema: z.ZodType<RegisterInput> = z.object({
  email: emailSchema,
  password: passwordSchema,
  tenantId: tenantIdSchema.optional(),
  displayName: z.string().trim().min(1).max(120).optional(),
});

export const TokenPairSchema: z.ZodType<TokenPair> = z.object({
  accessToken: z.string().min(1),
  refreshToken: z.string().min(1),
});
