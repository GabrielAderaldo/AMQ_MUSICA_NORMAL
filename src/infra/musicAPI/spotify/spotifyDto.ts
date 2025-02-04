import { Playlist } from "../../../domain/entity/playlist";
import { Track } from "../../../domain/entity/track";
import { IMusicRepository } from "../IMusicRepository";
import { SpotifyService } from "./spotifyService";

export class SpotifyDto implements IMusicRepository{
    getSongsPreviewByName(accessToken: string, trackId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    getSongPreviewById(accessToken: string, trackId: string): Promise<any> {
        throw new Error("Method not implemented.");
    }
    
    spotifyService = new SpotifyService();

    async getAllPlaylists(accessToken: string): Promise<Playlist[]> {
        try{
            const playlistResponse = await this.spotifyService.getPlaylist(accessToken);
            const playlistsPartOne:Playlist[] = playlistResponse.map((playlistItem:any) => {
                let imageUrl = ""
                playlistItem.images != null ? imageUrl = playlistItem.images[0].url : imageUrl = "IMAGE NOT FOUND"
                return new Playlist(playlistItem.id, playlistItem.name, playlistItem.description, imageUrl, [])
            })

            for(let i = 0; i < playlistsPartOne.length; i++){
                const playlistTracks = await this.spotifyService.getPlaylistTrack(accessToken, playlistsPartOne[i].id)
                
                const tracks = playlistTracks.map((track:any) => {
                    return track.track
                })
                
                const tracksArray = tracks.map((track:any) => {
                    const id = track.id == null || track.id == "" ? "ID NOT FOUND" : track.id
                    const imageMusic = track.album.images[0] == null ? "IMAGE NOT FOUND" : track.album.images[0].url
                    const name = track.name == null || track.name == "" ? "NAME NOT FOUND" : track.name
                    const artist = track.artists[0].name == null || track.artists[0].name == "" ? "ARTIST NOT FOUND" : track.artists[0].name
                    const albumName = track.album.name == null || track.album.name == "" ? "ALBUM NOT FOUND" : track.album.name
                    const duration = track.duration_ms == null || track.duration_ms == 0 ? 0 : track.duration_ms
                    return {id, imageMusic, name, artist, albumName, duration}
                })

                const tracksInCorrectFormat:Track[] = tracksArray.map((track:any) => new Track(track.id,track.name,track.artist,track.albumName,track.imageMusic,track.duration))
                
                for(let trackInCorrecFormat of tracksInCorrectFormat){
                    playlistsPartOne[i].tracks.push(trackInCorrecFormat)
                }
            }

            return playlistsPartOne
        }catch(e){
            throw e
        }
    }
    async getPlaylistTrack(accessToken: string, playlistId: string): Promise<Track[]> {
        try{
                        
            const playlistTracks = await this.spotifyService.getPlaylistTrack(accessToken, playlistId)

                const tracks = playlistTracks.map((track:any) => {
                    return track.track
                })
                
                const tracksArray = tracks.map((track:any) => {
                    const id = track.id == null || track.id == "" ? "ID NOT FOUND" : track.id
                    const imageMusic = track.album.images[0] == null ? "IMAGE NOT FOUND" : track.album.images[0].url
                    const name = track.name == null || track.name == "" ? "NAME NOT FOUND" : track.name
                    const artist = track.artists[0].name == null || track.artists[0].name == "" ? "ARTIST NOT FOUND" : track.artists[0].name
                    const albumName = track.album.name == null || track.album.name == "" ? "ALBUM NOT FOUND" : track.album.name
                    const duration = track.duration_ms == null || track.duration_ms == 0 ? 0 : track.duration_ms
                    return {id, imageMusic, name, artist, albumName, duration}
                })

                const tracksInCorrectFormat:Track[] = tracksArray.map((track:any) => new Track(track.id,track.name,track.artist,track.albumName,track.imageMusic,track.duration))
                
                return tracksInCorrectFormat

        }catch(e){
            throw e
        }
    }
    
}