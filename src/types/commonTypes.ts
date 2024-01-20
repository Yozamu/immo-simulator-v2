export type CustomTooltipProps = {
  active?: boolean;
  payload?: {
    payload: { subject: string; fill: string; name: string };
    name: string;
    value: string;
    fill: string;
    color: string;
  }[];
  label?: string;
};

export type CustomLabel = {
  cx: number;
  cy: number;
  midAngle: number;
  innerRadius: number;
  outerRadius: number;
  percent: number;
};

export type InputValue = {
  title: string;
  name: keyof SimulationData;
  min: number;
  max: number;
  step: number;
};

export type SimulationData = {
  price: number;
  contribution: number;
  loanRate: number;
  insuranceRate: number;
  salary: number;
  loanDuration: number;
  coLoanPercent: number;
  coSalary: number;
  coContribution: number;
  worksBudget: number;
};
