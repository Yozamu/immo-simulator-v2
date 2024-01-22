export const calculateTotalSalary = (salary: number, coSalary?: number): number => {
  return salary + (coSalary ?? 0);
};

export const calculateTotalcontribution = (contribution: number, coContribution?: number): number => {
  return contribution + (coContribution ?? 0);
};

export const calculateNotaryFees = (price: number): number => {
  return price * 0.08;
};

export const calculateLoanAmount = (
  price: number,
  totalcontribution: number,
  notaryFees: number,
  worksBudget = 0
): number => {
  return Math.max(0, price - totalcontribution + notaryFees + worksBudget);
};

export const calculateMonthlyLoanCost = (loanAmount: number, loanRate: number, years: number): number => {
  const monthlyloanRate = loanRate / 100 / 12;
  const denominator = 1 - Math.pow(1 + monthlyloanRate, -years * 12);
  const monthlyLoanCost = ((loanAmount * monthlyloanRate) / denominator).toFixed(2);
  return +monthlyLoanCost;
};

export const calculateMonthlyInsuranceCost = (loanAmount: number, insuranceRate: number): number => {
  const monthlyInsuranceCost = (loanAmount * (insuranceRate / 100 / 12)).toFixed(2);
  return +monthlyInsuranceCost;
};

export const calculateMonthlyPayment = (monthlyLoanCost: number, monthlyInsuranceCost: number): number => {
  const monthlyPayment = (monthlyLoanCost + monthlyInsuranceCost).toFixed(2);
  return +monthlyPayment;
};

export const calculateIndebtedness = (monthlyPayment: number, totalSalary: number): number => {
  const indebtedness = (monthlyPayment / totalSalary).toFixed(3);
  return +indebtedness;
};

export const calculateDoable = (indebtedness: number): boolean => {
  const doable = indebtedness <= 0.35;
  return doable;
};

export const calculateLoanRepayment = (loanAmount: number, loanRate: number, years: number) => {
  const monthlyLoanCost = calculateMonthlyLoanCost(loanAmount, loanRate, years);
  const interests = [loanAmount * ((0.01 * loanRate) / 12)];
  const capital = [monthlyLoanCost - interests[0]];
  const leftToPay = [loanAmount - capital[0]];
  for (let i = 1; i < years * 12; i++) {
    interests.push(leftToPay[i - 1] * ((0.01 * loanRate) / 12));
    capital.push(monthlyLoanCost - interests[i]);
    leftToPay.push(leftToPay[i - 1] - capital[i]);
  }
  return { interests, capital, leftToPay };
};

export const calculateTotalInterestCost = (loanAmount: number, loanRate: number, years: number): number => {
  const { interests } = calculateLoanRepayment(loanAmount, loanRate, years);
  const totalInterestCost = interests.reduce((acc, curr) => acc + curr, 0);
  return +totalInterestCost.toFixed(2);
};

export const calculateTotalInsuranceCost = (monthlyInsuranceCost: number, years: number): number => {
  const totalInsuranceCost = +(monthlyInsuranceCost * years * 12).toFixed(2);
  return totalInsuranceCost;
};

export const calculateTotalLoanCost = (totalInterestCost: number, totalInsuranceCost: number): number => {
  const totalLoanCost = totalInterestCost + totalInsuranceCost;
  return totalLoanCost;
};

export const calculateTotalCost = (totalLoanCost: number, notaryFees: number): number => {
  const totalCost = (totalLoanCost + notaryFees).toFixed();
  return +totalCost;
};

export const calculateQuota = (
  coLoanPercent: number,
  loanAmount: number,
  contribution: number,
  price: number
): number => {
  const quota = (((((100 - coLoanPercent) / 100) * loanAmount + contribution) / (price * 1.08)) * 100).toFixed();
  return +quota;
};

export const calculateLeftToLive = (salary: number, monthlyPayment: number, loanPercent: number): number => {
  const leftToLive = (((salary - (monthlyPayment * loanPercent) / 100) / salary) * 100).toFixed();
  return +leftToLive;
};

export const calculateSoulte = (price: number, capitalLeft: number, quotity: number) => {
  return +((price - capitalLeft) * (quotity / 100)).toFixed();
};
