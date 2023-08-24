import {Game} from "./game.js";
import {Player, AI} from "./player.js";

document.addEventListener("DOMContentLoaded", () => {
    let white = new Player('player1', 'white');
    let black = new AI('player2', 'black', 5);
    let game = new Game(white, black, 'singleplayer');
    game.startGame(white);
});
