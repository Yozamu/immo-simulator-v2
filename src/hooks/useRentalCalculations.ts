import useMainStore from '@/store/store';
import { GLI_RATE, LMNP_DEPRECIATION_RATE, PROPERTY_MANAGEMENT_RATE } from '@/utils/constants';
import {
  calculateAnnualLMNPDepreciation,
  calculateAnnualNonRecoverableCopro,
  calculateAnnualPropertyTaxNetOfTom,
  calculateGrossYield,
  calculateLoanAmount,
  calculateLoanRepayment,
  calculateMonthlyCashflow,
  calculateMonthlyGLICost,
  calculateMonthlyInsuranceCost,
  calculateMonthlyLoanCost,
  calculateMonthlyPayment,
  calculateMonthlyPropertyManagementCost,
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
  const isLMNP = useMainStore((state) => state.filters.isLMNP);
  const hasGLI = useMainStore((state) => state.filters.hasGLI);
  const hasPropertyManagement = useMainStore((state) => state.filters.hasPropertyManagement);

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

  const lmnpAnnualDepreciation = isLMNP ? calculateAnnualLMNPDepreciation(price, LMNP_DEPRECIATION_RATE) : 0;
  const gliMonthly = hasGLI ? calculateMonthlyGLICost(rentHC, GLI_RATE) : 0;
  const managementMonthly = hasPropertyManagement
    ? calculateMonthlyPropertyManagementCost(rentHC, PROPERTY_MANAGEMENT_RATE)
    : 0;
  const gliAnnual = +(gliMonthly * 12).toFixed(2);
  const managementAnnual = +(managementMonthly * 12).toFixed(2);

  const operatingDeductiblesAnnual = gliAnnual + managementAnnual;
  const extraDeductiblesAnnual = lmnpAnnualDepreciation + operatingDeductiblesAnnual;

  const taxableIncomeRaw = calculateRentalTaxableIncome(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest,
    extraDeductiblesAnnual
  );
  const annualTax = calculateRentalIncomeTax(taxableIncomeRaw, tmi);

  const taxableIncomeWithoutLMNP = calculateRentalTaxableIncome(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest,
    operatingDeductiblesAnnual
  );
  const annualTaxWithoutLMNP = calculateRentalIncomeTax(taxableIncomeWithoutLMNP, tmi);
  const lmnpAnnualSavings = isLMNP ? +Math.max(0, annualTaxWithoutLMNP - annualTax).toFixed(2) : 0;
  const lmnpMonthlySavings = +(lmnpAnnualSavings / 12).toFixed(2);

  const grossYield = calculateGrossYield(rentHC, totalAcquisitionCost);
  const netYield = calculateNetYield(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    vacancyCost,
    totalAcquisitionCost,
    operatingDeductiblesAnnual
  );
  const extraMonthlyCharges = gliMonthly + managementMonthly;
  const monthlyCashflow = calculateMonthlyCashflow(
    rentHC,
    recoverableCharges,
    monthlyPayment,
    coproCharges,
    propertyTax,
    pnoAnnual,
    annualTax,
    extraMonthlyCharges
  );
  const monthlyCashflowBeforeTax = +(monthlyCashflow + annualTax / 12).toFixed(2);
  const indebtedness = calculateRentalIndebtedness(monthlyPayment, currentCredits, totalSalary, rentHC);

  return {
    tmi,
    monthlyPayment,
    indebtedness,
    grossYield,
    netYield,
    monthlyCashflow,
    monthlyCashflowBeforeTax,
    annualCashflow: +(monthlyCashflow * 12).toFixed(2),
    savingsEffort: monthlyCashflow < 0 ? +Math.abs(monthlyCashflow).toFixed(2) : 0,
    taxableIncome: Math.max(0, +taxableIncomeRaw.toFixed(2)),
    annualTax,
    pnoAnnual,
    vacancyCost,
    nonRecoverableCoproAnnual: +nonRecoverableCoproAnnual.toFixed(2),
    propertyTaxNetOfTom: +propertyTaxNetOfTom.toFixed(2),
    firstYearInterest,
    isLMNP,
    hasGLI,
    hasPropertyManagement,
    lmnpAnnualDepreciation: +lmnpAnnualDepreciation.toFixed(2),
    lmnpMonthlySavings,
    lmnpAnnualSavings,
    gliMonthly,
    gliAnnual,
    managementMonthly,
    managementAnnual,
  };
};

export default useRentalCalculations;
