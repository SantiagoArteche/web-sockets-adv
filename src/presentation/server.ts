import express, { Router } from "express";
import path from "path";
import "dotenv/config";

export class Server {
  public readonly app = express();
  private serverListener?: any;
  private readonly PORT: number = +process.env.PORT!;

  constructor() {
    this.configure();
  }

  private configure() {
    this.app.use(express.json());
    this.app.use(express.urlencoded({ extended: true }));
    this.app.use(express.static("public"));

    this.app.get(/^\/(?!api).*/, (req, res) => {
      const indexPath = path.join(__dirname + `../../../public/index.html`);

      res.send(indexPath);
    });
  }

  public setRoutes(router: Router) {
    this.app.use(router);
  }

  public start() {
    this.serverListener = this.app.listen(this.PORT, () => {
      console.log(`Server running on PORT ${this.PORT}`);
    });
  }

  public close() {
    this.serverListener?.close();
  }
}
