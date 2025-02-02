import { Mongoose } from "mongoose";

export const mongoConnection  = async () => {
  try{
      if(!process.env.MONGO_URI) throw new Error("MONGO_URL not found in .env file");

      const mongoose = new Mongoose();
      const client = await mongoose.connect(process.env.MONGO_URI);
      if(client.connection.readyState !== 1) throw new Error("Failed to connect to database");
      console.log("Connect to MongoDB")
     return client
  }catch(e){
      throw e;
  }
}