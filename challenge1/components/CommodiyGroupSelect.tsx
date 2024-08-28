import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { commodityGroupsDictionray } from "@/data/commodityGroups";
import { FormControl, FormField, FormItem, FormLabel } from "./ui/form";

interface CommodiyGroupSelectProps {
  form: any;
}

const CommodiyGroupSelect: React.FC<CommodiyGroupSelectProps> = ({ form }) => {
  return (
    <FormField
      control={form.control}
      name="commodityGroup"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Commodity Group</FormLabel>
          <FormControl>
            <Select>
              <SelectTrigger>
                <SelectValue placeholder={field.value} />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(commodityGroupsDictionray).map(
                  ([category, commodityGroups]) => (
                    <SelectGroup key={category}>
                      <SelectLabel>{category}</SelectLabel>
                      {commodityGroups.map((commodityGroup) => (
                        <SelectItem key={commodityGroup} value={commodityGroup}>
                          {commodityGroup}
                        </SelectItem>
                      ))}
                    </SelectGroup>
                  )
                )}
              </SelectContent>
            </Select>
          </FormControl>
        </FormItem>
      )}
    />
  );
};

export default CommodiyGroupSelect;
