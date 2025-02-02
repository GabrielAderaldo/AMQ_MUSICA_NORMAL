import { Room } from "../../domain/entity/room";
import { IDatabaseRepository } from "./IDatabaseRepository";

export class DatabaseRepository implements IDatabaseRepository{
    

    private databaseService: IDatabaseRepository;

    constructor(databaseService: IDatabaseRepository){
        this.databaseService = databaseService;
    }
    
    async createRoom(room: Room): Promise<Room> {
        try{
            return await this.databaseService.createRoom(room);
        }catch(e){
            throw e;
        }
    }

}