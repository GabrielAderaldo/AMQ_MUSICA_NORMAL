import { Playlist } from "../../../domain/entity/playlist";
import { Songs } from "../../../domain/entity/songs";
import { Track } from "../../../domain/entity/track";
import { IMusicRepository } from "../IMusicRepository";
import { DeezerService } from "./deezerService";

export class DeezerDto implements IMusicRepository{

    deezerService = new DeezerService();

    async getSongsPreviewByName(trackName: string, trackArtist: string): Promise<Songs[]> {
        try{
            if(!trackName) throw new Error('Access Token is required')
            if(!trackArtist) throw new Error('Track Id is required')
            const data = await this.deezerService.getSongPreviewByName(trackName)
            const tracks = data.data
            const limitedTracks = tracks.slice(0,100)
            const tracksCorrectFormat:Songs[] = limitedTracks.map((track:any) => {
                return new Songs(track.id,track.title,track.artist.name,track.album.title,"",track.duration,track.preview)    
            })

            return tracksCorrectFormat
        }catch(err){
            throw err
        }
    }
    getSongPreviewById(accessToken: string, trackId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getAllPlaylists(accessToken: string): Promise<Playlist[]> {
        throw new Error("Method not implemented.");
    }
    getPlaylistTrack(accessToken: string, playlistId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }

}