import { Schema, model, models } from 'mongoose';

const postSchema = new Schema({
  rated: Number,
  title: String,
  desc: String,
  createdAt: Date,
  likes: Array,
  _id: String,
  email: String,
  fileURL: {
    type: String,
    default: "",
  },
  public: {
    type: Boolean,
    default: true
  },
  type: String,
  comments: Array,
  views: []

}, {strict: false});

const Post = models.Post || model('Post', postSchema);

export default Post;