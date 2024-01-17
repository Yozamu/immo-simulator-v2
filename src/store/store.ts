import { create } from 'zustand';

type StoreState = {
  inputValues: Record<string, number>;
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
}));

export default useMainStore;
