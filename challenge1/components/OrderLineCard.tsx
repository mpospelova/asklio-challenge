import React from "react";
import { UseFormReturn, FieldValues, Controller } from "react-hook-form";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";
import { Input } from "./ui/input";
import { Separator } from "@radix-ui/react-separator";

interface OrderLineCardProps {
  form: any;
  index: number;
}

const OrderLineCard: React.FC<OrderLineCardProps> = ({ form, index }) => {
  return (
    <div>
      <FormField
        control={form.control}
        name={`orderLines.${index}.positionDescription`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Position Description</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`orderLines.${index}.unit`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Unit</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`orderLines.${index}.unitPrice`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Unit Price</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`orderLines.${index}.amount`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Amout</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
      <FormField
        control={form.control}
        name={`orderLines.${index}.totalPrice`}
        render={({ field }) => (
          <FormItem className="mb-4">
            <FormLabel>Total Price</FormLabel>
            <FormControl>
              <Input {...field} />
            </FormControl>
          </FormItem>
        )}
      />
    </div>
  );
};

export default OrderLineCard;
