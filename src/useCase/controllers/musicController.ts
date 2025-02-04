import { Songs } from "../../domain/entity/songs";
import { Track } from "../../domain/entity/track";
import { DeezerDto } from "../../infra/musicAPI/deezer/deezerDto";
import { MusicRepository } from "../../infra/musicAPI/musicRepository";
import { SpotifyDto } from "../../infra/musicAPI/spotify/spotifyDto";
import { CustomErrorBuilder } from "../../utils/error/customError";

export class MusicController{

    musicRepository: MusicRepository = new MusicRepository(new SpotifyDto(),new DeezerDto())

    async getPlaylists(accessToken: string){
        try{
            return await this.musicRepository.getAllPlaylists(accessToken)
        }catch(e){
            throw e
        }
    }

    async getPlaylistTracks(accessToken: string, playlistId: string){
        try{
            return await this.musicRepository.getPlaylistTrack(accessToken, playlistId)
        }catch(e){
            throw e
        }
    }

    async getSongsPreviewByName(trackName: string, trackArtist: string): Promise<{
        "song":Songs | undefined,
        "error": string | undefined
    }>{
        try{
            
            const tracks = await this.musicRepository.getSongsPreviewByName(trackName, trackArtist)
            
            if(tracks.length === 0) return {"song":undefined,"error":"SONG NOT FOUND"}
            
            const betterTracks = tracks.filter((track: Track) => 
                track.name.toLowerCase().includes(trackName.toLowerCase()) &&
                track.artist.toLowerCase().includes(trackArtist.toLowerCase())
            )

            if(betterTracks.length === 0) return {"song":undefined,"error":"SONG NOT FOUND"}
            
            return {"song":betterTracks.shift(),"error":undefined}
            
        }catch(err){
            throw err
        }
    }

    

}