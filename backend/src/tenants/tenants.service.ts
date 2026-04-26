import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class TenantsService {
  constructor(private prisma: PrismaService) {}

  findAll() {
    return this.prisma.tenant.findMany();
  }

  findOne(id: number) {
    return this.prisma.tenant.findUnique({ where: { id } });
  }

  create(data: { name: string; slug: string; email: string }) {
    return this.prisma.tenant.create({ data });
  }

  update(id: number, data: Partial<{ name: string; slug: string; email: string; isActive: boolean }>) {
    return this.prisma.tenant.update({ where: { id }, data });
  }

  remove(id: number) {
    return this.prisma.tenant.delete({ where: { id } });
  }
}