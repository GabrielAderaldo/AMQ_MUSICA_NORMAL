import { AxiosError } from "axios";
import { randomUUID } from "crypto";

export class CustomError {

    public id_error: string;
    public headerError?: string;
    public status?: number;
    public messageError?: string;
    public pathRequest?: string;

    constructor() {
        this.id_error = randomUUID();
    }

    static builder(){
        return new CustomErrorBuilder();
    }

    buildAxiosError(axiosError: AxiosError,headerError: string){
        this.headerError = headerError;
        this.status = axiosError.response?.status || 500;
        this.messageError = axiosError.message;
        this.pathRequest = axiosError.config?.url || 'NO PATH';
        return this;
    }

    toJson(){
        return {
            id_error: this.id_error,
            headerError: this.headerError,
            status: this.status,
            messageError: this.messageError,
            pathRequest: this.pathRequest
        }
    }

}

export class CustomErrorBuilder{

    private error: CustomError;

    constructor(){
        this.error = new CustomError();
    }

    public setHeaderError(headerError: string){
        this.error.headerError = headerError;
        return this;
    }

    public setStatus(status: number){
        this.error.status = status;
        return this;
    }

    public setMessageError(messageError: string){
        this.error.messageError = messageError;
        return this;
    }

    public setPathRequest(pathRequest: string){
        this.error.pathRequest = pathRequest;
        return this;
    }

    public build(){
        return this.error;
    }

}

