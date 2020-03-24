import mongoose from 'mongoose'
const Schema = mongoose.Schema

const SeiyuuSchema = new Schema(
  {
    name: {
      type: String,
      require: true
    },
    japaneseName: String,
    englishPr: String,
    birthday: Date,
    constellation: String,
    blood: String,
    height: String,
    hobbies: String,
    specialty: String,
    agent: String,
    born: String,
    image: String,
    links: Object,
    activities: Array
  },
  {
    versionKey: false
  }
)

const SeiyuuSpecialSchema = new Schema(
  {
    project: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    color: String,
    members: {
      type: Array,
      require: true
    }
  },
  {
    versionKey: false
  }
)

const Seiyuu = mongoose.model('seiyuus', SeiyuuSchema, 'seiyuus')
const SeiyuuSpecial = mongoose.model('seiyuus-special', SeiyuuSpecialSchema, 'seiyuus-special')

export { Seiyuu, SeiyuuSpecial }