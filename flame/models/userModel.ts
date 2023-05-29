import { Schema, model, models } from 'mongoose';

const userSchema = new Schema({
  name: String,
  email: String,
  username: String,
  photoURL: String,
  createdAt: Date,
});

const User = models.User || model('User', userSchema);

export default User;