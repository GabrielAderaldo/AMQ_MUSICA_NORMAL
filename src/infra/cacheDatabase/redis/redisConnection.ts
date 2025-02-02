import { createClient } from "redis"

export const redisConnection = async () => {
    try{

        if(!process.env.REDIS_HOST) throw new Error("REDIS_HOST not found in .env file");
        if(!process.env.REDIS_PORT) throw new Error("REDIS_PORT not found in .env file");
        if(!process.env.REDIS_USERNAME) throw new Error("REDIS_USERNAME not found in .env file");
        if(!process.env.REDIS_PASSWORD) throw new Error("REDIS_PASSWORD not found in .env file");

        const redisClient = createClient({
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT)
            }
        })

        redisClient.on('error',(err)=>{
            throw new Error(err.message)
        })

        await redisClient.connect()
        console.log("Connected to Redis")
        return redisClient 
    }catch(e){
        throw e;
    }
}