export type CustomTooltipProps = {
  active?: boolean;
  payload?: { payload: { subject: string; fill: string }; name: string; value: string; fill: string }[];
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