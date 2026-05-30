import { Controller, Post, Body, Get, UseGuards } from '@nestjs/common';
import { AxiomIDService, BiometricData } from './axiom-id.service';
import { ApiTags, ApiOperation, ApiBearerAuth } from '@nestjs/swagger';

@ApiTags('AxiomID')
@Controller('axiom-id')
export class AxiomIDController {
  constructor(private readonly axiomIDService: AxiomIDService) {}

  @Post('generate')
  @ApiOperation({ summary: 'Generate a new AxiomID mathematical formula' })
  generateFormula(@Body() data: BiometricData) {
    const formula = this.axiomIDService.generateIdentityFormula(data);
    const value = this.axiomIDService.calculateIdentityValue(formula);
    return {
      success: true,
      data: {
        formula,
        currentValue: value,
        timestamp: Date.now(),
      },
    };
  }

  @Get('status')
  @ApiOperation({ summary: 'Get current AxiomID status and value' })
  getStatus() {
    // Mock status retrieval
    return {
      success: true,
      data: {
        active: true,
        identityScore: 85,
        lastUpdated: Date.now(),
      },
    };
  }
}
