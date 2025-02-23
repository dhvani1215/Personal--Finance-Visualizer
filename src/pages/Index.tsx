
import { useState } from "react";
import { TransactionForm, type TransactionFormValues } from "@/components/TransactionForm";
import { TransactionList } from "@/components/TransactionList";
import { ExpensesChart } from "@/components/ExpensesChart";
import { CategoryPieChart } from "@/components/CategoryPieChart";
import { BudgetForm } from "@/components/BudgetForm";
import { BudgetChart } from "@/components/BudgetChart";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CategoryType } from "@/types/finance";

interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: CategoryType;
}

interface Budget {
  category: CategoryType;
  limit: number;
}

const Index = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budgets, setBudgets] = useState<Budget[]>([]);

  const handleAddTransaction = (values: TransactionFormValues) => {
    const newTransaction = {
      id: crypto.randomUUID(),
      amount: Number(values.amount),
      description: values.description,
      date: values.date,
      category: values.category,
    };
    setTransactions([...transactions, newTransaction]);
  };

  const handleDeleteTransaction = (id: string) => {
    setTransactions(transactions.filter((t) => t.id !== id));
  };

  const handleEditTransaction = (transaction: Transaction) => {
    console.log("Edit transaction:", transaction);
  };

  const handleSetBudget = (values: { category: CategoryType; limit: number }) => {
    const existingBudgetIndex = budgets.findIndex(
      (b) => b.category === values.category
    );

    if (existingBudgetIndex >= 0) {
      const newBudgets = [...budgets];
      newBudgets[existingBudgetIndex] = values;
      setBudgets(newBudgets);
    } else {
      setBudgets([...budgets, values]);
    }
  };

  const totalExpenses = transactions.reduce(
    (sum, transaction) => sum + transaction.amount,
    0
  );

  const categoryTotals = transactions.reduce((acc: { [key in CategoryType]?: number }, transaction) => {
    acc[transaction.category] = (acc[transaction.category] || 0) + transaction.amount;
    return acc;
  }, {});

  return (
    <div className="container py-10 space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold tracking-tight">Finance Tracker</h1>
        <p className="text-muted-foreground">
          Track your expenses and visualize your spending patterns.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2">
        <Card className="hover-card-animation">
          <CardHeader>
            <CardTitle>Add Transaction</CardTitle>
          </CardHeader>
          <CardContent>
            <TransactionForm onSubmit={handleAddTransaction} />
          </CardContent>
        </Card>

        <div className="space-y-8">
          <Card className="hover-card-animation">
            <CardHeader>
              <CardTitle>Overview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-3xl font-bold">${totalExpenses.toFixed(2)}</div>
              <p className="text-xs text-muted-foreground">Total Expenses</p>
            </CardContent>
          </Card>

          <Card className="hover-card-animation">
            <CardHeader>
              <CardTitle>Set Budget</CardTitle>
            </CardHeader>
            <CardContent>
              <BudgetForm onSubmit={handleSetBudget} />
            </CardContent>
          </Card>
        </div>
      </div>

      <Separator className="my-8" />

      <Tabs defaultValue="monthly" className="space-y-8">
        <TabsList>
          <TabsTrigger value="monthly">Monthly Overview</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
          <TabsTrigger value="budget">Budget</TabsTrigger>
        </TabsList>
        <TabsContent value="monthly">
          <ExpensesChart transactions={transactions} />
        </TabsContent>
        <TabsContent value="categories">
          <CategoryPieChart transactions={transactions} />
        </TabsContent>
        <TabsContent value="budget">
          <BudgetChart transactions={transactions} budgets={budgets} />
        </TabsContent>
      </Tabs>

      <div className="space-y-4">
        <h2 className="text-2xl font-semibold tracking-tight">
          Recent Transactions
        </h2>
        <TransactionList
          transactions={transactions}
          onDelete={handleDeleteTransaction}
          onEdit={handleEditTransaction}
        />
      </div>
    </div>
  );
};

export default Index;
