import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { LeadsService, LeadInput } from './leads.service';

@Controller('leads')
export class LeadsController {
  constructor(private readonly leadsService: LeadsService) {}

  /**
   * Endpoint to intake a new lead. Expects JSON with lead fields.
   */
  @Post('intake')
  intake(@Body() body: LeadInput) {
    const lead = this.leadsService.createLead(body);
    return { id: lead.id, message: 'Lead received. Check your email for OTP.' };
  }

  /**
   * Verify email OTP. Body should contain { otp: string }.
   */
  @Post(':id/verify-email')
  verify(@Param('id') id: string, @Body('otp') otp: string) {
    const ok = this.leadsService.verifyLead(id, otp);
    return { verified: ok };
  }

  /**
   * Estimate score and price for a given lead. Returns null if lead not found.
   */
  @Post(':id/estimate')
  estimate(@Param('id') id: string) {
    const result = this.leadsService.estimateLead(id);
    return result || { error: 'Lead not found' };
  }

  /**
   * List all leads. Restricted to admin in production.
   */
  @Get()
  list() {
    return this.leadsService.listLeads();
  }
}