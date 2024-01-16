import { create } from 'zustand';

type StoreState = {
  inputValues: Record<string, number>;
  setInputValue: (name: string, value: number) => void;
};

const useMainStore = create<StoreState>((set) => ({
  inputValues: {
    Foo: 5,
    Bar: 10,
    Test: 0,
  },
  setInputValue: (name, value) => set((state) => ({ inputValues: { ...state.inputValues, [name]: value } })),
}));

export default useMainStore;
