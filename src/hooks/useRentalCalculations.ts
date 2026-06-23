import useMainStore from '@/store/store';
import {
  calculateAnnualNonRecoverableCopro,
  calculateAnnualPropertyTaxNetOfTom,
  calculateGrossYield,
  calculateLoanAmount,
  calculateLoanRepayment,
  calculateMonthlyCashflow,
  calculateMonthlyInsuranceCost,
  calculateMonthlyLoanCost,
  calculateMonthlyPayment,
  calculateNetYield,
  calculateNotaryFees,
  calculatePnoCost,
  calculateRentalIncomeTax,
  calculateRentalIndebtedness,
  calculateRentalTaxableIncome,
  calculateTotalAcquisitionCost,
  calculateTotalSalary,
  calculateTotalcontribution,
  calculateVacancyCost,
} from '@/utils/simulationResults';

const useRentalCalculations = () => {
  const price = useMainStore((state) => state.inputValues.price);
  const worksBudget = useMainStore((state) => state.inputValues.worksBudget);
  const loanDuration = useMainStore((state) => state.inputValues.loanDuration);
  const salary = useMainStore((state) => state.inputValues.salary);
  const coSalary = useMainStore((state) => state.inputValues.coSalary);
  const contribution = useMainStore((state) => state.inputValues.contribution);
  const coContribution = useMainStore((state) => state.inputValues.coContribution);
  const hasCoBorrower = useMainStore((state) => state.filters.hasCoBorrower);
  const loanRate = useMainStore((state) => state.inputValues.loanRate);
  const insuranceRate = useMainStore((state) => state.inputValues.insuranceRate);
  const rentHC = useMainStore((state) => state.inputValues.rentHC);
  const coproCharges = useMainStore((state) => state.inputValues.coproCharges);
  const recoverableCharges = useMainStore((state) => state.inputValues.recoverableCharges);
  const propertyTax = useMainStore((state) => state.inputValues.propertyTax);
  const tom = useMainStore((state) => state.inputValues.tom);
  const tmi = useMainStore((state) => state.inputValues.tmi);
  const currentCredits = useMainStore((state) => state.inputValues.currentCredits);

  const notaryFees = calculateNotaryFees(price);
  const totalSalary = calculateTotalSalary(salary, hasCoBorrower ? coSalary : 0);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees, worksBudget);
  const monthlyLoanCost = calculateMonthlyLoanCost(loanAmount, loanRate, loanDuration);
  const monthlyInsuranceCost = calculateMonthlyInsuranceCost(loanAmount, insuranceRate);
  const monthlyPayment = calculateMonthlyPayment(monthlyLoanCost, monthlyInsuranceCost);

  const totalAcquisitionCost = calculateTotalAcquisitionCost(price, notaryFees, worksBudget);
  const nonRecoverableCoproAnnual = calculateAnnualNonRecoverableCopro(coproCharges, recoverableCharges, tom);
  const propertyTaxNetOfTom = calculateAnnualPropertyTaxNetOfTom(propertyTax, tom);
  const pnoAnnual = calculatePnoCost(price);
  const vacancyCost = calculateVacancyCost(rentHC);

  const { interests } = calculateLoanRepayment(loanAmount, loanRate, loanDuration);
  const firstYearInterest = +interests.slice(0, 12).reduce((acc, curr) => acc + curr, 0).toFixed(2);

  const taxableIncomeRaw = calculateRentalTaxableIncome(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest
  );
  const annualTax = calculateRentalIncomeTax(taxableIncomeRaw, tmi);
  const grossYield = calculateGrossYield(rentHC, totalAcquisitionCost);
  const netYield = calculateNetYield(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    vacancyCost,
    totalAcquisitionCost
  );
  const monthlyCashflow = calculateMonthlyCashflow(
    rentHC,
    recoverableCharges,
    monthlyPayment,
    coproCharges,
    propertyTax,
    pnoAnnual,
    annualTax
  );
  const indebtedness = calculateRentalIndebtedness(monthlyPayment, currentCredits, totalSalary, rentHC);

  return {
    tmi,
    monthlyPayment,
    indebtedness,
    grossYield,
    netYield,
    monthlyCashflow,
    annualCashflow: +(monthlyCashflow * 12).toFixed(2),
    savingsEffort: monthlyCashflow < 0 ? +Math.abs(monthlyCashflow).toFixed(2) : 0,
    taxableIncome: Math.max(0, +taxableIncomeRaw.toFixed(2)),
    annualTax,
    pnoAnnual,
    vacancyCost,
    nonRecoverableCoproAnnual: +nonRecoverableCoproAnnual.toFixed(2),
    propertyTaxNetOfTom: +propertyTaxNetOfTom.toFixed(2),
    firstYearInterest,
  };
};

export default useRentalCalculations;
