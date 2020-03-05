import mongoose from 'mongoose'
const Schema = mongoose.Schema

const GoodsSchema = new Schema(
  {
    project: {
      type: String,
      require: true
    },
    name: {
      type: String,
      require: true
    },
    nameJP: String,
    description: String,
    goodsType: String,
    price: String,
    release: String,
    image: String,
    link: String,
    tags: Array
  },
  {
    versionKey: false
  }
)

const Goods = mongoose.model('goods', GoodsSchema, 'goods')

export { Goods }
