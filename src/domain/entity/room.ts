import { randomUUID, UUID } from "node:crypto";
import { Track } from "./track";

enum ROOM_STATUS{
    WAITING = "WAITING",
    PLAYING = "PLAYING",
    FINISHED = "FINISHED"
}

export interface Players{
    user_id: string,
    score: number,
}


export class Room{
    private_id: string;
    playlists_id: string[];
    status: ROOM_STATUS;
    owner_id: string;
    players: Players[];
    round: number;
    max_round: number;

    constructor(playlists_id: string[],owner_id: string, players: Players[], round: number, max_round: number){
        this.private_id = randomUUID();
        this.playlists_id = playlists_id;
        this.status = ROOM_STATUS.WAITING;
        this.owner_id = owner_id;
        this.players = players;
        this.round = round;
        this.max_round = max_round;
    }
}