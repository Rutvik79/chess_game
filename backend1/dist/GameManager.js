import { WebSocket } from "ws";
import { INIT_GAME, MOVE } from "./messages.js";
import { Game } from "./Game.js";
// User, Game
export class GameManager {
    games;
    pendingUser;
    users;
    constructor() {
        this.games = [];
        this.pendingUser = null;
        this.users = [];
    }
    addUser(socket) {
        this.users.push(socket);
        this.addHandler(socket);
    }
    removeUser(socket) {
        this.users = this.users.filter((user) => user !== socket);
        // Stop the game here because the user left
    }
    addHandler(socket) {
        socket.on("message", (data) => {
            const message = JSON.parse(data.toString());
            if (message.type === INIT_GAME) {
                if (this.pendingUser) {
                    const game = new Game(this.pendingUser, socket);
                    this.games.push(game);
                    this.pendingUser = null;
                }
                else {
                    this.pendingUser = socket;
                }
            }
            if (message.type === MOVE) {
                console.log("inside move");
                const game = this.games.find((game) => game.player1 === socket || game.player2 === socket);
                if (game) {
                    console.log("inside make move", message);
                    game.makeMove(socket, message.payload.move);
                }
            }
        });
    }
}
//# sourceMappingURL=GameManager.js.map