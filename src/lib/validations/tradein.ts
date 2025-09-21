import { z } from "zod";

export const tradeInSchema = z.object({
  brand: z.string().min(1, "Marca es requerida"),
  model: z.string().min(1, "Modelo es requerido"),
  year: z.number().min(2000).max(new Date().getFullYear()).optional(),
  ram: z.string().optional(),
  storage: z.string().optional(),
  condition_notes: z.string().optional(),
  defects: z.array(z.string()).default([]),
  contact_email: z.string().email("Email inválido"),
  contact_phone: z.string().optional(),
});

export type TradeInFormData = z.infer<typeof tradeInSchema>;