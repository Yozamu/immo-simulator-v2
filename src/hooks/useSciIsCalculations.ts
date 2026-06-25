import useMainStore from '@/store/store';
import {
  GLI_RATE,
  IS_REDUCED_RATE,
  IS_REDUCED_RATE_THRESHOLD,
  IS_STANDARD_RATE,
  PROPERTY_MANAGEMENT_RATE,
  SCI_ACCOUNTING_FEES_ANNUAL,
  SCI_BUILDING_DEPRECIATION_YEARS,
  SCI_LAND_RATIO,
  SCI_MIN_CONTRIBUTION_RATIO,
} from '@/utils/constants';
import {
  calculateAnnualNonRecoverableCopro,
  calculateAnnualPropertyTaxNetOfTom,
  calculateCorporateTax,
  calculateGrossYield,
  calculateLoanAmount,
  calculateLoanRepayment,
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
  calculateSciAnnualDepreciation,
  calculateSciMonthlyCashflowBeforeTax,
  calculateSciTaxableProfit,
  calculateTotalAcquisitionCost,
  calculateTotalSalary,
  calculateTotalcontribution,
  calculateVacancyCost,
} from '@/utils/simulationResults';

export type SciFeasibility = {
  score: number;
  label: 'Excellente' | 'Bonne' | 'Correcte' | 'Compliquée' | 'KO';
  color: 'green' | 'lime' | 'yellow' | 'orange' | 'red';
  criteria: {
    indebtedness: boolean;
    contribution: boolean;
    cashflow: boolean;
    netYield: boolean;
  };
};

const feasibilityFromScore = (score: number): Pick<SciFeasibility, 'label' | 'color'> => {
  if (score >= 4) return { label: 'Excellente', color: 'green' };
  if (score === 3) return { label: 'Bonne', color: 'lime' };
  if (score === 2) return { label: 'Correcte', color: 'yellow' };
  if (score === 1) return { label: 'Compliquée', color: 'orange' };
  return { label: 'KO', color: 'red' };
};

const useSciIsCalculations = () => {
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

  const gliMonthly = hasGLI ? calculateMonthlyGLICost(rentHC, GLI_RATE) : 0;
  const managementMonthly = hasPropertyManagement
    ? calculateMonthlyPropertyManagementCost(rentHC, PROPERTY_MANAGEMENT_RATE)
    : 0;
  const gliAnnual = +(gliMonthly * 12).toFixed(2);
  const managementAnnual = +(managementMonthly * 12).toFixed(2);
  const operatingDeductiblesAnnual = gliAnnual + managementAnnual;
  const extraMonthlyCharges = gliMonthly + managementMonthly;

  const depreciation = calculateSciAnnualDepreciation(
    price,
    notaryFees,
    loanDuration,
    SCI_LAND_RATIO,
    SCI_BUILDING_DEPRECIATION_YEARS
  );

  const taxableProfit = calculateSciTaxableProfit(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest,
    SCI_ACCOUNTING_FEES_ANNUAL,
    operatingDeductiblesAnnual,
    depreciation.total
  );

  const corporateTax = calculateCorporateTax(
    taxableProfit,
    IS_REDUCED_RATE,
    IS_STANDARD_RATE,
    IS_REDUCED_RATE_THRESHOLD
  );

  const monthlyCashflowBeforeTax = calculateSciMonthlyCashflowBeforeTax(
    rentHC,
    recoverableCharges,
    monthlyPayment,
    coproCharges,
    propertyTax,
    pnoAnnual,
    SCI_ACCOUNTING_FEES_ANNUAL,
    extraMonthlyCharges
  );
  const monthlyCashflow = +(monthlyCashflowBeforeTax - corporateTax / 12).toFixed(2);
  const annualCashflow = +(monthlyCashflow * 12).toFixed(2);

  const grossYield = calculateGrossYield(rentHC, totalAcquisitionCost);
  const netYield = calculateNetYield(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    vacancyCost,
    totalAcquisitionCost,
    operatingDeductiblesAnnual + SCI_ACCOUNTING_FEES_ANNUAL
  );

  const indebtedness = calculateRentalIndebtedness(monthlyPayment, currentCredits, totalSalary, rentHC);
  const contributionRatio = totalAcquisitionCost > 0 ? totalContribution / totalAcquisitionCost : 0;

  const criteria = {
    indebtedness: indebtedness <= 0.35,
    contribution: contributionRatio >= SCI_MIN_CONTRIBUTION_RATIO,
    cashflow: monthlyCashflow >= 0,
    netYield: netYield >= 5,
  };
  const score = Object.values(criteria).filter(Boolean).length;
  const feasibility: SciFeasibility = { score, ...feasibilityFromScore(score), criteria };

  // Comparison with régime réel (nom propre)
  const taxableIncomeRealRegime = calculateRentalTaxableIncome(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest,
    operatingDeductiblesAnnual
  );
  const annualTaxRealRegime = calculateRentalIncomeTax(taxableIncomeRealRegime, tmi);
  const taxSavingsVsRealRegime = +(annualTaxRealRegime - corporateTax).toFixed(2);

  return {
    monthlyPayment,
    indebtedness,
    contributionRatio: +(contributionRatio * 100).toFixed(2),
    grossYield,
    netYield,
    monthlyCashflow,
    monthlyCashflowBeforeTax,
    annualCashflow,
    taxableProfit: Math.max(0, taxableProfit),
    rawTaxableProfit: taxableProfit,
    corporateTax,
    monthlyCorporateTax: +(corporateTax / 12).toFixed(2),
    depreciation,
    accountingFeesAnnual: SCI_ACCOUNTING_FEES_ANNUAL,
    nonRecoverableCoproAnnual: +nonRecoverableCoproAnnual.toFixed(2),
    propertyTaxNetOfTom: +propertyTaxNetOfTom.toFixed(2),
    pnoAnnual,
    firstYearInterest,
    gliAnnual,
    managementAnnual,
    annualTaxRealRegime,
    taxSavingsVsRealRegime,
    feasibility,
    totalAcquisitionCost,
    totalContribution,
  };
};

export default useSciIsCalculations;
