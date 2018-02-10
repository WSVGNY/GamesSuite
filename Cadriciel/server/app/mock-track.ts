import { Track } from "../../common/racing/track";
import { ObjectId } from "bson";

export let tracks: Track[] = [
    new Track(new ObjectId(), "Forêt"),
    new Track(new ObjectId(), "Désert"),
    new Track(new ObjectId(), "Montagne"),
    new Track(new ObjectId(), "Montréal"),
    new Track(new ObjectId(), "Circuit")
];
