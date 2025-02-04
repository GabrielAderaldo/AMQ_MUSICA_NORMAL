import { Playlist } from "../../domain/entity/playlist";
import { Songs } from "../../domain/entity/songs";
import { cleanSongName } from "../../utils/cleanSongName";
import { IMusicRepository } from "./IMusicRepository";

export class MusicRepository implements IMusicRepository {

    musicInformamtion: IMusicRepository
    musicReproduction: IMusicRepository

    constructor(musicInformamtion: IMusicRepository, musicReproduction: IMusicRepository) {
        this.musicInformamtion = musicInformamtion,
            this.musicReproduction = musicReproduction
    }

    async getSongsPreviewByName(trackName: string, trackArtist: string): Promise<Songs[]> {
        try {      
            const safaTrack = cleanSongName(trackName)
            const songs = await this.musicReproduction.getSongsPreviewByName(safaTrack, trackArtist)
            return songs
        } catch (err) {
            throw err
        }
    }
    getSongPreviewById(accessToken: string, trackId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

    async getAllPlaylists(accessToken: string): Promise<Playlist[]> {
        try {
            return await this.musicInformamtion.getAllPlaylists(accessToken)
        } catch (e) {
            throw e
        }
    }


    async getPlaylistTrack(accessToken: string, playlistId: string): Promise<any> {
        try {
            return await this.musicInformamtion.getPlaylistTrack(accessToken, playlistId)
        } catch (e) {
            throw e
        }
    }

}