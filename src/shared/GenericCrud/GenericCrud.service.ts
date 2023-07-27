import { User } from "@prisma/client";
import prisma from "../../prisma";
import { connect } from "http2";

export interface CrudService<E> {
  getAll: (connect?: string[]) => Promise<E[] | undefined>;
  getById: (id: string, connect?: string[]) => Promise<E>;
  create: (
    entity: E,
    ownerId?: string,
    connect?: string[]
  ) => Promise<E | undefined>;
  remove: (id: string) => Promise<E>;
  update: (entity: E) => Promise<E>;
}

type Key = keyof typeof prisma;
export class BaseCrudService<E> implements CrudService<E> {
  constructor(private key: Key) {}

  async getAll(connect?: string[]) {
    const result = await (prisma[this.key] as any).findMany({
      ...(connect ? { include: { [connect?.[0]]: true } } : {}),
    });
    return result as E[];
  }

  async getById(id: string, connect?: string[]) {
    const result = await (prisma[this.key] as any).findUnique({
      where: { id },
      include: { [connect[0]]: true },
    });
    return result as E;
  }

  async create(entity: E, ownerId?: string, connect?: string[]) {
    const connected = entity[connect?.[0]];

    const result = await (prisma[this.key] as any).create({
      data: {
        ...entity,
        ...(ownerId ? { ownerId } : {}),
        ...(connect
          ? {
              [connect[0]]: {
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

  async update(entity: E, connect?: string[]) {
    const connected = entity[connect?.[0]];
    const result = await (prisma[this.key] as any).update({
      where: { id: (entity as any).id },
      data: {
        ...entity,
        [connect?.[0]]: { connect: connected.map((el) => ({ id: el.id })) },
      },
    });
    return result as E;
  }
}
