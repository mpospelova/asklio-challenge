import { z } from "zod";

const orderLineSchema = z.object({
  positionDescription: z.string(),
  unitPrice: z.string(),
  amount: z.string(),
  unit: z.string(),
  totalPrice: z.string(),
});

export const ExtractedInformationSchema = z.object({
  requestorName: z.string(),
  title: z.string(),
  vendorName: z.string(),
  vatID: z.string(),
  commodityGroup: z.string(),
  department: z.string(),
  totalCost: z.string(),
  orderLines: z.array(orderLineSchema),
});

export type ExtractedInformation = z.infer<typeof ExtractedInformationSchema>;
