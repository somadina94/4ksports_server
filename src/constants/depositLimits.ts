/** USDT deposit request bounds (enforced server-side). */
export const MIN_DEPOSIT_AMOUNT = 10;
export const MAX_DEPOSIT_AMOUNT = 10000;

/** Bonus = this multiplier × first approved deposit amount (200% on top = 2× deposit). */
export const FIRST_DEPOSIT_BONUS_MULTIPLIER = 2;
