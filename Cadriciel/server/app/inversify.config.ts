import { Container } from "inversify";
import Types from "./types";
import { Server } from "./server";
import { Application } from "./app";
import { TrackRoute } from "./racing/track-route";
import { TrackService } from "./racing/track-service";
import { LexiconService } from "./crossword/lexicon-service";
import { Lexicon } from "./crossword/lexicon";
import { GridService } from "./crossword/grid-service";
import { Grid } from "./crossword/gridCreate";

const container: Container = new Container();

container.bind(Types.Server).to(Server);
container.bind(Types.Application).to(Application);
container.bind(Types.TrackRoute).to(TrackRoute);
container.bind(Types.TrackService).to(TrackService);
container.bind(Types.LexiconService).to(LexiconService);
container.bind(Types.Lexicon).to(Lexicon);
container.bind(Types.Grid).to(Grid);
container.bind(Types.GridService).to(GridService);

export { container };
