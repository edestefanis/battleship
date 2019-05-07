import mongoose from 'mongoose'

const gameSchema = mongoose.Schema({
  user1: { type: String, required: true },
  user2: { type: String, required: true },
  board1: { type: String, required: true },
  board2: { type: String, required: true },
  turnUser1: { type: Boolean }, // TODO(edestefanis): add required once I sweep the db.
})

const Game = mongoose.model('Game', gameSchema)

export default Game