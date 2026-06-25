import {
  calculateAnnualLMNPDepreciation,
  calculateAnnualNonRecoverableCopro,
  calculateAnnualPropertyTaxNetOfTom,
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
});
