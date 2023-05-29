import mongoose from 'mongoose';

const connectMongo = async () => mongoose.connect("mongodb+srv://vivaan:4871@lavendar.wpa32sb.mongodb.net/");

export default connectMongo;