import axios from "axios"

export class DeezerService{


    async getSongPreviewByName(trackName: string): Promise<any>{
        try{
            if(!trackName) throw new Error('Track Id is required')
            const response = await axios.get(`https://api.deezer.com/search?q=${encodeURIComponent(trackName)}&order=RANKING`)
            return response.data
        }catch(e){
            throw e
        }
    }

}