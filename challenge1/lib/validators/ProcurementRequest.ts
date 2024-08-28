import { z } from "zod";
import { ExtractedInformationSchema } from "./ExtractedInformation";

const ProcurementRequestSchema = z.object({
  extractedInformation: ExtractedInformationSchema,
  state: z.string(),
  id: z.string(),
  createdAt: z.date(),
  modifiedAt: z.date(),
});

export const ProcurementRequestSchemaArraySchema = z.array(
  ProcurementRequestSchema
);

export type ProcurementRequest = z.infer<typeof ProcurementRequestSchema>;
