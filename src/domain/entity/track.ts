export class Track{
    constructor(
        public id: string,
        public name: string,
        public artist: string,
        public album: string,
        public imageUrl: string,
        public duration: number,
    ){}
}