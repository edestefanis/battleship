const Subscription = {
    userGame: {
        subscribe(parent, args, { pubsub }, info) {
            // Lets define the label for a game as 'user-game-<userId>-<gameId>'.
            const label = 'user-game-' + args.userId + '-' + args.gameId
            return pubsub.asyncIterator(label)
        }
    } ,
    userList: {
        subscribe(parent, args, { pubsub }, info) {
            // Lets define the label for a user list as 'user-list-<userId>'.
            const label = 'user-list-' + args.userId
            return pubsub.asyncIterator(label)
        }
    } 
};

export default Subscription;