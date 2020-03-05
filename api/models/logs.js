import mongoose from 'mongoose'
const Schema = mongoose.Schema

const LogSchema = new Schema(
  {
    date: Date,
    log: String
  },
  {
    versionKey: false
  }
)

const Logs = mongoose.model('logs', LogSchema, 'logs')

export { Logs }