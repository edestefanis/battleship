import Board from '../../models/board'
import User from '../../models/user'
import Game from '../../models/game'


/**
 * Given a pair of Boards corresponding to a player (board1) and its opponent (board2)
 * this function returns a list of boards that can be shown externally (depending on the
 * current game state).
 * 
 * For the player's Board, unseen cells are returned with 0, while seen/visited cells are
 * returned with 2 (for non-ship cells) or 1 (for ship cells). 
 *  
 * @param {Board} board1: the player Board.
 * @param {Board} board2: the opponent Board.
 * @returns {Array[]}: returns an array of boards with enough information for the client
 *                     to display the current state of the game.
 */
function getUserBoards(board1, board2) {
    // We assume 10x10 boards.
    let playerBoard = new Array(10).fill(null).map(() => new Array(10).fill(0))
    let opponentBoard = new Array(10).fill(null).map(() => new Array(10).fill(0))

    // For the user, it can only see the 'discovered' cells.
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            if (board1.unseen[i][j] !== '#') {
                if (board1.board[i][j] === '.') {
                    playerBoard[i][j] = 2
                } else {
                    playerBoard[i][j] = 1
                }
            }
        }
    }

    // For the opponent, we can just pass a codified board showing all the information.
    // For that, we just add 1000 to each number and we return that. 
    for (let i = 0; i < 10; ++i) {
        for (let j = 0; j < 10; ++j) {
            if (board2.board[i][j] === '.') {
                opponentBoard[i][j] = 0
            } else {
                opponentBoard[i][j] = parseInt(board2.board[i][j])
            }
            // Now we will add a big number if we haven't discovered this place.
            // We use 1000 so we can get the actual value in the board by just 
            // using mod1000.
            if (board2.unseen[i][j] !== '#') {
                opponentBoard[i][j] += 1000
            }
        }
    }
    return [playerBoard,opponentBoard]
}


/**
 * Given a user and a game, it returns the view of the game state containing information like
 * opponent name, boards views, status ('pending' vs 'play').
 *  
 * @param {String} userId: The user ID of the game being fetched.
 * @param {String} gameId: The game ID of the game being fetched.
 * @returns {UserGame}: a view of the current game state.
 */
export function getFullUserGame(userId, gameId) {
    return Game.findById(gameId).then((game) => {
        // Get the opponent name.
        let opponentId = game.user1
        if (game.user1 === userId) {
            opponentId = game.user2
        }
        return User.findById(opponentId).then((opponent) => {
            let status = 'play'
            if ((game.user1 === userId && !game.turnUser1) ||
                (game.user2 === userId && game.turnUser1)) {
                status = 'pending'
            }
            // Lets prepare the player's and opponent board.
            let boardId1 = game.board1
            let boardId2 = game.board2
            if(game.user1 !== userId) {
                boardId1 = game.board2
                boardId2 = game.board1
            }
            // Get the boards.
            return Board.findById(boardId1).then((board1) => {
                return Board.findById(boardId2).then((board2) => {
                    let [playerBoard,opponentBoard] = getUserBoards(board1, board2)
                    return {
                        gameId: gameId,
                        opponentName: opponent.name,
                        status: status,
                        playerBoard: playerBoard,
                        opponentBoard: opponentBoard
                    }
                })
            })
        })
    })
}


/**
 * Given a user ID, returns the list of active games this player currently has.
 *  
 * @param {String} userId: The id of the user we are fetching the list of active games.
 */
export function getUserList(userId) {    
    return Game.find({
        $or: [
            { 'user1': userId },
            { 'user2': userId }
        ]}).then((games) => {
        
        let userGames = new Array()

        // An array for all the promises.
        let results = new Array()
        for (let i = 0; i < games.length; ++i) {
            let opponentUserId = games[i].user1
            let currentStatus = 'play'
            if (userId === games[i].user1) {
                opponentUserId = games[i].user2
                if (!games[i].turnUser1) {
                    currentStatus = 'pending'
                }
            } else {
                if (games[i].turnUser1) {
                    currentStatus = 'pending'
                }
            }
            // Get the user to get the name.
            const gameId = games[i]._id
            results.push(User.findById(opponentUserId).then((user) => {
                userGames.push({ 'gameId': gameId, 'opponentName': user.name, 'status': currentStatus }) 
            }))
        }
        return Promise.all(results).then(() => {return userGames})
    })
}


/**
 * Generates a random board with '.' in cells with no ships, and numbers where there are ships,
 * using the following numbers:
 * 1: 4 contiguous cells representing a ship of length 4.
 * 2, 3: two ships of 3 contiguous cells.
 * 4, 5, 6: three ships, each consisting of 2 contiguous cells representing ships of length 2.
 * 7, 8, 9, 10: 4 single cell ships.
 * 
 * Returns an array of strings, representing the mentioned Board.
 */
export function generateBoard() {
    let board = new Array()
    for (let i = 0; i < 10; ++i) {
        board.push("..........")
    }
    let shipsBySize = [-1, 4, 3, 2, 1]
    let shipIndex = 1
    // Lets start by trying to put the 4 spaces long ship.
    for (let shipSize = 4; shipSize > 0; shipSize--) {
        for (let cant = 0; cant < shipsBySize[shipSize]; cant++) {
            // Choose between a horizontal and a vertical ship.
            let shipDirection = Math.floor(Math.random() * 2);
            let freeCells = []
            for (let row = 0; row < 11 - shipSize; ++row) {
                for (let col = 0; col < 11 - shipSize; ++col) {
                    let availableOption = true
                    // Check if placing a ship starting on that cell is possible.
                    for (let j = 0; j < shipSize; ++j) {
                        if (board[row + j*shipDirection ][col + j*(1-shipDirection)] !== '.') {
                            availableOption = false
                        }
                    }
                    if (availableOption) {
                        freeCells.push({row, col, shipDirection})
                    }
                }
            }

            // Choose one of the options.
            let chosenOption = Math.floor(Math.random() * freeCells.length)

            // Lets place the ship on the board :).
            let chosenOptionRow = freeCells[chosenOption].row
            let chosenOptionCol = freeCells[chosenOption].col
            let chosenOptionDirection = freeCells[chosenOption].shipDirection

            for (let j = 0; j < shipSize; ++j) {
                let shipRow = chosenOptionRow + j*chosenOptionDirection
                let shipCol = chosenOptionCol + j*(1-chosenOptionDirection)
                board[shipRow] = board[shipRow].substr(0, shipCol) + String(shipIndex) + board[shipRow].substr(shipCol+1)
            }
            shipIndex++ 
        }
    }
    return board
}


/**
 * Returns an array of strings representing unseen/unvisited cells (each using character '#').
 */
export function generateUnseenBoard() {
    let unseenBoard = new Array()
    for (let i = 0; i < 10; ++i) {
        unseenBoard.push("##########")
    }
    return unseenBoard
}
