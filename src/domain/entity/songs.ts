import { Track } from "./track";

export class Songs extends Track{
    preview: string
    howIsTheSong: string
    constructor(id: string, name: string, artist: string, album: string, image: string, duration: number, preview: string, howIsTheSong: string){
        super(id, name, artist, album, image, duration)
        this.preview = preview
        this.howIsTheSong = howIsTheSong
    }
}