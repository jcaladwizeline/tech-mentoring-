import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
const app = express();
const port = 3000;


class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.config();
    this.addServices();
  }

  private config(): void {
    this.app.use(cors());
    this.app.use(bodyParser.json());
    this.app.use(bodyParser.urlencoded({ extended: false }));
  }
private addServices(): void {
}
}

export default new App().app;
