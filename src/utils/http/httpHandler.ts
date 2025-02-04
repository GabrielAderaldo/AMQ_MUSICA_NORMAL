import axios, { Axios, AxiosError, AxiosResponse } from "axios"
import qs from "qs"
import { CustomErrorBuilder } from "../error/customError"

export enum TYPE_OF_REQUEST {
    GET = "GET",
    POST = "POST",
    PUT = "PUT",
    DELETE = "DELETE",
    PATCH = "PATCH",
}

class HttpHandler {
    typeOfRequest?: TYPE_OF_REQUEST
    body?: Map<string, string>
    header?: Map<string, string>
    baseUrl?: string
    path?: string[]
    query?: Map<string, string>

    constructor() { }

    static builder() {
        return new HttpHandlerBuilder()
    }

    private getPaths() {
        if (!this.path) return ""

        let path = ""
        for (let i = 0; i < this.path.length; i++) {
            path += this.path[i]
            if (i < this.path.length - 1) path += "/"
        }
        return path
    }

    private getQuery() {
        if (!this.query) return ""

        let query = "?"
        let i = 0
        for (const [key, value] of this.query) {
            query += `${key}=${value}`
            if (i < this.query.size - 1) query += "&"
            i++
        }
        return query
    }

    private getHeader(): Record<string, any> {
        if (!this.header) return {};

        const newObject: Record<string, any> = {};

        for (const [key, value] of this.header.entries()) { // Para Map
            newObject[key] = value;
        }

        return newObject;
    }

    async axiosBuilder(): Promise<AxiosResponse> {
        try {
            if (!this.typeOfRequest) {
                const customError = new CustomErrorBuilder()
                    .setHeaderError("MISSING_TYPE_OF_REQUEST")
                    .setMessageError("Type of Request is required")
                    .setStatus(400)
                    .build()

                throw customError
            }

            switch (this.typeOfRequest) {
                case TYPE_OF_REQUEST.GET:
                    return await axios.get(`${this.baseUrl}/${this.getPaths()}${this.getQuery()}`, {
                        baseURL: this.baseUrl,
                        headers: this.getHeader()
                    })
                case TYPE_OF_REQUEST.POST:
                    return await axios.post(`${this.baseUrl}/${this.getPaths()}${this.getQuery()}`, qs.stringify(this.body), {
                        baseURL: this.baseUrl,
                        headers: this.getHeader()
                    })
                case TYPE_OF_REQUEST.PUT:
                    return await axios.post(`${this.baseUrl}/${this.getPaths()}${this.getQuery()}`, qs.stringify(this.body), {
                        baseURL: this.baseUrl,
                        headers: this.getHeader()
                    })
                case TYPE_OF_REQUEST.DELETE:
                    return await axios.delete(`${this.baseUrl}/${this.getPaths()}${this.getQuery()}`, {
                        baseURL: this.baseUrl,
                        headers: this.getHeader()
                    })
                case TYPE_OF_REQUEST.PATCH:
                    return await axios.patch(`${this.baseUrl}/${this.getPaths()}${this.getQuery()}`, qs.stringify(this.body), {
                        baseURL: this.baseUrl,
                        headers: this.getHeader()
                    })
            }
        } catch (err) {
            if(err instanceof AxiosError){
                const customError = new CustomErrorBuilder()
                .setHeaderError("FAILED_REQUEST_INTERNAL_TO_API")
                .setMessageError(err.response?.data)
                .setStatus(500)
                .build()
    
                throw customError
            }else{
                throw err
            }
        }
    }


}


export class HttpHandlerBuilder {

    private httpHandler: HttpHandler

    constructor() {
        this.httpHandler = new HttpHandler()
    }

    setTypeOfRequest(TYPE_OF_REQUEST: TYPE_OF_REQUEST) {
        this.httpHandler.typeOfRequest = TYPE_OF_REQUEST
        return this
    }

    setBody(body: Map<string, string>) {
        this.httpHandler.body = body
        return this
    }

    setHeader(header: Map<string, string>) {
        this.httpHandler.header = header
        return this
    }

    setBaseUrl(baseUrl: string) {
        this.httpHandler.baseUrl = baseUrl
        return this
    }

    setPath(path: string[]) {
        this.httpHandler.path = path
        return this
    }

    setQuery(query: Map<string, string>) {
        this.httpHandler.query = query
        return this
    }

    build() {
        return this.httpHandler
    }

}