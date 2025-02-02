import { Room } from "../../domain/entity/room";

export interface IDatabaseRepository {
    createRoom(room:Room): Promise<Room>;
}