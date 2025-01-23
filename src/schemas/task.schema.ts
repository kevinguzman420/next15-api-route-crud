import { z } from "zod";

export const taskSchema = z.object({
  title: z.string().min(1, "El título es obligatorio"),
  description: z.string().min(1, "La descripción es obligatoria"),
  priority: z.enum(["low", "medium", "high", "critical"]),
});
