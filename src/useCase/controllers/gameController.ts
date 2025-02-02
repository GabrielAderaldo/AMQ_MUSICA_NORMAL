import { Players, Room } from "../../domain/entity/room";
import { Songs } from "../../domain/entity/songs";
import { Track } from "../../domain/entity/track";
import { DatabaseRepository } from "../../infra/database/databaseRepository";
import { MongoService } from "../../infra/database/mongodb/mongoService";
import { DeezerDto } from "../../infra/musicAPI/deezer/deezerDto";
import { IMusicRepository } from "../../infra/musicAPI/IMusicRepository";
import { MusicRepository } from "../../infra/musicAPI/musicRepository";
import { SpotifyDto } from "../../infra/musicAPI/spotify/spotifyDto";
import { MusicController } from "./musicController";

export class GameController {

    databaseRepository:DatabaseRepository = new DatabaseRepository(new MongoService());
    musicRepository:IMusicRepository = new MusicRepository(new SpotifyDto(),new DeezerDto());
    musicController = new MusicController();

    async createRoom(playlists_id:string[],owner_id:string,players:[{user_id:string,score:number}],round:number,max_round:number,accessToken:string): Promise<{"room_info":Room,"songs":Songs[]}> {
        try {
            const music_pool:{track:Track,whoIsTheTrack:string}[] = [];
            const songs:Songs[] = [];
            const playlists = playlists_id.map(async (playlist_id:string)=>{
                const track = await this.musicRepository.getPlaylistTrack(accessToken,playlist_id)
                return {track:track,playlist_id:playlist_id};
            });

            for(const playlist of playlists){
                const numberOfMusic = Math.round(max_round/playlists_id.length) + 3;
                const personTrack = ((await playlist).track).slice(0,numberOfMusic);
                const personTrackShuffle = personTrack.sort(() => Math.random() - 0.5);
                for( let x of personTrackShuffle){
                    music_pool.push({track:x,whoIsTheTrack:(await playlist).playlist_id});
                }
            }

            for(const track of music_pool){
                const objectSong = await this.musicController.getSongsPreviewByName(track.track.name,track.track.artist);
                if(!objectSong.song) {
                    const song = new Songs(track.track.id,track.track.name,track.track.artist,track.track.album,track.track.imageUrl,track.track.duration,"SONG NOT FOUND",track.whoIsTheTrack);
                    songs.push(song);
                }else{
                    const song = new Songs(track.track.id,track.track.name,track.track.artist,track.track.album,track.track.imageUrl,track.track.duration,objectSong.song.preview,track.whoIsTheTrack);
                    songs.push(song);
                }
            }
        
            const p:Players[] = [];
            
            players.forEach((player) => {
                p.push({user_id:`${player}`,score:0});
            })

            const room = new Room(playlists_id,owner_id,p,round,max_round);
            const createRoom = await this.databaseRepository.createRoom(room);

            return {"room_info":createRoom,"songs":songs};
            
        } catch (e) {
            throw e;
        }
    }

}