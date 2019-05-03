import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import Board from '../../models/board'
import User from '../../models/user'
import Game from '../../models/game'

const Query = {
    users: () => {
        return User.find()
    },
    boards: () => {
        return Board.find()
    },
    games: () => {
        return Game.find()
    },
    userGames: (parent, args, ctx, info) => {
        return Game.find({
            $or: [
                { 'user1': args.userId },
                { 'user2': args.userId }
            ]}).then((games) => {
            
            let userGames = new Array()

            // An array for all the promises.
            let results = new Array()
            for (let i = 0; i < games.length; ++i) {
                let opponentUserId = games[i].user1
                let currentStatus = 'play'
                if (args.userId === games[i].user1) {
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
};

export default Query;