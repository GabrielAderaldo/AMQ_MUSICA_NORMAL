import { Players, Room } from "../../domain/entity/room";
import { Track } from "../../domain/entity/track";
import { DatabaseRepository } from "../../infra/database/databaseRepository";
import { MongoService } from "../../infra/database/mongodb/mongoService";
import { DeezerDto } from "../../infra/musicAPI/deezer/deezerDto";
import { IMusicRepository } from "../../infra/musicAPI/IMusicRepository";
import { MusicRepository } from "../../infra/musicAPI/musicRepository";
import { SpotifyDto } from "../../infra/musicAPI/spotify/spotifyDto";

export class GameController {

    databaseRepository:DatabaseRepository = new DatabaseRepository(new MongoService());
    musicRepository:IMusicRepository = new MusicRepository(new SpotifyDto(),new DeezerDto());

    async createRoom(playlists_id:string[],owner_id:string,players:[{user_id:string,score:number}],round:number,max_round:number,accessToken:string): Promise<Room> {
        try {
            const music_pool:Track[] = [];
            const playlists = playlists_id.map(async (playlist_id:string) => await this.musicRepository.getPlaylistTrack(accessToken,playlist_id));
            for(const playlist of playlists){
                const numberOfMusic = Math.round(max_round/playlists_id.length);
                const personTrack = (await playlist).slice(0,numberOfMusic);
                const personTrackShuffle = personTrack.sort(() => Math.random() - 0.5);
                personTrackShuffle.forEach((track:Track) => {
                    music_pool.push(track);
                })
            }

            const p:Players[] = [];
            players.forEach((player) => {
                p.push({user_id:`${player}`,score:0});
            })
            const room = new Room(playlists_id,owner_id,p,music_pool,round,max_round);
            const createRoom = await this.databaseRepository.createRoom(room);

            return createRoom;
        } catch (e) {
            throw e;
        }
    }

}