import { RedisClientType } from "redis";
import { DatabaseCacheClientSingleton } from "../databaseCacheClientSingleton";
import { ICacheDatabaseClient } from "../ICacheDatabaseClient";


export class RedisService implements ICacheDatabaseClient{
    async initializeRoomState(roomId: string, initialState: Record<string, string>): Promise<void> {
        try{
            const redisClient = DatabaseCacheClientSingleton.getInstance() as RedisClientType;
            const roomKey = `room:${roomId}`;
            await redisClient.hSet(roomKey,initialState)
        }catch(e){
            throw e
        }
    }

    async updateRoomState(roomId: string, updatedState: Record<string, string>): Promise<void> {
        try{
            const redisClient = DatabaseCacheClientSingleton.getInstance() as RedisClientType;
            const roomKey = `room:${roomId}`;
            await redisClient.hSet(roomKey,updatedState)
        }catch(e){
            throw e
        }
    }

    async getRoomState(roomId: string): Promise<Record<string, string>> {
        try{
            const redisClient = DatabaseCacheClientSingleton.getInstance() as RedisClientType;
            const roomKey = `room:${roomId}`;
            return await redisClient.hGetAll(roomKey)
        }catch(e){
            throw e
        }
    }

    async deleteRoomState(roomId: string): Promise<void> {
        try{
            const redisClient = DatabaseCacheClientSingleton.getInstance() as RedisClientType;
            const roomKey = `room:${roomId}`;
            await redisClient.del(roomKey)
        }catch(e){
            throw e
        }
    }
}