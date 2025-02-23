
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CategoryType } from "@/types/finance";

interface Transaction {
  amount: number;
  category: CategoryType;
}

interface Budget {
  category: CategoryType;
  limit: number;
}

interface BudgetChartProps {
  transactions: Transaction[];
  budgets: Budget[];
}

export function BudgetChart({ transactions, budgets }: BudgetChartProps) {
  const categorySpending = transactions.reduce((acc: { [key in CategoryType]?: number }, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  const chartData = budgets.map((budget) => ({
    category: budget.category,
    spent: categorySpending[budget.category] || 0,
    limit: budget.limit,
  }));

  return (
    <Card className="col-span-4 animate-fade-up">
      <CardHeader>
        <CardTitle>Budget vs. Actual Spending</CardTitle>
      </CardHeader>
      <CardContent className="pl-2">
        <ResponsiveContainer width="100%" height={350}>
          <BarChart data={chartData}>
            <XAxis
              dataKey="category"
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
            />
            <YAxis
              stroke="#888888"
              fontSize={12}
              tickLine={false}
              axisLine={false}
              tickFormatter={(value) => `$${value}`}
            />
            <Tooltip
              formatter={(value: number) => [`$${value}`, "Amount"]}
              cursor={{ fill: "transparent" }}
            />
            <Legend />
            <Bar dataKey="limit" name="Budget Limit" fill="#8884d8" />
            <Bar dataKey="spent" name="Actual Spending" fill="#82ca9d" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
