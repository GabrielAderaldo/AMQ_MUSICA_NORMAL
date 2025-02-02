export function cleanSongName(songName:string): string {
    // A regex [^\p{L}\p{N}\s] casa com qualquer caractere que não seja:
    // \p{L}: qualquer letra
    // \p{N}: qualquer número
    // \s: qualquer espaço em branco
    // A flag "u" é necessária para interpretar propriedades Unicode.
    return songName.replace(/[^\p{L}\p{N}\s]/gu, '');
}