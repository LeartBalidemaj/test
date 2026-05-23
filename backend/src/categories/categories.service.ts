import {
  ConflictException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../prisma/prisma.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@Injectable()
export class CategoriesService {
  constructor(private readonly prisma: PrismaService) {}

  findAll(tenantId: number) {
    return this.prisma.category.findMany({
      where: { tenantId },
      orderBy: { name: 'asc' },
    });
  }

  async findOne(tenantId: number, id: number) {
    const category = await this.prisma.category.findFirst({
      where: { id, tenantId },
    });
    if (!category) {
      throw new NotFoundException(`Category with id ${id} not found`);
    }
    return category;
  }

  async create(tenantId: number, dto: CreateCategoryDto) {
    try {
      return await this.prisma.category.create({
        data: { name: dto.name, tenantId },
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Category name already exists for this tenant');
      }
      throw error;
    }
  }

  async update(tenantId: number, id: number, dto: UpdateCategoryDto) {
    await this.findOne(tenantId, id);
    try {
      return await this.prisma.category.update({
        where: { id },
        data: dto,
      });
    } catch (error) {
      if (
        error instanceof Prisma.PrismaClientKnownRequestError &&
        error.code === 'P2002'
      ) {
        throw new ConflictException('Category name already exists for this tenant');
      }
      throw error;
    }
  }

  async remove(tenantId: number, id: number) {
    await this.findOne(tenantId, id);
    return this.prisma.category.delete({ where: { id } });
  }
}
