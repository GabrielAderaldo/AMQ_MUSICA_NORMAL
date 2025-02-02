import { IDatabaseRepository } from "../IDatabaseRepository";
import { Room } from "../../../domain/entity/room";
import { RoomModel } from "./schema/roomSchema";
require('dotenv').config();

export class MongoService implements IDatabaseRepository{
    async createRoom(room: Room): Promise<Room> {
        try{
            const roomModel = await RoomModel.create(room);
            const newRoom = roomModel.toObject();
            return newRoom;

        }catch(e){
            throw e;
        }
    }
}