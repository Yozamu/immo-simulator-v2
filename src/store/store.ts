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
    price: 120000,
    loanDuration: 20,
    loanRate: 3.5,
    insuranceRate: 0.15,
    salary: 2400,
    contribution: 25000,
    coSalary: 1800,
    coContribution: 15000,
    coLoanPercent: 50,
    worksBudget: 0,
    rentHC: 800,
    coproCharges: 100,
    recoverableCharges: 50,
    propertyTax: 1200,
    tom: 100,
    tmi: 30,
    currentCredits: 0,
  },
  filters: {
    hasCoBorrower: false,
    doable: true,
    monthlyPayment: true,
    totalCost: true,
    remainingLoan: true,
    rentEquivalentNoLoss: true,
    savingsWithSpendings: true,
    spendingsFromProjects: false,
    quotitiesAndLeftToLive: false,
    soulte: false,
    rentalInvestment: false,
    rentalInvestmentDetails: false,
  },
  setInputValue: (name, value) => set((state) => ({ inputValues: { ...state.inputValues, [name]: value } })),
  setFilterValue: (name, value) => set((state) => ({ filters: { ...state.filters, [name]: value } })),
}));

export default useMainStore;
