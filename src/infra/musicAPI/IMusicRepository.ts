import { Playlist } from "../../domain/entity/playlist";
import { Songs } from "../../domain/entity/songs";
import { Track } from "../../domain/entity/track";

export interface IMusicRepository {
    getAllPlaylists(accessToken: string): Promise<Playlist[]>
    getPlaylistTrack(accessToken: string, playlistId: string): Promise<any>
    getSongsPreviewByName(trackName: string, trackArtist: string): Promise<Songs[]>
    getSongPreviewById(accessToken: string, trackId: string): Promise<any>
}