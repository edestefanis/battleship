import { from } from 'rxjs';
import { map } from 'rxjs/operators';

import { getFullUserGame, getUserList } from './utils' 

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
        return getUserList(args.userId)
    }, userGame: (parent, args, ctx, info) => {
        return getFullUserGame(args.userId, args.gameId)    
    }
};

export default Query;