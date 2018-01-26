import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";
import { EmptyGrid } from "./crossword/emptyGridCreate_service";
import { TrackRoute } from "./routes/track-route";
import { Lexicon } from "./crossword/lexicon";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Index).to(Index);
container.bind(Types.EmptyGrid).to(EmptyGrid);
container.bind(Types.TrackRoute).to(TrackRoute);
container.bind(Types.Lexicon).to(Lexicon);

export { container };
