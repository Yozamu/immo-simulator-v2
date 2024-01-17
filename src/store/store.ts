import { create } from 'zustand';

type StoreState = {
  hasCoBorrower: boolean;
  inputValues: Record<string, number>;
  filters: Record<string, boolean>;
  setInputValue: (name: string, value: number) => void;
  setFilterValue: (name: string, value: boolean) => void;
  toggleCoBorrower: () => void;
};

const useMainStore = create<StoreState>((set) => ({
  hasCoBorrower: false,
  inputValues: {
    price: 180000,
    loanDuration: 20,
    loanRate: 4,
    insuranceRate: 0.15,
    salary: 2200,
    contribution: 15000,
    coSalary: 1700,
    coContribution: 5000,
    coLoanPercent: 50,
    worksBudget: 0,
  },
  filters: {
    doable: true,
    totalCost: true,
    remainingLoan: true,
    rentEquivalentNoLoss: false,
    savingsWithSpendings: false,
    spendingsFromProjects: false,
  },
  setInputValue: (name, value) => set((state) => ({ inputValues: { ...state.inputValues, [name]: value } })),
  setFilterValue: (name, value) => set((state) => ({ filters: { ...state.filters, [name]: value } })),
  toggleCoBorrower: () => set((state) => ({ hasCoBorrower: !state.hasCoBorrower })),
}));

export default useMainStore;
