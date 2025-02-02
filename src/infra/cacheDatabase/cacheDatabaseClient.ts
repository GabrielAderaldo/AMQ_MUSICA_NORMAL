import { ICacheDatabaseClient } from "./ICacheDatabaseClient";

export class CacheDatabaseClient implements ICacheDatabaseClient {

    databaseCacheClient:ICacheDatabaseClient

    constructor(databaseCacheClient:ICacheDatabaseClient){
        this.databaseCacheClient = databaseCacheClient
    }


    async initializeRoomState(roomId: string, initialState: Record<string, string>): Promise<void> {
        try{
            await this.databaseCacheClient.initializeRoomState(roomId,initialState)
        }catch(e){
            throw e
        }
    }

    async updateRoomState(roomId: string, updatedState: Record<string, string>): Promise<void> {
        try{
            await this.databaseCacheClient.updateRoomState(roomId,updatedState)
        }catch(e){
            throw e
        }
    }

    async getRoomState(roomId: string): Promise<Record<string, string>> {
        try{
            return await this.databaseCacheClient.getRoomState(roomId)
        }catch(e){
            throw e
        }
    }

    async deleteRoomState(roomId: string): Promise<void> {
        try{
            await this.databaseCacheClient.deleteRoomState(roomId)
        }catch(e){
            throw e
        }
    }
}