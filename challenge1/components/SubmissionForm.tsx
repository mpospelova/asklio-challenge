"use client";

import React from "react";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useMutation } from "@tanstack/react-query";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";

const generalInformationSchema = z.object({
  requestorName: z.string().min(1).max(50),
  // title: z.string().min(1).max(200),
  // vendorName: z.string().min(1).max(50),
  // vatID: z.string().min(1).max(50),
  // commodityGroup: z.string().min(1).max(50),
  // department: z.string().min(1).max(50),
});

function SubmissionForm() {
  const form = useForm<z.infer<typeof generalInformationSchema>>({
    resolver: zodResolver(generalInformationSchema),
    defaultValues: {
      requestorName: "",
      // title: "",
      // vendorName: "",
      // vatID: "",
      // commodityGroup: "",
      // department: "",
    },
  });

  function onSubmit(values: z.infer<typeof generalInformationSchema>) {
    console.log(values);
    submitForm(values);
  }

  const { mutate: submitForm, isPending } = useMutation({
    mutationFn: async (message: any) => {
      const response = await fetch("/api/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(message),
      });

      if (!response.ok) {
        throw new Error();
      }

      return response.body;
    },
  });

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
          {/* <FormField
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
          <FormField
            control={form.control}
            name="commodityGroup"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Commodity Group</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
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
          /> */}
          <Button type="submit">Submit</Button>
        </form>
      </Form>
    </div>
  );
}

export default SubmissionForm;
