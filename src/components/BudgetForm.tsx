
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import * as z from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { CategoryType } from "@/types/finance";

const categories: CategoryType[] = [
  "Food & Dining",
  "Shopping",
  "Transportation",
  "Bills & Utilities",
  "Entertainment",
  "Health",
  "Travel",
  "Education",
  "Other",
];

const formSchema = z.object({
  category: z.enum([
    "Food & Dining",
    "Shopping",
    "Transportation",
    "Bills & Utilities",
    "Entertainment",
    "Health",
    "Travel",
    "Education",
    "Other",
  ]),
  limit: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: "Budget limit must be a positive number",
  }),
});

type BudgetFormValues = z.infer<typeof formSchema>;

interface BudgetFormProps {
  onSubmit: (values: { category: CategoryType; limit: number }) => void;
}

export function BudgetForm({ onSubmit }: BudgetFormProps) {
  const { toast } = useToast();
  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      category: "Other",
      limit: "",
    },
  });

  const handleSubmit = (values: BudgetFormValues) => {
    onSubmit({
      category: values.category,
      limit: Number(values.limit),
    });
    form.reset();
    toast({
      title: "Budget set",
      description: "Your budget limit has been successfully set.",
    });
  };

  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className="space-y-8 animate-fade-up"
      >
        <FormField
          control={form.control}
          name="category"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Category</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a category" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {categories.map((category) => (
                    <SelectItem key={category} value={category}>
                      {category}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormDescription>
                Choose a category to set a budget for.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="limit"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Monthly Budget Limit</FormLabel>
              <FormControl>
                <Input placeholder="1000.00" {...field} />
              </FormControl>
              <FormDescription>
                Set your monthly spending limit for this category.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit">Set Budget</Button>
      </form>
    </Form>
  );
}
