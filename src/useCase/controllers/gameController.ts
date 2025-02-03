import { Players, Room } from "../../domain/entity/room";
import { Songs } from "../../domain/entity/songs";
import { Track } from "../../domain/entity/track";
import { CacheDatabaseClient } from "../../infra/cacheDatabase/cacheDatabaseClient";
import { RedisService } from "../../infra/cacheDatabase/redis/redisService";
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
    cacheDatabaseRepository:CacheDatabaseClient = new CacheDatabaseClient(new RedisService());


    async deleteAllRooms(): Promise<void> {
        try {
            await this.cacheDatabaseRepository.deleteAllRooms();
        } catch (e) {
            throw e;
        }
    }

    async getAllRoomsId(): Promise<string[]> {
        try {
            return await this.cacheDatabaseRepository.getAllRoomsId();
        } catch (e) {
            throw e;
        }
    }

    async getRoomStatus(room_id:string): Promise<any> {
        try {
            const room = await this.cacheDatabaseRepository.getRoomState(room_id);
            console.log(room.actual_music_playing)
            return room;
        } catch (e) {
            throw e;
        }
    }

    async startRound(room_id:string): Promise<any> {
        try{
            const room = await this.cacheDatabaseRepository.getRoomState(room_id);
            const room_info = JSON.parse(room.room_info);
            const players_info = JSON.parse(room.players_info);
            const pool_music = JSON.parse(room.pool_music);
            const actual_music_playing = JSON.parse(room.actual_music_playing);
            const round = parseInt(room.round);
            const max_round = parseInt(room.max_round);
            const time_stamp = parseInt(room.time_stamp);
            const name_of_music = room.name_of_music;

            if(room_info.room_state === "END_GAME"){
                return "END GAME";
            }

            // Se o jogo atingiu o número máximo de rodadas, não continua
            if (round >= max_round) {
                room_info.room_state = "END_GAME"; // Marca o estado como finalizado
                await this.cacheDatabaseRepository.updateRoomState(room_id, {
                    "room_info": JSON.stringify(room_info),
                });
                console.log("Fim do jogo. Nenhuma nova rodada será iniciada.");
                return "END GAME";
            }
            
            // Atualiza o estado da sala
            room_info.room_state = "STARTED";
            room_info.time_stamp = new Date().getTime();
            room_info.actual_music_playing = pool_music.sort(() => Math.random() - 0.5)[0];
            pool_music.splice(pool_music.indexOf(room_info.actual_music_playing), 1);
            room_info.round += 1; // Incrementa o round apenas se o jogo ainda não acabou
            
            console.log(`Rodada Atual Antes do Incremento: ${round}`);
            console.log(`Rodada Atual Após Incremento: ${room_info.round}`);
            
            // Atualiza o estado da sala no Redis
            await this.cacheDatabaseRepository.updateRoomState(room_id, {
                "room_info": JSON.stringify(room_info),
                "pool_music": JSON.stringify(pool_music),
            });
            
        }catch(e){
            throw e;
        }
    }

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

            const actual_music_playing = songs.sort(() => Math.random() - 0.5)[0];

            const room = new Room(playlists_id,owner_id,p,round,max_round)
            
            const room_info = {
                "room_id":room.private_id,
                "room_state":room.status,
                "actual_music_playing":actual_music_playing,
                "time_stamp":new Date().getTime(),
            }

            const players_info = p.map((player)=>{
                return {
                    "user_id":player.user_id,
                    "score":player.score,
                    "room_status_player":"CONNECTED",
                    "room_ready_status_player":"NOT_READY",
                    "socket_id":""
                }
            })

            const pool_music_cache = songs

            const name_of_music = actual_music_playing.name

            const createRoom = await this.databaseRepository.createRoom(room) as any;
            
            await this.cacheDatabaseRepository.initializeRoomState(createRoom._id,{
                "room_info":JSON.stringify(room_info),
                "players_info":JSON.stringify(players_info),
                "pool_music":JSON.stringify(pool_music_cache),
                "name_of_music":name_of_music,
                "round":round.toString(),
                "max_round":max_round.toString(),
                "actual_music_playing":JSON.stringify(actual_music_playing),
                "time_stamp":new Date().getTime().toString(),
            })

            

            return {"room_info":createRoom,"songs":songs};
            
        } catch (e) {
            throw e;
        }
    }

}