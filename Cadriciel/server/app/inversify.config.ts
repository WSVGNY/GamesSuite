import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { Index } from "./routes/index";
import { Routes } from "./routes";
import { TrackRoute } from "./racing/track-route";
import { TrackService } from "./racing/track-service";
import { LexiconService } from "./crossword/lexicon-service";
import { Lexicon } from "./crossword/lexicon";
import { GridCreateService } from "./crossword/gridCreate-service";
import { Grid } from "./crossword/gridCreate";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.Routes).to(Routes);
container.bind(Types.Index).to(Index);
container.bind(Types.TrackRoute).to(TrackRoute);
container.bind(Types.TrackService).to(TrackService);
container.bind(Types.LexiconService).to(LexiconService);
container.bind(Types.Lexicon).to(Lexicon);
container.bind(Types.Grid).to(Grid);
container.bind(Types.GridCreateService).to(GridCreateService);

export { container };
