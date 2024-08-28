"use client";

import React, { FC, useContext, useEffect } from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { nanoid } from "nanoid";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { ExtractedInformationSchema } from "@/lib/validators/ExtractedInformation";
import { ExtractedInformationContext } from "@/context/ExtractedInformationProvider";
import OrderLineCard from "./OrderLineCard";
import { ProcurementRequestsContext } from "@/context/RequestsProvider";
import { ProcurementRequest } from "@/lib/validators/ProcurementRequest";
import { useRouter } from "next/navigation";
import CommodiyGroupSelect from "./CommodiyGroupSelect";

interface SubmissionFormProps {
  action: string;
  id?: string;
}

const SubmissionForm: FC<SubmissionFormProps> = ({ action, id }) => {
  const { extractedInformation } = useContext(ExtractedInformationContext);
  const { addRequest, updateInformation } = useContext(
    ProcurementRequestsContext
  );
  const router = useRouter();

  const form = useForm<z.infer<typeof ExtractedInformationSchema>>({
    resolver: zodResolver(ExtractedInformationSchema),
    defaultValues: {
      requestorName: extractedInformation.requestorName,
      title: extractedInformation.title,
      vendorName: extractedInformation.vendorName,
      vatID: extractedInformation.vatID,
      commodityGroup: extractedInformation.commodityGroup,
      department: extractedInformation.department,
      totalCost: extractedInformation.totalCost,
    },
  });

  useEffect(() => {
    form.reset(extractedInformation);
  }, [extractedInformation]);

  function onSubmit(values: z.infer<typeof ExtractedInformationSchema>) {
    if (action === "submit") {
      const today = new Date();
      const procurementRequest: ProcurementRequest = {
        extractedInformation: values,
        state: "Open",
        id: nanoid(),
        createdAt: today.toLocaleString(),
        modifiedAt: today.toLocaleString(),
      };

      addRequest(procurementRequest);
    } else if (action === "edit") {
      updateInformation(values, id!);
    }

    router.back();
  }

  return (
    <div>
      <h1 className="pb-4 text-yellow-500 font-medium">General Information</h1>
      <Separator />
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            control={form.control}
            name="requestorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Requestor Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="title"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Title</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vendorName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vendor Name</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="vatID"
            render={({ field }) => (
              <FormItem>
                <FormLabel>VAT ID</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <CommodiyGroupSelect form={form} />
          <FormField
            control={form.control}
            name="department"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Department</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <h1 className="pb-4 text-yellow-500 font-medium">Order Line</h1>
          <Separator />
          {extractedInformation.orderLines.map((_, index) => (
            <OrderLineCard key={index} form={form} index={index} />
          ))}
          <h1 className="pb-4 text-yellow-500 font-medium">Total Cost</h1>
          <Separator />
          <FormField
            control={form.control}
            name="totalCost"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total Cost</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <Button type="submit" className="bg-amber-500">
            Submit
          </Button>
        </form>
      </Form>
    </div>
  );
};

export default SubmissionForm;
