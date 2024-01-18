import type { SimulationData } from '@/types/commonTypes';
import { create } from 'zustand';

type StoreState = {
  inputValues: SimulationData;
  filters: Record<string, boolean>;
  setInputValue: (name: string, value: number) => void;
  setFilterValue: (name: string, value: boolean) => void;
};

const useMainStore = create<StoreState>((set) => ({
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
    hasCoBorrower: false,
    doable: true,
    monthlyPayment: true,
    totalCost: true,
    remainingLoan: true,
    rentEquivalentNoLoss: false,
    savingsWithSpendings: false,
    spendingsFromProjects: false,
  },
  setInputValue: (name, value) => set((state) => ({ inputValues: { ...state.inputValues, [name]: value } })),
  setFilterValue: (name, value) => set((state) => ({ filters: { ...state.filters, [name]: value } })),
}));

export default useMainStore;
