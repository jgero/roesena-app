import * as express from 'express';
import * as cors from 'cors';
import * as cookieParser from 'cookie-parser';
import * as functions from 'firebase-functions';
import { createTransport } from 'nodemailer';
const { SecretManagerServiceClient } = require('@google-cloud/secret-manager');
const client = new SecretManagerServiceClient();

const app = express();
// allow cross-origin requests (currently only needed for testing in emulator)
app.use(cors({ origin: true }));
app.use(cookieParser());

app.post('/', async (req, res) => {
  // check if request body is valid
  const data = req.body.data;
  if (!data || !data.subject || !data.replyTo || !data.formData || !Array.isArray(data.formData) || !data.comment) {
    res.status(400).send({ error: 'request body invalid' });
    return;
  }

  // access the secret from google cloud
  let responsePayloadPassword;
  try {
    const [accessResponsePassword] = await client.accessSecretVersion({
      name: 'projects/sechta-narren/secrets/mailpw/versions/latest',
    });
    if (!accessResponsePassword.payload || !accessResponsePassword.payload.data) {
      res.status(500).send({ error: 'empty response for password secret in cloud function' });
      return;
    }
    responsePayloadPassword = accessResponsePassword.payload.data.toString();
  } catch (e) {
    res.status(500).send({ error: 'could not access password secret in cloud function' });
    return;
  }

  // create smtp transport
  const transporter = createTransport({
    host: 'smtp.strato.de',
    port: 465,
    auth: {
      user: 'webmaster@roesena.de',
      pass: responsePayloadPassword,
    },
  });
  let htmlMessage = '';
  // add list with all points of the form data property
  if (data.formData.length > 0) {
    htmlMessage += '<ul>';
    data.formData.forEach((el: any) => Object.keys(el).forEach((k) => (htmlMessage += `<li>${el[k]}</li>`)));
    htmlMessage += '</ul>';
  }
  // add comment
  htmlMessage += `<p>${data.comment}</p>`;

  const mailOptions = {
    from: 'webmaster@roesena.de',
    replyTo: data.replyTo,
    to: 'webmaster@roesena.de',
    cc: '',
    subject: `Kontaktformular RöSeNa-App | Betreff: ${data.subject}`,
    html: htmlMessage,
  };
  // if the subject is not "problem with website" send the mail to info
  if (data.subject === 'sonstiges' || data.subject === 'Narrenstall-Anfrage') {
    mailOptions.to = 'info@roesena.de';
    mailOptions.cc = 'webmaster@roesena.de';
  }
  transporter
    .sendMail(mailOptions)
    .then(() => {
      res.send({ data: 'Mail was sent' });
    })
    .catch((error) => {
      res.status(500).send({ error });
    });
});

// export express app as cloud function
export const sendContactMail = functions.region('europe-west1').https.onRequest(app);
