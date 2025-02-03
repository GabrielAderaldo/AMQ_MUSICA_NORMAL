import axios from "axios"
import { HttpHandlerBuilder, TYPE_OF_REQUEST } from "../../../utils/http/httpHandler"

export class DeezerService{

    async getSongPreviewByName(trackName: string): Promise<any>{
        try{
            if(!trackName) throw new Error('Track Id is required')
            const objectUrl = new HttpHandlerBuilder()
            .setTypeOfRequest(TYPE_OF_REQUEST.GET)
            .setBaseUrl('https://api.deezer.com')
            .setPath(['search'])
            .setQuery(new Map([['q', trackName], ['order', 'RANKING']]))
            .build()
            const response = await objectUrl.axiosBuilder()
            return response.data
        }catch(e){
            throw e
        }
    }

}