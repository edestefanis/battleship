const typeDefs = [`
    type Board {
        id: ID!
        userId1: String!
        userId2: String!
        board: [String!]!
        unseen: [String!]!
    }

    type User {
        id: ID!
        name: String
    }

    type Game {
        board1: Board!
        board2: Board!
        user1: User!
        user2: User!
        turnUser1: Boolean
    }

    type UserGame {
        gameId: ID!
        opponentName: String!
        status: String!
    }

    type Query {
        users: [User!]!
        boards: [Board!]!
        games: [Game!]!
        userGames(userId: String!): [UserGame!]!
    }

    type Mutation {
        createUser(name: String!): User!
        deleteAllUsers: Int
        createGame(userId1: ID!, userId2: ID!): Game! 
    }
`];

export default typeDefs;