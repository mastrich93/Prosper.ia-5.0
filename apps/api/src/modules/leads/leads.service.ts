import { Injectable } from '@nestjs/common';
import { v4 as uuid } from 'uuid';
import { scoreLead, calcPrice } from '../../utils/scoring';

// Types describing a lead
export interface LeadInput {
  name: string;
  email: string;
  phone?: string;
  city?: string;
  cap?: string;
  sector: string;
  description: string;
  budget?: number;
  urgency?: number;
}

export interface Lead extends LeadInput {
  id: string;
  createdAt: Date;
  otp: string;
  verified: boolean;
  score?: number;
  price?: number;
}

@Injectable()
export class LeadsService {
  // In-memory list of leads; in production this would be a DB
  private leads: Lead[] = [];

  /**
   * Accept a new lead, generate an OTP and store it. Returns the lead object.
   */
  createLead(input: LeadInput): Lead {
    const id = uuid();
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const lead: Lead = {
      id,
      createdAt: new Date(),
      otp,
      verified: false,
      ...input,
    };
    this.leads.push(lead);
    // In a real implementation we would enqueue a job to send the OTP via email/SMS
    console.log(`Generated OTP ${otp} for lead ${id}`);
    return lead;
  }

  /**
   * Verify a lead by matching the provided OTP. Marks the lead as verified.
   */
  verifyLead(id: string, otp: string): boolean {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return false;
    if (lead.otp === otp) {
      lead.verified = true;
      return true;
    }
    return false;
  }

  /**
   * Compute score and price for a lead based on input attributes and sector.
   */
  estimateLead(id: string): { score: number; price: number } | null {
    const lead = this.leads.find((l) => l.id === id);
    if (!lead) return null;
    // Determine completeness: presence of optional fields
    const filled = ['phone', 'city', 'cap', 'budget'].filter((k) => (lead as any)[k]);
    const completePct = filled.length / 4;
    const textQuality = Math.min(Math.max(lead.description.length / 200, 0), 1);
    const budget = lead.budget || 0;
    const urgency = lead.urgency || 0;
    const score = scoreLead({ completePct, textQuality, budget, urgency });
    // Determine tier based on sector (simplistic): some sectors may be high value
    let tier: 'LOW' | 'MID' | 'HIGH' = 'MID';
    const highSectors = ['assicurazioni', 'finanza', 'immobiliare'];
    const lowSectors = ['giardinaggio', 'artigianato'];
    if (highSectors.includes(lead.sector.toLowerCase())) tier = 'HIGH';
    if (lowSectors.includes(lead.sector.toLowerCase())) tier = 'LOW';
    // For pricing we need quality, urgency, competition (stubbed as 0.5)
    const price = calcPrice({ tier, quality: score, urgency: urgency || 0, competition: 0.5 });
    lead.score = score;
    lead.price = price;
    return { score, price };
  }

  /**
   * List all leads (for admin). In production this would support pagination and filtering.
   */
  listLeads(): Lead[] {
    return this.leads;
  }
}