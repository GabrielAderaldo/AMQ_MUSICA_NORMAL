import axios from "axios"
import qs from 'qs'
require('dotenv').config();


export class SpotifyService {
    
    async getAccessToken(code:string){
        try{
            if(!code) throw new Error('Code is required')

                const body = qs.stringify({
                    grant_type: 'authorization_code',
                    code: code,
                    redirect_uri: `http://${process.env.DOMAIN}:${process.env.PORT}/callback`,
                })

                const header = {
                    'Content-Type': 'application/x-www-form-urlencoded',
                    'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64'),
                }
            
                const response = await axios.post('https://accounts.spotify.com/api/token',body,{ headers: header })

                return response.data;

        }catch(e){
            throw e
        }
    }

    async getRefreshToken(refreshToken:string){
        try{
            if(!refreshToken) throw new Error('Refresh Token is required')
            
            const body = qs.stringify({
                grant_type: 'refresh_token',
                refresh_token: refreshToken,
            })

            const header =  {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')
            }

            const response = await axios.post('https://accounts.spotify.com/api/token',body,{ headers: header })

            return response.data;

        }catch(e){
            throw e
        }
    }

    async getPlaylist(accessToken:string){
        try{
            if(!accessToken) throw new Error('Access Token is required')
            const header = { Authorization: `Bearer ${accessToken}` }

            const response = await axios.get('https://api.spotify.com/v1/me/playlists',{ headers: header })
            return response.data.items

        }catch(e){
            throw e
        }
    }


    async getPlaylistTrack(accessToken:string, playlistId:string){
        try{
            if(!accessToken) throw new Error('Access Token is required')
            if(!playlistId) throw new Error('Playlist Id is required')
            const header = { Authorization: `Bearer ${accessToken}` }

            const response = await axios.get(`https://api.spotify.com/v1/playlists/${playlistId}/tracks?limit=100&offset=0`,{ headers: header })
            return response.data.items

        }catch(e){
            throw e
        }
    }


    async getSongPreview(accessToken:string, trackId:string){
        try{
            if(!accessToken) throw new Error('Access Token is required')
            if(!trackId) throw new Error('Track Id is required')
            const header = { Authorization: `Bearer ${accessToken}` }

            const response = await axios.get(`https://api.spotify.com/v1/tracks/${trackId}`,{ headers: header })
            return response.data.preview_url

        }catch(e){
            throw e
        }
    }

}