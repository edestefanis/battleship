const typeDefs = [`
    type Board {
        id: ID!
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
        playerBoard: [[Int!]!]!
        opponentBoard: [[Int!]!]!
    }

    type Query {
        users: [User!]!
        boards: [Board!]!
        games: [Game!]!
        userGames(userId: String!): [UserGame!]!
        userGame(userId: String!, gameId: String!): UserGame!
    }

    type StringResult {
        result: String!
    }

    type Mutation {
        sendRocket(gameId: String!, userId: String!, row: Int!, column: Int!): StringResult!
        createUser(name: String!): User!
        deleteAllUsers: Int
        createGame(userId1: ID!, userId2: ID!): Game! 
    }
`];

export default typeDefs;