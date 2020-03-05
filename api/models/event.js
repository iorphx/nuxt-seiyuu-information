import mongoose from 'mongoose'
const Schema = mongoose.Schema

const EventSchema = new Schema(
  {
    title: String,
    className: String,
    extendedProps: { description: String, participant: String, project: String, idx: String },
    start: String,
    end: String,
    allDay: Boolean
  },
  {
    versionKey: false
  }
)

const Events = mongoose.model('events', EventSchema, 'events')

export { Events }