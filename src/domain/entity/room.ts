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
    playlists_id: string[];
    status: ROOM_STATUS;
    owner_id: string;
    players: Players[];
    music_pool: Track[];
    round: number;
    max_round: number;

    constructor(playlists_id: string[],owner_id: string, players: Players[], music_pool: Track[], round: number, max_round: number){
        this.playlists_id = playlists_id;
        this.status = ROOM_STATUS.WAITING;
        this.owner_id = owner_id;
        this.players = players;
        this.music_pool = music_pool;
        this.round = round;
        this.max_round = max_round;
    }
}