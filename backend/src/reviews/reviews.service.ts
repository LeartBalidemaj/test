import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';

@Injectable()
export class ReviewsService {
  constructor(private readonly prisma: PrismaService) {}

  findByProduct(tenantId: number, productId: number) {
    return this.prisma.review.findMany({
      where: { tenantId, productId },
      include: {
        product: { select: { id: true, name: true } },
        user: { select: { id: true, email: true } },
      },
      orderBy: { id: 'desc' },
    });
  }

  async findOne(tenantId: number, id: number) {
    const review = await this.prisma.review.findFirst({
      where: { id, tenantId },
      include: {
        product: { select: { id: true, name: true } },
        user: { select: { id: true, email: true } },
      },
    });
    if (!review) {
      throw new NotFoundException(`Review with id ${id} not found`);
    }
    return review;
  }

  async create(tenantId: number, userId: number, dto: CreateReviewDto) {
    const product = await this.prisma.product.findFirst({
      where: { id: dto.productId, tenantId },
    });
    if (!product) {
      throw new BadRequestException(
        `Product with id ${dto.productId} not found in this tenant`,
      );
    }

    try {
      return await this.prisma.review.create({
        data: {
          userId,
          productId: dto.productId,
          rating: dto.rating,
          comment: dto.comment,
          tenantId,
        },
        include: {
          product: { select: { id: true, name: true } },
          user: { select: { id: true, email: true } },
        },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('You have already reviewed this product');
      }
      throw error;
    }
  }

  async update(tenantId: number, id: number, dto: UpdateReviewDto) {
    await this.findOne(tenantId, id);
    return this.prisma.review.update({
      where: { id },
      data: dto,
      include: {
        product: { select: { id: true, name: true } },
        user: { select: { id: true, email: true } },
      },
    });
  }

  async removeOwn(tenantId: number, userId: number, id: number) {
    const review = await this.findOne(tenantId, id);
    if (review.userId !== userId) {
      throw new ForbiddenException('You can only delete your own reviews');
    }
    return this.prisma.review.delete({ where: { id } });
  }
}
