import {
  calculateAnnualLMNPDepreciation,
  calculateAnnualNonRecoverableCopro,
  calculateAnnualPropertyTaxNetOfTom,
  calculateCorporateTax,
  calculateGrossYield,
  calculateIndebtedness,
  calculateLoanAmount,
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
  calculateTotalSalary,
  calculateTotalcontribution,
  calculateVacancyCost,
} from '@/utils/simulationResults';
import { test, describe, expect } from 'vitest';

describe('simulationResults', () => {
  test('calculateTotalSalary', () => {
    expect(calculateTotalSalary(1000, 500)).toBe(1500);
    expect(calculateTotalSalary(1000)).toBe(1000);
  });

  test('calculateTotalcontribution', () => {
    expect(calculateTotalcontribution(1000, 500)).toBe(1500);
    expect(calculateTotalcontribution(1000)).toBe(1000);
  });

  test('calculateNotaryFees', () => {
    expect(calculateNotaryFees(10000)).toBe(800);
  });

  test('calculateLoanAmount', () => {
    expect(calculateLoanAmount(10000, 5000, 800, 200)).toBe(6000);
    expect(calculateLoanAmount(10000, 5000, 800)).toBe(5800);
  });

  test('calculateMonthlyLoanCost', () => {
    expect(calculateMonthlyLoanCost(10000, 5, 20)).toBeCloseTo(66, 2);
  });

  test('calculateMonthlyInsuranceCost', () => {
    expect(calculateMonthlyInsuranceCost(10000, 1)).toBeCloseTo(8.33, 2);
  });

  test('calculateMonthlyPayment', () => {
    expect(calculateMonthlyPayment(65.98, 8.33)).toBeCloseTo(74.31, 2);
  });

  test('calculateIndebtedness', () => {
    expect(calculateIndebtedness(74.31, 1500)).toBeCloseTo(0.05, 3);
  });

  test('calculatePnoCost', () => {
    expect(calculatePnoCost(100_000)).toBe(80);
    expect(calculatePnoCost(200_000)).toBe(140);
    expect(calculatePnoCost(500_000)).toBe(250);
  });

  test('calculateTotalAcquisitionCost', () => {
    expect(calculateTotalAcquisitionCost(200_000, 16_000, 10_000)).toBe(226_000);
  });

  test('calculateAnnualNonRecoverableCopro', () => {
    expect(calculateAnnualNonRecoverableCopro(100, 50, 100)).toBe(700);
    expect(calculateAnnualNonRecoverableCopro(100, 0, 0)).toBe(1200);
    expect(calculateAnnualNonRecoverableCopro(50, 30, 50)).toBe(290);
  });

  test('calculateAnnualPropertyTaxNetOfTom', () => {
    expect(calculateAnnualPropertyTaxNetOfTom(1200, 100)).toBe(1100);
    expect(calculateAnnualPropertyTaxNetOfTom(500, 600)).toBe(0);
  });

  test('calculateRentalTaxableIncome', () => {
    expect(calculateRentalTaxableIncome(1000, 700, 1100, 150, 3000)).toBe(7050);
    expect(calculateRentalTaxableIncome(1000, 700, 1100, 150, 3000, 4000)).toBe(3050);
  });

  test('calculateRentalIncomeTax', () => {
    expect(calculateRentalIncomeTax(10_000, 30)).toBeCloseTo(4720, 0);
    expect(calculateRentalIncomeTax(-500, 30)).toBe(0);
    expect(calculateRentalIncomeTax(0, 30)).toBe(0);
  });

  test('calculateGrossYield', () => {
    expect(calculateGrossYield(800, 240_000)).toBe(4);
    expect(calculateGrossYield(800, 0)).toBe(0);
  });

  test('calculateNetYield', () => {
    expect(calculateNetYield(800, 700, 1100, 150, 800, 240_000)).toBeCloseTo(2.85, 1);
    expect(calculateNetYield(800, 700, 1100, 150, 800, 240_000, 1200)).toBeCloseTo(2.35, 1);
  });

  test('calculateMonthlyCashflow', () => {
    expect(calculateMonthlyCashflow(800, 50, 700, 100, 1200, 150, 2400)).toBeCloseTo(-262.5, 1);
    expect(calculateMonthlyCashflow(800, 50, 700, 100, 1200, 150, 2400, 80)).toBeCloseTo(-342.5, 1);
  });

  test('calculateAnnualLMNPDepreciation', () => {
    expect(calculateAnnualLMNPDepreciation(200_000, 0.03)).toBe(6000);
    expect(calculateAnnualLMNPDepreciation(0, 0.03)).toBe(0);
    expect(calculateAnnualLMNPDepreciation(-1000, 0.03)).toBe(0);
  });

  test('calculateMonthlyGLICost', () => {
    expect(calculateMonthlyGLICost(800, 0.025)).toBe(20);
    expect(calculateMonthlyGLICost(0, 0.025)).toBe(0);
  });

  test('calculateMonthlyPropertyManagementCost', () => {
    expect(calculateMonthlyPropertyManagementCost(800, 0.08)).toBe(64);
    expect(calculateMonthlyPropertyManagementCost(0, 0.08)).toBe(0);
  });

  test('calculateVacancyCost', () => {
    expect(calculateVacancyCost(900)).toBe(900);
  });

  test('calculateRentalIndebtedness', () => {
    expect(calculateRentalIndebtedness(700, 0, 3000, 800)).toBeCloseTo(0.197, 3);
    expect(calculateRentalIndebtedness(700, 200, 3000, 800)).toBeCloseTo(0.253, 3);
  });

  test('calculateSciAnnualDepreciation', () => {
    // price 200_000, land 15% → bâti = 170_000 / 30 = 5666.67
    // notary 16_000 / 20 = 800
    const result = calculateSciAnnualDepreciation(200_000, 16_000, 20, 0.15, 30);
    expect(result.building).toBeCloseTo(5666.67, 1);
    expect(result.notary).toBeCloseTo(800, 1);
    expect(result.total).toBeCloseTo(6466.67, 1);
  });

  test('calculateSciAnnualDepreciation with zero loanDuration', () => {
    const result = calculateSciAnnualDepreciation(100_000, 8_000, 0, 0.15, 30);
    expect(result.notary).toBe(0);
  });

  test('calculateSciTaxableProfit', () => {
    // rent 800/mo → 9600/yr ; charges 700+1100+150+3000+1200+0+6466.67 = 12616.67
    // profit = 9600 - 12616.67 = -3016.67
    expect(calculateSciTaxableProfit(800, 700, 1100, 150, 3000, 1200, 0, 6466.67)).toBeCloseTo(-3016.67, 1);
  });

  test('calculateCorporateTax', () => {
    // bénéfice négatif → 0
    expect(calculateCorporateTax(-1000, 0.15, 0.25, 42_500)).toBe(0);
    // bénéfice 10_000 → 15% × 10_000 = 1500
    expect(calculateCorporateTax(10_000, 0.15, 0.25, 42_500)).toBeCloseTo(1500, 0);
    // bénéfice 50_000 → 15% × 42 500 + 25% × 7 500 = 6375 + 1875 = 8250
    expect(calculateCorporateTax(50_000, 0.15, 0.25, 42_500)).toBeCloseTo(8250, 0);
  });

  test('calculateSciMonthlyCashflowBeforeTax', () => {
    // inflow 800+50 = 850 ; outflow 700+100+1200/12+150/12+1200/12 + 0 = 700+100+100+12.5+100 = 1012.5
    // cashflow = 850 - 1012.5 = -162.5
    expect(calculateSciMonthlyCashflowBeforeTax(800, 50, 700, 100, 1200, 150, 1200)).toBeCloseTo(-162.5, 1);
    // avec extras 80
    expect(calculateSciMonthlyCashflowBeforeTax(800, 50, 700, 100, 1200, 150, 1200, 80)).toBeCloseTo(-242.5, 1);
  });
});
