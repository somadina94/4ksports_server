import { TicketType } from "../constants/enums.js";

export const calculateTotalOdds = (type: string, odds: number[]): number => {
  if (!odds.length) return 0;
  if (type === TicketType.SINGLE) return odds[0] ?? 0;
  return odds.reduce((acc, value) => acc * value, 1);
};

export const calculatePayout = (stake: number, totalOdds: number): number => {
  return Number((stake * totalOdds).toFixed(2));
};
