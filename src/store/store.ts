import type { SimulationData } from '@/types/commonTypes';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

type Filters = Record<string, boolean>;

const DEFAULT_INPUT_VALUES: SimulationData = {
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
};

const DEFAULT_FILTERS: Filters = {
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
  sciIsInvestment: false,
  sciIsInvestmentDetails: false,
  isLMNP: false,
  hasGLI: false,
  hasPropertyManagement: false,
};

type StoreState = {
  inputValues: SimulationData;
  filters: Filters;
  setInputValue: (name: string, value: number) => void;
  setFilterValue: (name: string, value: boolean) => void;
  reset: () => void;
};

const useMainStore = create<StoreState>()(
  persist(
    (set) => ({
      inputValues: DEFAULT_INPUT_VALUES,
      filters: DEFAULT_FILTERS,
      setInputValue: (name, value) => set((state) => ({ inputValues: { ...state.inputValues, [name]: value } })),
      setFilterValue: (name, value) => set((state) => ({ filters: { ...state.filters, [name]: value } })),
      reset: () => set({ inputValues: { ...DEFAULT_INPUT_VALUES }, filters: { ...DEFAULT_FILTERS } }),
    }),
    {
      name: 'immo-simulator',
      version: 1,
      partialize: (state) => ({ inputValues: state.inputValues, filters: state.filters }),
      merge: (persisted, current) => {
        const stored = (persisted ?? {}) as Partial<Pick<StoreState, 'inputValues' | 'filters'>>;
        return {
          ...current,
          inputValues: { ...current.inputValues, ...(stored.inputValues ?? {}) },
          filters: { ...current.filters, ...(stored.filters ?? {}) },
        };
      },
    }
  )
);

export default useMainStore;
