import { Request } from 'express';

import { PersonType } from '../types';
import { getPersonBySessionId } from '../../database/get/auth';

export default {
  me: {
    type: PersonType,
    resolve: async (root: any, args: any, context: any) => {
      const req: Request = (await context).request;
      return getPersonBySessionId(req.cookies.session_token);
    }
  }
};
