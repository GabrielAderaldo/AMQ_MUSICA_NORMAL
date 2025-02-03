import { AxiosResponse } from "axios";
import { HttpHandlerBuilder, TYPE_OF_REQUEST } from "../../../utils/http/httpHandler";
require('dotenv').config();

export class SpotifyService {
    
    async getAccessToken(code:string): Promise<AxiosResponse>{
        try{
            if(!code) throw new Error('Code is required')

            const body = new Map([['grant_type', 'authorization_code'],['code', code],['redirect_uri', `http://${process.env.DOMAIN}:${process.env.PORT}/callback`]])
            const header = new Map([['Content-Type', 'application/x-www-form-urlencoded'],['Authorization', 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')]])
            const objectUrl = new HttpHandlerBuilder()
                .setTypeOfRequest(TYPE_OF_REQUEST.POST)
                .setBaseUrl('https://accounts.spotify.com')
                .setPath(['api', 'token'])
                .setBody(body)
                .setHeader(header)
                .build()

            return await objectUrl.axiosBuilder();

        }catch(e){
            throw e
        }
    }

    async getRefreshToken(refreshToken:string): Promise<AxiosResponse>{
        try{
            if(!refreshToken) throw new Error('Refresh Token is required')
            
            const body = new Map([['grant_type', 'refresh_token'],['refresh_token', refreshToken]])
            const header = new Map([['Content-Type', 'application/x-www-form-urlencoded'],['Authorization', 'Basic ' + Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString('base64')]])
            const objectUrl = new HttpHandlerBuilder()
                .setTypeOfRequest(TYPE_OF_REQUEST.POST)
                .setBaseUrl('https://accounts.spotify.com')
                .setPath(['api', 'token'])
                .setQuery(body)
                .setHeader(header)
                .build()
            
            const response = await objectUrl.axiosBuilder();

            return response.data;

        }catch(e){
            throw e
        }
    }

    async getPlaylist(accessToken:string): Promise<AxiosResponse>{
        try{
            if(!accessToken) throw new Error('Access Token is required')
            const header = new Map([['Authorization', `Bearer ${accessToken}`]])
            const objectUrl = new HttpHandlerBuilder()
                .setTypeOfRequest(TYPE_OF_REQUEST.GET)
                .setBaseUrl('https://api.spotify.com')
                .setPath(['v1', 'me', 'playlists'])
                .setHeader(header)
                .build()
            const response = await objectUrl.axiosBuilder();
            return response.data.items;

        }catch(e){
            throw e
        }
    }

    async getPlaylistTrack(accessToken:string, playlistId:string): Promise<AxiosResponse>{
        try{
            if(!accessToken) throw new Error('Access Token is required')
            if(!playlistId) throw new Error('Playlist Id is required')
            const header = new Map([['Authorization', `Bearer ${accessToken}`]])
            const objectUrl = new HttpHandlerBuilder()
                .setTypeOfRequest(TYPE_OF_REQUEST.GET)
                .setBaseUrl('https://api.spotify.com')
                .setPath(['v1', 'playlists',playlistId,"tracks"])
                .setQuery(new Map([['limit', '100'], ['offset', '0']]))
                .setHeader(header)
                .build()

            const response = await objectUrl.axiosBuilder();
            return response.data.items;

        }catch(e){
            throw e
        }
    }

    async getSongPreview(accessToken:string, trackId:string): Promise<AxiosResponse>{
        try{
            if(!accessToken) throw new Error('Access Token is required')
            if(!trackId) throw new Error('Track Id is required')
            
            const header = new Map([['Authorization', `Bearer ${accessToken}`]])
            const objectUrl = new HttpHandlerBuilder()
                .setTypeOfRequest(TYPE_OF_REQUEST.GET)
                .setBaseUrl('https://api.spotify.com')
                .setPath(['v1', 'tracks', trackId])
                .setHeader(header)
                .build()
            
            const response = await objectUrl.axiosBuilder();
            return response.data.preview_url;

        }catch(e){
            throw e
        }
    }
}
