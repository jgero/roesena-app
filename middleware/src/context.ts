import { Request } from "express";

import { Database } from "./connection";

export class ContextMaker extends Database {

  private req: Request;

  constructor(req: Request) {
    super();
    this.req = req;
  }

  public async getAuthLevel() {
    // console.log(this.req.cookies.session_token);
    return 4;
  }
}
