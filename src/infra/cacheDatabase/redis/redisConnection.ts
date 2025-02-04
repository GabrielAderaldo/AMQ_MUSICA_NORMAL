import { createClient } from "redis"
import { CustomErrorBuilder } from "../../../utils/error/customError";

export const redisConnection = async () => {
    try{

        if(!process.env.REDIS_HOST) {
            const customError = new CustomErrorBuilder()
            .setHeaderError("FAIL_TO_LOAD_ENV_VARIABLE")
            .setMessageError("REDIS_HOST not found in .env file")
            .setStatus(404)
            .build()

            throw customError
        }
        if(!process.env.REDIS_PORT) {
            const customError = new CustomErrorBuilder()
            .setHeaderError("FAIL_TO_LOAD_ENV_VARIABLE")
            .setMessageError("REDIS_PORT not found in .env file")
            .setStatus(404)
            .build()

            throw customError
        }

        if(!process.env.REDIS_USERNAME) {
            const customError = new CustomErrorBuilder()
            .setHeaderError("FAIL_TO_LOAD_ENV_VARIABLE")
            .setMessageError("REDIS_USERNAME not found in .env file")
            .setStatus(404)
            .build()

            throw customError
        }

        if(!process.env.REDIS_PASSWORD) {
            const customError = new CustomErrorBuilder()
            .setHeaderError("FAIL_TO_LOAD_ENV_VARIABLE")
            .setMessageError("REDIS_PASSWORD not found in .env file")
            .setStatus(404)
            .build()

            throw customError
        }

        const redisClient = createClient({
            username: process.env.REDIS_USERNAME,
            password: process.env.REDIS_PASSWORD,
            socket: {
                host: process.env.REDIS_HOST,
                port: parseInt(process.env.REDIS_PORT)
            }
        })

        redisClient.on('error',(err)=>{
            const customError = new CustomErrorBuilder()
            .setHeaderError("FAIL_TO_CONNECT_REDIS")
            .setMessageError(err.message)
            .setStatus(500)
            .build()

            throw customError
        })

        await redisClient.connect()
        console.log("Connected to Redis")
        return redisClient 
    }catch(e){
        throw e;
    }
}