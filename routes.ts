import { z } from 'zod';
import { insertVaultSchema, vaults } from './schema';

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  notFound: z.object({
    message: z.string(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  vaults: {
    getByAddress: {
      method: 'GET' as const,
      path: '/api/vaults/:address' as const,
      responses: {
        200: z.array(z.custom<typeof vaults.$inferSelect>()),
      },
    },
    create: {
      method: 'POST' as const,
      path: '/api/vaults' as const,
      input: insertVaultSchema,
      responses: {
        201: z.custom<typeof vaults.$inferSelect>(),
        400: errorSchemas.validation,
      },
    },
    update: {
      method: 'PATCH' as const,
      path: '/api/vaults/:id' as const,
      input: z.object({
        currentAmount: z.number().optional(),
        isLocked: z.boolean().optional(),
      }),
      responses: {
        200: z.custom<typeof vaults.$inferSelect>(),
        404: errorSchemas.notFound,
      },
    },
  },
};

export function buildUrl(path: string, params?: Record<string, string | number>): string {
  let url = path;
  if (params) {
    Object.entries(params).forEach(([key, value]) => {
      if (url.includes(`:${key}`)) {
        url = url.replace(`:${key}`, String(value));
      }
    });
  }
  return url;
}
