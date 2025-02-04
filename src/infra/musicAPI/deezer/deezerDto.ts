import { Playlist } from "../../../domain/entity/playlist";
import { Songs } from "../../../domain/entity/songs";
import { cleanSongName } from "../../../utils/cleanSongName";
import { CustomErrorBuilder } from "../../../utils/error/customError";
import { IMusicRepository } from "../IMusicRepository";
import { DeezerService } from "./deezerService";

export class DeezerDto implements IMusicRepository {

    deezerService = new DeezerService();

    async getSongsPreviewByName(trackName: string, trackArtist: string): Promise<Songs[]> {
        try {
            if (!trackArtist) {
                throw new CustomErrorBuilder()
                    .setHeaderError('TRACK_ARTIST_IS_EMPTY')
                    .setMessageError('Name of the ARTIST is empty, please provide the name of ARTIST, or verify if the name is in your request')
                    .setPathRequest('https://api.deezer.com/search')
                    .setStatus(400)
                    .build()
            }

            const data = await this.deezerService.getSongPreviewByName(trackName)
            const tracks = data.data
            const limitedTracks = tracks.slice(0, 100)
            const tracksCorrectFormat: Songs[] = limitedTracks.map((track: any) => {
                return new Songs(track.id, track.title, track.artist.name, track.album.title, "", track.duration, track.preview, "")
            })
            return tracksCorrectFormat
        } catch (err) {
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