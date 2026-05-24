import { ConflictException, NotFoundException } from '@nestjs/common';
import { Prisma } from '@prisma/client';

export abstract class BaseService {
  protected ensureFound<Entity>(
    entity: Entity | null | undefined,
    resourceName: string,
    id: number | string,
  ): Entity {
    if (!entity) {
      throw new NotFoundException(`${resourceName} with id ${id} not found`);
    }

    return entity;
  }

  protected handleUniqueConstraint(error: unknown, message: string): never {
    if (
      error instanceof Prisma.PrismaClientKnownRequestError &&
      error.code === 'P2002'
    ) {
      throw new ConflictException(message);
    }

    throw error;
  }
}
