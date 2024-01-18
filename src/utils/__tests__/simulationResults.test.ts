import {
  calculateTotalSalary,
  calculateTotalcontribution,
  calculateNotaryFees,
  calculateLoanAmount,
  calculateMonthlyLoanCost,
  calculateMonthlyInsuranceCost,
  calculateMonthlyPayment,
  calculateIndebtedness,
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
});
