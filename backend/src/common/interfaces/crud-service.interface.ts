export type MaybePromise<T> = T | Promise<T>;

export interface TenantScopedCrudService<
  Entity,
  CreateDto,
  UpdateDto,
  QueryDto = void,
> {
  findAll(tenantId: number, query?: QueryDto): MaybePromise<Entity[]>;
  findOne(tenantId: number, id: number): MaybePromise<Entity>;
  create(tenantId: number, dto: CreateDto): MaybePromise<Entity>;
  update(tenantId: number, id: number, dto: UpdateDto): MaybePromise<Entity>;
  remove(tenantId: number, id: number): MaybePromise<Entity>;
}
