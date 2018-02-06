import { Track } from "../../common/racing/track";

// TsLint is disabled because this is a mock of a database and the ids will not be hard-coded in the DB
export let tracks: Track[] = [
    new Track(1, "Forêt"),
    // tslint:disable-next-line:no-magic-numbers
    new Track(2, "Désert"),
    // tslint:disable-next-line:no-magic-numbers
    new Track(3, "Montagne"),
    // tslint:disable-next-line:no-magic-numbers
    new Track(4, "Montréal"),
    // tslint:disable-next-line:no-magic-numbers
    new Track(5, "Circuit")
];
