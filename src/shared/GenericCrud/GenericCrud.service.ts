import prisma from "../../prisma";

export interface CrudService<E> {
  getAll: (
    start?: number,
    count?: number,
    textFragment?: string
  ) => Promise<E[] | undefined>;
  getById: (id: string) => Promise<E>;
  create: (entity: E, ownerId?: string) => Promise<E | undefined>;
  remove: (id: string) => Promise<E>;
  update: (entity: E) => Promise<E>;
}

type Key = keyof typeof prisma;
export class BaseCrudService<E> implements CrudService<E> {
  constructor(private key: Key) {}

  async getAll(start?: number, count?: number) {
    const result = await (prisma[this.key] as any).findMany({
      skip: start,
      take: count,
    });
    return result as E[];
  }

  async getById(id: string) {
    const result = await (prisma[this.key] as any).findUnique({
      where: { id },
    });
    return result as E;
  }

  async create(entity: E, ownerId?: string) {
    const result = await (prisma[this.key] as any).create({
      data: {
        ...entity,
        ...(ownerId ? { ownerId } : {}),
      },
    });
    return result as E;
  }

  async remove(id: string) {
    const result = await (prisma[this.key] as any).delete({ where: { id } });
    return result as E;
  }

  async update(entity: E) {
    const result = await (prisma[this.key] as any).update({
      where: { id: (entity as any).id },
      data: {
        ...entity,
      },
    });
    return result as E;
  }
}

export class ConnectedCrudService<E> implements CrudService<E> {
  constructor(private key, private connectedField: string) {
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(start?: number, count?: number, textFragment?: string) {
    const result = await(prisma[this.key] as any).findMany({
      ...(this.connectedField
        ? { include: { [this.connectedField]: true } }
        : {}),
      skip: start,
      take: count,
    });
    return result as E[];
  }

  async getById(id: string) {
    const result = await(prisma[this.key] as any).findUnique({
      where: { id },
      include: { [this.connectedField]: true },
    });
    return result as E;
  }

  async create(entity: E, ownerId?: string) {
    const connected = entity[this.connectedField];

    const result = await(prisma[this.key] as any).create({
      data: {
        ...entity,
        ...(ownerId ? { ownerId } : {}),
        ...(this.connectedField
          ? {
              [this.connectedField]: {
                connect: connected.map((el) => ({
                  id: el.id,
                })),
              },
            }
          : {}),
      },
    });
    return result as E;
  }

  async remove(id: string) {
    const result = await (prisma[this.key] as any).delete({ where: { id } });
    return result as E;
  }

  async update(entity: E) {
    const connected = entity[this.connectedField];
    const result = await(prisma[this.key] as any).update({
      where: { id: (entity as any).id },
      data: {
        ...entity,
        [this.connectedField]: {
          connect: connected.map((el) => ({ id: el.id })),
        },
      },
    });
    return result as E;
  }
}
