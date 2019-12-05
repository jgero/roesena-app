import sirv from 'sirv';
import express from 'express';
import bodyParser from 'body-parser';
import compression from 'compression';
import * as sapper from '@sapper/server';

import { initDB } from './dbConnection.js';

const { PORT, NODE_ENV } = process.env;
const dev = NODE_ENV === 'development';

initDB(() => {
  express()
    .use(bodyParser.json())
    .use(compression({ threshold: 0 }), sirv('static', { dev }), sapper.middleware())
    .listen(PORT, err => {
      if (err) console.log('error', err);
    });
});
