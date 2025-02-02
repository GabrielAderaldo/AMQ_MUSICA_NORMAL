import mongoose, { Mongoose } from "mongoose";
import { Room } from "../../../../domain/entity/room";
import { DatabaseClientSingleton } from "../../databaseClientSingleton";

const roomSchema = new mongoose.Schema<Room>({
    playlists_id: {
        type: [String],
        required: true
    },
    status: {
        type: String,
        required: true,
        enum: ['WAITING', 'PLAYING', 'FINISHED'],
    },
    owner_id: {
        type: String,
        required: true
    },
    players: [{
        user_id: String,
        score: Number,
    }],
    music_pool: [{
        id: String,
        name: String,
        artist: String,
        preview: String,
        album: String,
        image: String
    }],
    round: {
        type: Number,
        required: true,
        default: 0
    },
    max_round: {
        type: Number,
        required: true
    }
});

const client = DatabaseClientSingleton.getInstance() as Mongoose;

export const RoomModel = client.model<Room>('Room', roomSchema);