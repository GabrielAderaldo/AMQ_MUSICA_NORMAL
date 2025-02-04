import axios from "axios";
import { HttpHandlerBuilder, TYPE_OF_REQUEST } from "../../../utils/http/httpHandler";
import qs from 'qs';
import { CustomError, CustomErrorBuilder } from "../../../utils/error/customError";
require('dotenv').config();

export class SpotifyService {
    
    async getAccessToken(code:string): Promise<any>{
        try{
            if(!code) {
                const customError = new CustomErrorBuilder()
                .setHeaderError("MISSING_CODE")
                .setMessageError("Code is required")
                .setStatus(400)
                .build()
                throw customError
            }
            const url = "https://accounts.spotify.com/api/token";

            const data = qs.stringify({
              grant_type: "authorization_code",
              code: code,
              redirect_uri: `http://${process.env.DOMAIN}:${process.env.PORT}/callback`,
            });
          
            const headers = {
              "Content-Type": "application/x-www-form-urlencoded",
              Authorization: `Basic ${Buffer.from(`${process.env.CLIENT_ID}:${process.env.CLIENT_SECRET}`).toString("base64")}`,
            };
            const response = await axios.post(url, data, { headers });
            return response.data;
        }catch(e){
            console.log(e)
            throw e
        }
    }

    async getRefreshToken(refreshToken:string):Promise<any>{
        try{
            if(!refreshToken) {
                const customError = new CustomErrorBuilder()
                .setHeaderError("MISSING_REFRESH_TOKEN")
                .setMessageError("Refresh Token is required")
                .setStatus(400)
                .build()
                throw customError
            }
            
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

    async getPlaylist(accessToken:string): Promise<any>{
        try{
            if(!accessToken) {
                const customError = new CustomErrorBuilder()
                .setHeaderError("MISSING_ACCESS_TOKEN")
                .setMessageError("Access Token is required")
                .setStatus(400)
                .build()
                throw customError
            }
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

    async getPlaylistTrack(accessToken:string, playlistId:string): Promise<any>{
        try{
            if(!accessToken) {
                const customError = new CustomErrorBuilder()
                .setHeaderError("MISSING_ACCESS_TOKEN")
                .setMessageError("Access Token is required")
                .setStatus(400)
                .build()
                throw customError
            }
            if(!playlistId) {
                const customError = new CustomErrorBuilder()
                .setHeaderError("MISSING_PLAYLIST_ID")
                .setMessageError("Playlist Id is required")
                .setStatus(400)
                .build()
                throw customError
            }
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

    async getSongPreview(accessToken:string, trackId:string): Promise<any>{
        try{
            if(!accessToken) {
                const customError = new CustomErrorBuilder()
                .setHeaderError("MISSING_ACCESS_TOKEN")
                .setMessageError("Access Token is required")
                .setStatus(400)
                .build()
                throw customError
            }
            if(!trackId) {
                const customError = new CustomErrorBuilder()
                .setHeaderError("MISSING_TRACK_ID")
                .setMessageError("Track Id is required")
                .setStatus(400)
                .build()
                throw customError
            }
            
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