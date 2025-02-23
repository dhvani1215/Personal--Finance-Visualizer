
export type CategoryType = 
  | "Food & Dining"
  | "Shopping"
  | "Transportation"
  | "Bills & Utilities"
  | "Entertainment"
  | "Health"
  | "Travel"
  | "Education"
  | "Other";

export interface Transaction {
  id: string;
  amount: number;
  description: string;
  date: Date;
  category: CategoryType;
}

export interface Budget {
  category: CategoryType;
  limit: number;
}
