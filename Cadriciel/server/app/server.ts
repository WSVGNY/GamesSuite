import { Application } from "./app";
import * as http from "http";
import Types from "./types";
import { injectable, inject } from "inversify";
import * as sio from "socket.io";

const PIPE: string = "Pipe ";
const PORT: string = "Port ";

@injectable()
export class Server {

    private readonly appPort: string | number | boolean = this.normalizePort(process.env.PORT || "3000");
    private readonly baseDix: number = 10;
    private server: http.Server;
    private io: SocketIO.Server;

    constructor( @inject(Types.Application) private application: Application) { }

    public initServer(): void {
        this.application.app.set("port", this.appPort);

        this.server = http.createServer(this.application.app);

        this.initSocket();
        this.server.listen(this.appPort);
        this.server.on("error", (error: NodeJS.ErrnoException) => this.onError(error));
    }

    private initSocket(): void {
        this.io = sio(this.server);
        this.io.on("connection", (socket: SocketIO.Socket) => {
            console.log("user connected"); // TODO: change processing
        });
    }

    private normalizePort(val: number | string): number | string | boolean {
        const port: number = (typeof val === "string") ? parseInt(val, this.baseDix) : val;
        if (isNaN(port)) {
            return val;
        } else if (port >= 0) {
            return port;
        } else {
            return false;
        }
    }

    private onError(error: NodeJS.ErrnoException): void {
        if (error.syscall !== "listen") { throw error; }
        const bind: string = (typeof this.appPort === "string") ? PIPE + this.appPort : PORT + this.appPort;
        switch (error.code) {
            case "EACCES":
                console.error(`${bind} requires elevated privileges`);
                process.exit(1);
                break;
            case "EADDRINUSE":
                console.error(`${bind} is already in use`);
                process.exit(1);
                break;
            default:
                throw error;
        }
    }
}
