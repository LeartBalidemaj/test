import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Post,
  UseGuards,
} from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiOperation,
  ApiParam,
  ApiTags,
} from '@nestjs/swagger';
import { UserRole } from '@prisma/client';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import type { AuthUser } from '../auth/types/jwt-payload.interface';
import { CurrentUser } from '../common/decorators/current-user.decorator';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { CouponsService } from './coupons.service';

@ApiTags('Coupons')
@ApiBearerAuth()
@Controller('coupons')
export class CouponsController {
  constructor(private readonly couponsService: CouponsService) {}

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Get()
  @ApiOperation({ summary: 'List all coupons (admin only)' })
  findAll(@CurrentUser() user: AuthUser) {
    return this.couponsService.findAll(user.tenantId);
  }

  @Post('apply')
  @ApiOperation({ summary: 'Validate and apply a coupon code' })
  apply(@CurrentUser() user: AuthUser, @Body() dto: ApplyCouponDto) {
    return this.couponsService.apply(user.tenantId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Post()
  @ApiOperation({ summary: 'Create a coupon (admin only)' })
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCouponDto) {
    return this.couponsService.create(user.tenantId, dto);
  }

  @UseGuards(RolesGuard)
  @Roles(UserRole.ADMIN)
  @Delete(':id')
  @ApiOperation({ summary: 'Delete a coupon (admin only)' })
  @ApiParam({ name: 'id', type: Number })
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id', ParseIntPipe) id: number,
  ) {
    return this.couponsService.remove(user.tenantId, id);
  }
}
