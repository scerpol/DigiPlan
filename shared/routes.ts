import { z } from "zod";
import { insertInquirySchema, inquiries } from "./schema";

export const errorSchemas = {
  validation: z.object({
    message: z.string(),
    field: z.string().optional(),
  }),
  internal: z.object({
    message: z.string(),
  }),
};

export const api = {
  inquiries: {
    create: {
      method: "POST" as const,
      path: "/api/inquiries",
      // ✅ Solo email obbligatoria. Nome, messaggio e package opzionali (con default).
      input: insertInquirySchema
        .partial({ name: true, message: true, package: true })
        .extend({
          name: z.string().optional().default(""),
          message: z.string().optional().default(""),
          package: z.string().optional().default("Base"),

          attachment: z.string().optional(), // Base64 or URL
          attachmentName: z.string().optional(),
          attachmentType: z.string().optional(),
        }),
      responses: {
        201: z.object({ success: z.boolean() }),
        400: errorSchemas.validation,
      },
    },
  },
};

export function buildUrl(
  path: string,
  params?: Record<string, string | number>
): string {
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
