import {Game, Player, AI} from "./classes.js";

document.addEventListener("DOMContentLoaded", () => {
    let white = new Player('player1', 'white');
    let black = new Player('player2', 'black', 1);
    let game = new Game(white, black);
    game.startGame(white);
});
