import { Playlist } from "../../domain/entity/playlist";
import { Songs } from "../../domain/entity/songs";
import { Track } from "../../domain/entity/track";
import { IMusicRepository } from "./IMusicRepository";

export class MusicRepository implements IMusicRepository{
    
    musicInformamtion: IMusicRepository
    musicReproduction: IMusicRepository
    
    constructor(musicInformamtion: IMusicRepository,musicReproduction: IMusicRepository){
        this.musicInformamtion = musicInformamtion,
        this.musicReproduction = musicReproduction
    }
    
    async getSongsPreviewByName(trackName: string, trackArtist: string): Promise<Songs[]> {
        try{
            if(!trackName) throw new Error('Access Token is required')
            if(!trackArtist) throw new Error('Track Id is required')

            const songs = await this.musicReproduction.getSongsPreviewByName(trackName, trackArtist)
            return songs
        }catch(err){
            throw err
        }
    }
    getSongPreviewById(accessToken: string, trackId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    getAllPlaylists(accessToken: string): Promise<Playlist[]> {
        try{
            if(!accessToken) throw new Error("Access token is required")
            return this.musicInformamtion.getAllPlaylists(accessToken)
        }catch(e){
            throw e
        }
    }


    getPlaylistTrack(accessToken: string, playlistId: string): Promise<any> {
        try{
            if(!accessToken) throw new Error('Access Token is required')
            if(!playlistId) throw new Error('Playlist Id is required')
            return this.musicInformamtion.getPlaylistTrack(accessToken, playlistId)
        }catch(e){
            throw e
        }
    }



   
    
}