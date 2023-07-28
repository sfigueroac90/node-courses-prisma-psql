import { connect } from "http2";
import { query } from "express";
import prisma from "../../prisma";
import { text } from "stream/consumers";

export interface CrudService<E> {
  getAll: (
    start?: number,
    count?: number,
    textFragment?: string
  ) => Promise<E[] | undefined>;
  getById: (id: string) => Promise<E>;
  create: (entity: E, ownerId?: string) => Promise<E | undefined>;
  remove: (id: string) => Promise<E>;
  update: (entity: E, ownerId?: string) => Promise<E>;
}

type Key = keyof typeof prisma;
export class BaseCrudService<E> implements CrudService<E> {
  constructor(private key: Key, searchFields?: string[]) {}

  async getAll(start?: number, count?: number) {
    const result = await (prisma[this.key] as any).findMany({
      skip: start ? start : undefined,
      take: count ? start : undefined,
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
    console.log({ ownerId });
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
  constructor(
    private key,
    private sorter: any,
    private connectedField: string,
    private searchFields?: string[]
  ) {
    this.create = this.create.bind(this);
    this.getById = this.getById.bind(this);
    this.getAll = this.getAll.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
  }

  async getAll(start?: number, count?: number, textFragment?: string) {
    const searchQuery =
      this.searchFields && !!textFragment
        ? {
            where: {
              OR: this.searchFields.reduce(
                (fields, field) => [
                  ...fields,
                  {
                    [field]: {
                      contains: textFragment.toLowerCase(),
                      mode: "insensitive",
                    },
                  },
                ],
                []
              ),
            },
          }
        : {};
    const result = await (prisma[this.key] as any).findMany({
      ...(this.connectedField
        ? { include: { [this.connectedField]: true } }
        : {}),
      ...searchQuery,
      skip: start ? start : undefined,
      take: count ? count : undefined,
      ...(this.sorter ? { ...this.sorter } : {}),
    });
    return result as E[];
  }

  async getById(id: string) {
    const result = await (prisma[this.key] as any).findUnique({
      where: { id },
      include: { [this.connectedField]: true },
    });
    return result as E;
  }

  async create(entity: E, ownerId?: string) {
    const connected = entity[this.connectedField];

    const result = await (prisma[this.key] as any).create({
      data: {
        ...entity,
        ...(ownerId ? { owner: { connect: { id: ownerId } } } : {}),
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

  async update(entity: E, ownerId: string) {
    const connected = entity[this.connectedField];
    const result = await (prisma[this.key] as any).update({
      where: { id: (entity as any).id },
      data: {
        ...entity,

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
}
