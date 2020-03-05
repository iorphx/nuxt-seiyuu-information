import mongoose from 'mongoose'
const Schema = mongoose.Schema

const TranslationSchema = new Schema(
  {
    project: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true,
      unique: true
    },
    source: String,
    html: {
      type: String,
      require: true
    },
    date: {
      type: Date,
      require: true
    },
    author: {
      type: String,
      require: true
    },
    tags: Array
  },
  {
    versionKey: false
  }
)

const Translation = mongoose.model('translations', TranslationSchema, 'translations')

export { Translation }
