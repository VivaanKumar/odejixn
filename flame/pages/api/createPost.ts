
const { v4: uuidv4 } = require('uuid');
import Post from "@/models/postModel";
import User from "@/models/userModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.body;
  const { rated, title, desc, email, url, type } = JSON.parse(query);

  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    console.log("URL", url)

    const createdPost = await Post.create({
      rated,
      title,
      desc,
      createdAt: new Date(),
      likes: [],
      _id: uuidv4(),
      email,
      fileURL: url,
      public: true,
      type,
      comments: [],
      views: [],
    });

    // const postSchema = new Schema({
    //   rated: Number,
    //   title: String,
    //   desc: String,
    //   createdAt: Date,
    //   likes: Array,
    //   _id: String,
    //   email: String,
    //   fileURL: {
    //     type: String,
    //     default: "",
    //   },
    //   public: {
    //     type: Boolean,
    //     default: true
    //   }
    
    // }, {strict: false});

    res.json(createdPost);

    // console.log('CREATING DOCUMENT');
    // const doesUserExist = await User.findOne({
    //   email,
    // });

    // if (doesUserExist) {
    //   res.json({success: true});
    // } else {
    //   const userCreated = await User.create({
    //     email,
    //     name,
    //     username: name,
    //     photoURL,
    //     date: new Date(),
    //   });

    //   res.json({success: true});
    // }

    // console.log('CREATED DOCUMENT');
  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
