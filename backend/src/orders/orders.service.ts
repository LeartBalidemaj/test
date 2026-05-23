import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';

@Injectable()
export class OrdersService {
  constructor(private readonly prisma: PrismaService) {}

  findAllForUser(tenantId: number, userId: number) {
    return this.prisma.order.findMany({
      where: { tenantId, userId },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOneForUser(tenantId: number, userId: number, id: number) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId, userId },
      include: {
        items: { include: { product: true } },
        user: { select: { id: true, email: true } },
      },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return order;
  }

  async create(tenantId: number, userId: number, dto: CreateOrderDto) {
    const productIds = dto.items.map((item) => item.productId);
    const products = await this.prisma.product.findMany({
      where: { tenantId, id: { in: productIds } },
    });

    if (products.length !== productIds.length) {
      throw new BadRequestException(
        'One or more products are invalid for this tenant',
      );
    }

    const productMap = new Map(products.map((p) => [p.id, p]));
    let totalAmount = new Prisma.Decimal(0);
    const orderItems: Prisma.OrderItemCreateWithoutOrderInput[] = [];

    for (const item of dto.items) {
      const product = productMap.get(item.productId)!;
      if (product.stock < item.quantity) {
        throw new BadRequestException(
          `Insufficient stock for product "${product.name}"`,
        );
      }
      const lineTotal = product.price.mul(item.quantity);
      totalAmount = totalAmount.add(lineTotal);
      orderItems.push({
        product: { connect: { id: product.id } },
        quantity: item.quantity,
        price: product.price,
      });
    }

    return this.prisma.$transaction(async (tx) => {
      for (const item of dto.items) {
        await tx.product.update({
          where: { id: item.productId },
          data: { stock: { decrement: item.quantity } },
        });
      }

      return tx.order.create({
        data: {
          userId,
          tenantId,
          totalAmount,
          items: { create: orderItems },
        },
        include: {
          items: { include: { product: true } },
        },
      });
    });
  }

  async updateStatus(
    tenantId: number,
    id: number,
    dto: UpdateOrderStatusDto,
  ) {
    const order = await this.prisma.order.findFirst({
      where: { id, tenantId },
    });
    if (!order) {
      throw new NotFoundException(`Order with id ${id} not found`);
    }
    return this.prisma.order.update({
      where: { id },
      data: { status: dto.status },
      include: {
        items: { include: { product: true } },
      },
    });
  }

}
