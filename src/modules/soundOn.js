export function soundOn (url) {
    let audio = new Audio();
    audio.src = url;
    audio.preload = "auto";
    return audio; 
}