import { Request } from "express";

import { Database } from "./connection";
import { Person } from "./interfaces";

export class ContextMaker extends Database {

  private req: Request;

  constructor(req: Request) {
    super();
    this.req = req;
  }

  public async getAuthLevel() {
    if (this.req.cookies.session_token) {
      const collection = (await Database.db).collection("persons");
      const result = await collection.findOne<Person>({ sessionId: this.req.cookies.session_token });
      return result ? result.authorityLevel : 1;
    } else {
      return 1;
    }
  }
}
