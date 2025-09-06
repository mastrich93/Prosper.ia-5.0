// Utility functions for scoring and pricing leads

export type LeadInfo = {
  completePct: number;
  textQuality: number;
  budget: number;
  urgency: number;
};

export type PricingInput = {
  tier: 'LOW' | 'MID' | 'HIGH';
  quality: number;
  urgency: number;
  competition: number;
};

/**
 * Calculate a score between 0 and 1 for a lead based on completeness,
 * text quality, budget and urgency. Higher scores represent higher quality leads.
 */
export function scoreLead({ completePct, textQuality, budget, urgency }: LeadInfo): number {
  // Normalize budget to a 0–1 range: assume typical budgets between €500 and €5,000
  const normBudget = Math.min(Math.max((budget - 500) / 4500, 0), 1);
  // Weighted factors: completeness and text quality are most important
  const score = 0.4 * completePct + 0.3 * textQuality + 0.2 * normBudget + 0.1 * urgency;
  return Math.round(score * 1000) / 1000;
}

/**
 * Determine a dynamic price for a lead based on sector tier, quality and market competition.
 * Returns a value in Euros. Default base price ranges from 2.99 to 27.99.
 */
export function calcPrice({ tier, quality, urgency, competition }: PricingInput): number {
  // Base price per tier
  let base: number;
  switch (tier) {
    case 'LOW':
      base = 2.99;
      break;
    case 'MID':
      base = 9.99;
      break;
    case 'HIGH':
      base = 19.99;
      break;
    default:
      base = 5.0;
  }
  // Adjust based on quality (0–1), urgency (0–1) and competition (0–1)
  const multiplier = 1 + 0.5 * quality + 0.3 * urgency - 0.2 * competition;
  const price = base * multiplier;
  // Constrain to allowed range
  const finalPrice = Math.min(Math.max(price, 2.99), 27.99);
  return Math.round(finalPrice * 100) / 100;
}