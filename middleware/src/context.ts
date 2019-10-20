import { Request } from "express";

import { ConnectionProvider } from "./connection";
import { Person } from "./interfaces";

export async function getAuthLevel(req: Request): Promise<number> {
  if (req.cookies.session_token) {
    const collection = (await ConnectionProvider.Instance.db).collection("persons");
    const result = await collection.findOne<Person>({ sessionId: req.cookies.session_token });
    return result ? result.authorityLevel : 1;
  } else {
    return 1;
  }
}
