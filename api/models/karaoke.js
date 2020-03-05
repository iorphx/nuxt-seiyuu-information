import mongoose from 'mongoose'
const Schema = mongoose.Schema

const KaraokeSpecialSchema = new Schema(
  {
    title: {
      type: String,
      require: true
    },
    titleKR: String,
    project: String,
    tags: Array,
    singer: String,
    stype: String,
    tj: String,
    ky: String,
    joysound: {
      type: String,
      default: 'X'
    },
    dam: {
      type: String,
      default: 'X'
    },
    uga: {
      type: String,
      default: 'X'
    }
  },
  {
    versionKey: false
  }
)
  
/*
const KaraokeFavorite = new Schema({
  brand: String,
  title: String,
  singer: String,
  no: String,
  release: String
},
{
  versionKey: false
})
*/

const KaraokeSpecial = mongoose.model('karaoke-special', KaraokeSpecialSchema, 'karaoke-special')
//const KaraokeFavorite = mongoose.model('karaoke-favorite', KaraokeSearchRanking, 'karaoke-favorite')

export { KaraokeSpecial }
