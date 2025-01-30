import { Track } from "./track";

export class Playlist{
    constructor(
        public id: string,
        public name: string,
        public description: string,
        public imageUrl: string,
        public tracks: Track[]
    ){}
}