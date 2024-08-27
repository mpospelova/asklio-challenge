import { z } from "zod";

const orderLineSchema = z.object({
  positionDescription: z.string().min(1),
  unitPrice: z.string(),
  amount: z.string(),
  unit: z.string().min(1),
  totalPrice: z.string(),
});

export const ExtractedInformationSchema = z.object({
  requestorName: z.string().min(1).max(50),
  title: z.string().min(1).max(200),
  vendorName: z.string().min(1).max(50),
  vatID: z.string().min(1).max(50),
  commodityGroup: z.string().min(1).max(50),
  department: z.string().min(1).max(50),
  totalCost: z.string().min(1).max(50),
  orderLines: z.array(orderLineSchema),
});

export type ExtractedInformation = z.infer<typeof ExtractedInformationSchema>;
