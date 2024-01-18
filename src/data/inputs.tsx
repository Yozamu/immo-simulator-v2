import type { InputValue } from '@/types/commonTypes';

const mainInformation: InputValue[] = [
  { title: 'Prix du bien', name: 'price', min: 100_000, max: 600_000, step: 10_000 },
  { title: 'Durée du prêt (ans)', name: 'loanDuration', min: 5, max: 25, step: 1 },
  { title: 'Taux du prêt (%)', name: 'loanRate', min: 1, max: 5, step: 0.1 },
  { title: "Taux d'assurance (%)", name: 'insuranceRate', min: 0.1, max: 0.5, step: 0.05 },
  { title: 'Salaire', name: 'salary', min: 1_000, max: 6_000, step: 100 },
  { title: 'Apport', name: 'contribution', min: 0, max: 200_000, step: 2000 },
];

const coInformation: InputValue[] = [
  { title: 'Salaire', name: 'coSalary', min: 1_000, max: 6_000, step: 100 },
  { title: 'Apport', name: 'coContribution', min: 0, max: 200_000, step: 2000 },
  { title: '% du crédit du co-emprunteur', name: 'coLoanPercent', min: 0, max: 100, step: 5 },
];

const otherInformation: InputValue[] = [
  { title: 'Budget travaux', name: 'worksBudget', min: 0, max: 150_000, step: 1000 },
];

const inputs = { mainInformation, coInformation, otherInformation };

export default inputs;
