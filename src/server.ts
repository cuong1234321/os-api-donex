/* eslint-disable import/first */
require('module-alias/register');
import path from 'path';
import express from 'express';
import compression from 'compression';
import session from 'express-session';
import cors from 'cors';
import sequelize from '@initializers/sequelize';
import strongParams from '@middlewares/parameters';
import { morganLogger } from '@middlewares/morgan';
import routes from '@configs/routes';
import Settings from '@configs/settings';
import swaggerUi from 'swagger-ui-express';
import cron from 'node-cron';
import VoucherApplicationsAction from '@jobs/VoucherApplicationsAction';
import birthdayActions from '@jobs/BirthdayActions';
import resetCoinActions from '@jobs/resetCoinActions';
import swaggerDocument from './swagger/doc';

const port = process.env.PORT || 3000;

const app = express();
app.use(compression());
app.use(express.json());
app.use(express.urlencoded({
  extended: true,
}));
app.use(express.static(path.join(__dirname, '../public')));
app.use(session({
  resave: true,
  saveUninitialized: true,
  secret: Settings.sessionSecret,
}));

app.use(cors());
app.options('*', cors());
app.use(morganLogger());
app.use(strongParams());

app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use('/api', routes);

cron.schedule('0,10,20,30,40,50 * * * *', async () => {
  try {
    await VoucherApplicationsAction.SendVoucher();
  } catch (error) {
    console.log(error.message);
  }
});

cron.schedule('0,10,20,30,40,50 * * * *', async () => {
  try {
    await birthdayActions.donexBirthDay();
    await birthdayActions.userBirthDay();
    await resetCoinActions.latOrderOutOfDate();
  } catch (error) {
    console.log(error.message);
  }
});

app.use((req, res) => {
  res.status(404).send({ url: `${req.path} not found` });
});

sequelize.authenticate().then(() => {
  app.listen(port, () => {
    console.log(`App is running localhost:${port}`);
    console.log('  Press CTRL-C to stop\n');
  });
});
