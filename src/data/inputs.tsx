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

const rentalInvestmentInformation: InputValue[] = [
  { title: 'Loyer HC', subtitle: 'mensuel', name: 'rentHC', min: 300, max: 1500, step: 20 },
  { title: 'Charges de copro', subtitle: 'mensuel', name: 'coproCharges', min: 0, max: 300, step: 10 },
  { title: 'Charges récupérables', subtitle: 'mensuel', name: 'recoverableCharges', min: 0, max: 150, step: 5 },
  { title: 'Taxe foncière', subtitle: 'annuel, TOM incluse', name: 'propertyTax', min: 400, max: 1500, step: 20 },
  { title: 'TOM', subtitle: 'annuel', name: 'tom', min: 0, max: 300, step: 10 },
  { title: 'TMI (%)', name: 'tmi', min: 0, max: 45, step: 1 },
  { title: 'Crédits actuels', subtitle: 'mensuel', name: 'currentCredits', min: 0, max: 2000, step: 50 },
];

const inputs = { mainInformation, coInformation, otherInformation, rentalInvestmentInformation };

export default inputs;
