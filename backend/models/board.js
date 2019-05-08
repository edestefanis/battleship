import mongoose from 'mongoose'

const boardSchema = mongoose.Schema({
  board: [{ type: String, required: true }],
  unseen: [{ type: [String], required: true }],
})

const Board = mongoose.model('Board', boardSchema)

export default Board
