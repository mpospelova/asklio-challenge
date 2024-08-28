import { z } from "zod";
import { ExtractedInformationSchema } from "./ExtractedInformation";

const ProcurementRequestSchema = z.object({
  extractedInformation: ExtractedInformationSchema,
  state: z.string(),
  id: z.string(),
  createdAt: z.string().datetime(),
  modifiedAt: z.string().datetime(),
});

export const ProcurementRequestSchemaArraySchema = z.array(
  ProcurementRequestSchema
);

export type ProcurementRequest = z.infer<typeof ProcurementRequestSchema>;
