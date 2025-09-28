import { WebSocket } from "ws";
import { Chess } from "chess.js";
import { GAME_OVER, INIT_GAME, MOVE } from "./messages.js";
export class Game {
    player1;
    player2;
    board;
    startTime;
    moveCount = 0;
    constructor(player1, player2) {
        this.player1 = player1;
        this.player2 = player2;
        this.board = new Chess();
        this.startTime = new Date();
        this.player1.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "white",
            },
        }));
        this.player2.send(JSON.stringify({
            type: INIT_GAME,
            payload: {
                color: "black",
            },
        }));
    }
    makeMove(socket, move) {
        // validate the type of move using zod
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        if (this.moveCount % 2 === 0 && socket !== this.player1) {
            return;
        }
        console.log("did not early return");
        console.log("move from", move.from, "move to", move.to);
        try {
            this.board.move(move);
        }
        catch (error) {
            console.log(error);
            return;
        }
        console.log("made move");
        if (this.board.isGameOver()) {
            // send the game over message to both parties
            this.player1.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    move,
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            this.player2.send(JSON.stringify({
                type: GAME_OVER,
                payload: {
                    move,
                    winner: this.board.turn() === "w" ? "black" : "white",
                },
            }));
            console.log("game over sent");
            return;
        }
        console.log(this.moveCount % 2);
        if (this.moveCount % 2 === 0) {
            console.log("sent1");
            this.player2.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }));
        }
        else {
            console.log("sent2");
            this.player1.send(JSON.stringify({
                type: MOVE,
                payload: move,
            }));
        }
        this.moveCount++;
    }
}
//# sourceMappingURL=Game.js.map