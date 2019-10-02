import express = require('express');
import bodyParser = require('body-parser');
import cookieParser = require('cookie-parser');
import { getPerson, updatePerson, addPerson, deletePerson } from './handlers/person';
import { login, logout, restoreSession, changePassword } from './handlers/auth';
import { getArticle, updateArticle, addArticle, deleteArticle } from './handlers/article';
import { getImage, updateImage, addImage, deleteImage } from './handlers/image';
import { getEvent, updateEvent, addEvent, deleteEvent } from './handlers/event';

// create the Application that listens to the requests
const app: express.Application = express();
app.use(bodyParser.json());
app.use(cookieParser())
app.listen(3000, () => new Server());

class Server {

  constructor() {
    console.log('Backend started.');

    app.route('/api/login').post(login);
    app.route('/api/logout/:username').post(logout);
    app.route('/api/restore').get(restoreSession);
    app.route('/api/changePW').post(changePassword);

    app.route('/api/person').get(getPerson);
    app.route('/api/person').put(updatePerson);
    app.route('/api/person').post(addPerson);
    app.route('/api/person').delete(deletePerson);

    app.route('/api/article').get(getArticle);
    app.route('/api/article').put(updateArticle);
    app.route('/api/article').post(addArticle);
    app.route('/api/article').delete(deleteArticle);

    app.route('/api/image').get(getImage);
    app.route('/api/image').put(updateImage);
    app.route('/api/image').post(addImage);
    app.route('/api/image').delete(deleteImage);

    app.route('/api/event').get(getEvent);
    app.route('/api/event').put(updateEvent);
    app.route('/api/event').post(addEvent);
    app.route('/api/event').delete(deleteEvent);
  }
}