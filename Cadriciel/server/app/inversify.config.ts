import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";
import { Grid } from "./crossword/gridCreate_service";
import { RoutePiste } from "./routes/route-piste";
import { Lexique } from "./crossword/lexique";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Index).to(Index);
container.bind(Types.Grid).to(Grid);
container.bind(Types.RoutePiste).to(RoutePiste);
container.bind(Types.Lexique).to(Lexique);

export { container };
