import mongoose from 'mongoose'
const Schema = mongoose.Schema

const DiscographySchema = new Schema(
  {
    project: {
      type: String,
      require: true
    },
    title: {
      type: String,
      require: true
    },
    titleKR: String,
    artist: String,
    lyricist: String,
    composer: String,
    arrange: String,
    release: Date,
    image: String,
    music: String,
    lyric: String,
    tags: Array
  },
  {
    versionKey: false
  }
)

const Discography = mongoose.model('discographies', DiscographySchema, 'discographies')

export { Discography }