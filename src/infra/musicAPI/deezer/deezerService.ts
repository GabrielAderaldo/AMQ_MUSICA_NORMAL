import { Axios, AxiosError, AxiosResponse } from "axios"
import { HttpHandlerBuilder, TYPE_OF_REQUEST } from "../../../utils/http/httpHandler"
import { CustomErrorBuilder } from "../../../utils/error/customError"
import { error } from "console"

export class DeezerService{

    async getSongPreviewByName(trackName: string): Promise<AxiosResponse>{
        try{
            if(!trackName) {
                throw new CustomErrorBuilder()
                .setHeaderError('TRACK_NAME_IS_EMPTY')
                .setMessageError('Name of the track is empty, please provide the name of track, or verify if the name is in your request')
                .setPathRequest('https://api.deezer.com/search')
                .setStatus(400)
                .build()
            }
            const objectUrl = new HttpHandlerBuilder()
            .setTypeOfRequest(TYPE_OF_REQUEST.GET)
            .setBaseUrl('https://api.deezer.com')
            .setPath(['search'])
            .setQuery(new Map([['q', trackName], ['order', 'RANKING']]))
            .build()
            const response = await objectUrl.axiosBuilder()
            return response.data
        }catch(e){
            if(e instanceof AxiosError){
            const axiosError = e as AxiosError
            const error = new CustomErrorBuilder()
            .setHeaderError('ERROR CAPTURE IN DEEZER SERVICE')
            .build()

            throw error.buildAxiosError(axiosError,'ERROR CAPTURE IN DEEZER SERVICE')
            
            }else{
                throw e
            }           
        }
    }

}