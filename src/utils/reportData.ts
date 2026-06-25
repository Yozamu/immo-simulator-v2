import type { SimulationData } from '@/types/commonTypes';
import {
  GLI_RATE,
  IS_REDUCED_RATE,
  IS_REDUCED_RATE_THRESHOLD,
  IS_STANDARD_RATE,
  LMNP_DEPRECIATION_RATE,
  PROPERTY_MANAGEMENT_RATE,
  SCI_ACCOUNTING_FEES_ANNUAL,
  SCI_BUILDING_DEPRECIATION_YEARS,
  SCI_LAND_RATIO,
  SCI_MIN_CONTRIBUTION_RATIO,
} from '@/utils/constants';
import {
  calculateAnnualLMNPDepreciation,
  calculateAnnualNonRecoverableCopro,
  calculateAnnualPropertyTaxNetOfTom,
  calculateCorporateTax,
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
  calculateSciAnnualDepreciation,
  calculateSciMonthlyCashflowBeforeTax,
  calculateSciTaxableProfit,
  calculateTotalAcquisitionCost,
  calculateTotalInsuranceCost,
  calculateTotalInterestCost,
  calculateTotalLoanCost,
  calculateTotalSalary,
  calculateTotalcontribution,
  calculateVacancyCost,
} from '@/utils/simulationResults';

export type RentalReportFilters = {
  hasCoBorrower: boolean;
  isLMNP: boolean;
  hasGLI: boolean;
  hasPropertyManagement: boolean;
};

export type ReportRegime = 'nom-propre' | 'sci-is';

export type ReportMeta = {
  projectName?: string;
  address?: string;
  borrowerName?: string;
  coBorrowerName?: string;
  notes?: string;
  date: string;
};

export type SciFeasibilityLabel = 'Excellente' | 'Bonne' | 'Correcte' | 'Compliquée' | 'KO';
export type SciFeasibilityColor = 'green' | 'lime' | 'yellow' | 'orange' | 'red';

export type YearlyAmortization = {
  year: number;
  interest: number;
  capital: number;
  leftToPay: number;
};

export type ReportData = {
  inputs: SimulationData & RentalReportFilters;
  shared: {
    notaryFees: number;
    totalSalary: number;
    totalContribution: number;
    loanAmount: number;
    monthlyLoanCost: number;
    monthlyInsuranceCost: number;
    monthlyPayment: number;
    totalInterestCost: number;
    totalInsuranceCost: number;
    totalLoanCost: number;
    totalAcquisitionCost: number;
    nonRecoverableCoproAnnual: number;
    propertyTaxNetOfTom: number;
    pnoAnnual: number;
    vacancyCost: number;
    firstYearInterest: number;
    gliMonthly: number;
    gliAnnual: number;
    managementMonthly: number;
    managementAnnual: number;
    operatingDeductiblesAnnual: number;
    yearlyAmortization: YearlyAmortization[];
  };
  nomPropre: {
    lmnpAnnualDepreciation: number;
    lmnpMonthlySavings: number;
    lmnpAnnualSavings: number;
    extraDeductiblesAnnual: number;
    rawTaxableIncome: number;
    taxableIncome: number;
    annualTax: number;
    grossYield: number;
    netYield: number;
    monthlyCashflow: number;
    monthlyCashflowBeforeTax: number;
    annualCashflow: number;
    savingsEffort: number;
    indebtedness: number;
    doable: boolean;
  };
  sciIs: {
    accountingFeesAnnual: number;
    depreciation: { building: number; notary: number; total: number };
    rawTaxableProfit: number;
    taxableProfit: number;
    corporateTax: number;
    monthlyCorporateTax: number;
    grossYield: number;
    netYield: number;
    monthlyCashflowBeforeTax: number;
    monthlyCashflow: number;
    annualCashflow: number;
    indebtedness: number;
    contributionRatio: number;
    feasibility: {
      score: number;
      label: SciFeasibilityLabel;
      color: SciFeasibilityColor;
      criteria: {
        indebtedness: boolean;
        contribution: boolean;
        cashflow: boolean;
        netYield: boolean;
      };
    };
    annualTaxRealRegime: number;
    taxSavingsVsRealRegime: number;
  };
};

const feasibilityFromScore = (score: number): { label: SciFeasibilityLabel; color: SciFeasibilityColor } => {
  if (score >= 4) return { label: 'Excellente', color: 'green' };
  if (score === 3) return { label: 'Bonne', color: 'lime' };
  if (score === 2) return { label: 'Correcte', color: 'yellow' };
  if (score === 1) return { label: 'Compliquée', color: 'orange' };
  return { label: 'KO', color: 'red' };
};

const aggregateYearly = (
  interests: number[],
  capital: number[],
  leftToPay: number[],
  years: number
): YearlyAmortization[] => {
  const out: YearlyAmortization[] = [];
  for (let y = 0; y < years; y++) {
    const start = y * 12;
    const end = start + 12;
    const yearInterest = interests.slice(start, end).reduce((a, b) => a + b, 0);
    const yearCapital = capital.slice(start, end).reduce((a, b) => a + b, 0);
    const yearEndLeftToPay = leftToPay[end - 1] ?? 0;
    out.push({
      year: y + 1,
      interest: +yearInterest.toFixed(2),
      capital: +yearCapital.toFixed(2),
      leftToPay: +Math.max(0, yearEndLeftToPay).toFixed(2),
    });
  }
  return out;
};

export const buildReportData = (inputValues: SimulationData, filters: RentalReportFilters): ReportData => {
  const {
    price,
    contribution,
    coContribution,
    loanRate,
    insuranceRate,
    loanDuration,
    salary,
    coSalary,
    worksBudget,
    rentHC,
    coproCharges,
    recoverableCharges,
    propertyTax,
    tom,
    tmi,
    currentCredits,
  } = inputValues;
  const { hasCoBorrower, isLMNP, hasGLI, hasPropertyManagement } = filters;

  const notaryFees = calculateNotaryFees(price);
  const totalSalary = calculateTotalSalary(salary, hasCoBorrower ? coSalary : 0);
  const totalContribution = calculateTotalcontribution(contribution, hasCoBorrower ? coContribution : 0);
  const loanAmount = calculateLoanAmount(price, totalContribution, notaryFees, worksBudget);
  const monthlyLoanCost = calculateMonthlyLoanCost(loanAmount, loanRate, loanDuration);
  const monthlyInsuranceCost = calculateMonthlyInsuranceCost(loanAmount, insuranceRate);
  const monthlyPayment = calculateMonthlyPayment(monthlyLoanCost, monthlyInsuranceCost);
  const totalInterestCost = calculateTotalInterestCost(loanAmount, loanRate, loanDuration);
  const totalInsuranceCost = calculateTotalInsuranceCost(monthlyInsuranceCost, loanDuration);
  const totalLoanCost = calculateTotalLoanCost(totalInterestCost, totalInsuranceCost);

  const totalAcquisitionCost = calculateTotalAcquisitionCost(price, notaryFees, worksBudget);
  const nonRecoverableCoproAnnual = +calculateAnnualNonRecoverableCopro(coproCharges, recoverableCharges, tom).toFixed(2);
  const propertyTaxNetOfTom = +calculateAnnualPropertyTaxNetOfTom(propertyTax, tom).toFixed(2);
  const pnoAnnual = calculatePnoCost(price);
  const vacancyCost = calculateVacancyCost(rentHC);

  const { interests, capital, leftToPay } = calculateLoanRepayment(loanAmount, loanRate, loanDuration);
  const firstYearInterest = +interests.slice(0, 12).reduce((acc, curr) => acc + curr, 0).toFixed(2);
  const yearlyAmortization = aggregateYearly(interests, capital, leftToPay, loanDuration);

  const gliMonthly = hasGLI ? calculateMonthlyGLICost(rentHC, GLI_RATE) : 0;
  const managementMonthly = hasPropertyManagement
    ? calculateMonthlyPropertyManagementCost(rentHC, PROPERTY_MANAGEMENT_RATE)
    : 0;
  const gliAnnual = +(gliMonthly * 12).toFixed(2);
  const managementAnnual = +(managementMonthly * 12).toFixed(2);
  const operatingDeductiblesAnnual = +(gliAnnual + managementAnnual).toFixed(2);
  const extraMonthlyCharges = gliMonthly + managementMonthly;

  // === Nom propre (régime réel) ===
  const lmnpAnnualDepreciation = isLMNP ? +calculateAnnualLMNPDepreciation(price, LMNP_DEPRECIATION_RATE).toFixed(2) : 0;
  const extraDeductiblesAnnual = +(lmnpAnnualDepreciation + operatingDeductiblesAnnual).toFixed(2);

  const rawTaxableIncome = +calculateRentalTaxableIncome(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest,
    extraDeductiblesAnnual
  ).toFixed(2);
  const annualTax = calculateRentalIncomeTax(rawTaxableIncome, tmi);

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

  const rentalGrossYield = calculateGrossYield(rentHC, totalAcquisitionCost);
  const rentalNetYield = calculateNetYield(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    vacancyCost,
    totalAcquisitionCost,
    operatingDeductiblesAnnual
  );

  const rentalMonthlyCashflow = calculateMonthlyCashflow(
    rentHC,
    recoverableCharges,
    monthlyPayment,
    coproCharges,
    propertyTax,
    pnoAnnual,
    annualTax,
    extraMonthlyCharges
  );
  const rentalMonthlyCashflowBeforeTax = +(rentalMonthlyCashflow + annualTax / 12).toFixed(2);
  const rentalAnnualCashflow = +(rentalMonthlyCashflow * 12).toFixed(2);
  const rentalIndebtedness = calculateRentalIndebtedness(monthlyPayment, currentCredits, totalSalary, rentHC);
  const rentalDoable = rentalIndebtedness <= 0.35;

  // === SCI à l'IS ===
  const sciDepreciation = calculateSciAnnualDepreciation(
    price,
    notaryFees,
    loanDuration,
    SCI_LAND_RATIO,
    SCI_BUILDING_DEPRECIATION_YEARS
  );
  const sciRawTaxableProfit = calculateSciTaxableProfit(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    firstYearInterest,
    SCI_ACCOUNTING_FEES_ANNUAL,
    operatingDeductiblesAnnual,
    sciDepreciation.total
  );
  const sciCorporateTax = calculateCorporateTax(
    sciRawTaxableProfit,
    IS_REDUCED_RATE,
    IS_STANDARD_RATE,
    IS_REDUCED_RATE_THRESHOLD
  );
  const sciMonthlyCashflowBeforeTax = calculateSciMonthlyCashflowBeforeTax(
    rentHC,
    recoverableCharges,
    monthlyPayment,
    coproCharges,
    propertyTax,
    pnoAnnual,
    SCI_ACCOUNTING_FEES_ANNUAL,
    extraMonthlyCharges
  );
  const sciMonthlyCashflow = +(sciMonthlyCashflowBeforeTax - sciCorporateTax / 12).toFixed(2);
  const sciAnnualCashflow = +(sciMonthlyCashflow * 12).toFixed(2);
  const sciGrossYield = calculateGrossYield(rentHC, totalAcquisitionCost);
  const sciNetYield = calculateNetYield(
    rentHC,
    nonRecoverableCoproAnnual,
    propertyTaxNetOfTom,
    pnoAnnual,
    vacancyCost,
    totalAcquisitionCost,
    operatingDeductiblesAnnual + SCI_ACCOUNTING_FEES_ANNUAL
  );
  const sciIndebtedness = calculateRentalIndebtedness(monthlyPayment, currentCredits, totalSalary, rentHC);
  const sciContributionRatio = totalAcquisitionCost > 0 ? totalContribution / totalAcquisitionCost : 0;
  const sciCriteria = {
    indebtedness: sciIndebtedness <= 0.35,
    contribution: sciContributionRatio >= SCI_MIN_CONTRIBUTION_RATIO,
    cashflow: sciMonthlyCashflow >= 0,
    netYield: sciNetYield >= 5,
  };
  const sciScore = Object.values(sciCriteria).filter(Boolean).length;
  const sciFeasibility = { score: sciScore, ...feasibilityFromScore(sciScore), criteria: sciCriteria };

  return {
    inputs: { ...inputValues, hasCoBorrower, isLMNP, hasGLI, hasPropertyManagement },
    shared: {
      notaryFees: +notaryFees.toFixed(2),
      totalSalary,
      totalContribution,
      loanAmount: +loanAmount.toFixed(2),
      monthlyLoanCost,
      monthlyInsuranceCost,
      monthlyPayment,
      totalInterestCost,
      totalInsuranceCost,
      totalLoanCost: +totalLoanCost.toFixed(2),
      totalAcquisitionCost: +totalAcquisitionCost.toFixed(2),
      nonRecoverableCoproAnnual,
      propertyTaxNetOfTom,
      pnoAnnual,
      vacancyCost,
      firstYearInterest,
      gliMonthly,
      gliAnnual,
      managementMonthly,
      managementAnnual,
      operatingDeductiblesAnnual,
      yearlyAmortization,
    },
    nomPropre: {
      lmnpAnnualDepreciation,
      lmnpMonthlySavings,
      lmnpAnnualSavings,
      extraDeductiblesAnnual,
      rawTaxableIncome,
      taxableIncome: Math.max(0, rawTaxableIncome),
      annualTax,
      grossYield: rentalGrossYield,
      netYield: rentalNetYield,
      monthlyCashflow: rentalMonthlyCashflow,
      monthlyCashflowBeforeTax: rentalMonthlyCashflowBeforeTax,
      annualCashflow: rentalAnnualCashflow,
      savingsEffort: rentalMonthlyCashflow < 0 ? +Math.abs(rentalMonthlyCashflow).toFixed(2) : 0,
      indebtedness: rentalIndebtedness,
      doable: rentalDoable,
    },
    sciIs: {
      accountingFeesAnnual: SCI_ACCOUNTING_FEES_ANNUAL,
      depreciation: sciDepreciation,
      rawTaxableProfit: sciRawTaxableProfit,
      taxableProfit: Math.max(0, sciRawTaxableProfit),
      corporateTax: sciCorporateTax,
      monthlyCorporateTax: +(sciCorporateTax / 12).toFixed(2),
      grossYield: sciGrossYield,
      netYield: sciNetYield,
      monthlyCashflowBeforeTax: sciMonthlyCashflowBeforeTax,
      monthlyCashflow: sciMonthlyCashflow,
      annualCashflow: sciAnnualCashflow,
      indebtedness: sciIndebtedness,
      contributionRatio: +(sciContributionRatio * 100).toFixed(2),
      feasibility: sciFeasibility,
      annualTaxRealRegime: annualTaxWithoutLMNP,
      taxSavingsVsRealRegime: +(annualTaxWithoutLMNP - sciCorporateTax).toFixed(2),
    },
  };
};
