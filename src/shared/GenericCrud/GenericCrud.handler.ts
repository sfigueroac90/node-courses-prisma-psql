import { NextFunction, Request, Response } from "express";
import { CrudService } from "./GenericCrud.service";

export class GenericHandler<E> {
  constructor(
    private crudService: CrudService<E>,
    private owned?: boolean,
    private connect?: string[]
  ) {
    this.getAll = this.getAll.bind(this);
    this.get = this.get.bind(this);
    this.create = this.create.bind(this);
    this.remove = this.remove.bind(this);
    this.update = this.update.bind(this);
  }
  async getAll(req: Request, res: Response, next: NextFunction) {
    try {
      const all = await this.crudService.getAll(this.connect);
      res.status(200);
      res.json(all);
    } catch (e) {
      next(e);
    }
  }

  async get(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const el = await this.crudService.getById(id, this.connect);
      res.status(200);
      res.json(el);
    } catch (e) {
      next(e);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    try {
      const el = req.body;
      const userId = req["user"]["id"];
      const retrievedEl = await this.crudService.create(
        el,
        this.owned ? userId : undefined,
        this.connect
      );
      res.status(200);
      res.json(retrievedEl);
    } catch (e) {
      next(e);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const el = req.body;
      console.log({ req });
      if (id !== el.id) {
        throw Error("id does not match");
      }
      const retrievedEl = await this.crudService.update({ ...el });
      res.status(200);
      res.json(retrievedEl);
    } catch (e) {
      next(e);
    }
  }

  async remove(req: Request, res: Response, next: NextFunction) {
    try {
      const id = req.params.id;
      const retrievedEl = await this.crudService.remove(id);
      res.status(200);
      res.json(retrievedEl);
    } catch (e) {
      next(e);
    }
  }
}
