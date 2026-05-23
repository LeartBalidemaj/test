import {
  BadRequestException,
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { ApplyCouponDto } from './dto/apply-coupon.dto';
import { CreateCouponDto } from './dto/create-coupon.dto';
import { UpdateCouponDto } from './dto/update-coupon.dto';

@Injectable()
export class CouponsService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: number) {
    return this.prisma.coupon.findMany({
      where: { tenantId },
      orderBy: { code: 'asc' },
    });
  }

  async findOne(tenantId: number, id: number) {
    const coupon = await this.prisma.coupon.findFirst({
      where: { id, tenantId },
    });
    if (!coupon) {
      throw new NotFoundException(`Coupon with id ${id} not found`);
    }
    return coupon;
  }

  async create(tenantId: number, dto: CreateCouponDto) {
    try {
      return await this.prisma.coupon.create({
        data: {
          code: dto.code.toUpperCase(),
          discount: dto.discount,
          tenantId,
          expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : undefined,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Coupon code already exists for this tenant');
      }
      throw error;
    }
  }

  async update(tenantId: number, id: number, dto: UpdateCouponDto) {
    await this.findOne(tenantId, id);
    try {
      return await this.prisma.coupon.update({
        where: { id },
        data: {
          code: dto.code?.toUpperCase(),
          discount: dto.discount,
          expiresAt:
            dto.expiresAt === undefined
              ? undefined
              : dto.expiresAt
                ? new Date(dto.expiresAt)
                : null,
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Coupon code already exists for this tenant');
      }
      throw error;
    }
  }

  async remove(tenantId: number, id: number) {
    await this.findOne(tenantId, id);
    return this.prisma.coupon.delete({ where: { id } });
  }

  async apply(tenantId: number, dto: ApplyCouponDto) {
    const coupon = await this.prisma.coupon.findFirst({
      where: {
        tenantId,
        code: dto.code.toUpperCase(),
      },
    });

    if (!coupon) {
      throw new NotFoundException(`Coupon "${dto.code}" not found`);
    }

    if (coupon.expiresAt && coupon.expiresAt < new Date()) {
      throw new BadRequestException('Coupon has expired');
    }

    const originalAmount =
      dto.amount !== undefined ? new Prisma.Decimal(dto.amount) : null;

    let discountedAmount: Prisma.Decimal | null = null;
    if (originalAmount !== null) {
      discountedAmount = Prisma.Decimal.max(
        originalAmount.sub(coupon.discount),
        new Prisma.Decimal(0),
      );
    }

    return {
      code: coupon.code,
      discount: coupon.discount,
      originalAmount,
      discountedAmount,
      savings:
        originalAmount !== null && discountedAmount !== null
          ? originalAmount.sub(discountedAmount)
          : coupon.discount,
    };
  }
}
