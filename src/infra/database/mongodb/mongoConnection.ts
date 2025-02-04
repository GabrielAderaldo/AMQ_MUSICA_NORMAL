import { Mongoose } from "mongoose";
import { CustomErrorBuilder } from "../../../utils/error/customError";

export const mongoConnection  = async () => {
  try{
      if(!process.env.MONGO_URI) {
          const customError = new CustomErrorBuilder()
          .setHeaderError("FAIL_TO_LOAD_ENV_VARIABLE")
          .setMessageError("MONGO_URI not found in .env file")
          .setStatus(404)
          .build()

          throw customError
      }

      const mongoose = new Mongoose();
      const client = await mongoose.connect(process.env.MONGO_URI);
      if(client.connection.readyState !== 1) {
          const customError = new CustomErrorBuilder()
          .setHeaderError("FAIL_TO_CONNECT_MONGO")
          .setMessageError("Fail to connect to MongoDB")
          .setStatus(500)
          .build()

          throw customError
      }
      console.log("Connect to MongoDB")
     return client
  }catch(e){
      throw e;
  }
}