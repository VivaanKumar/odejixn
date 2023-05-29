
const { v4: uuidv4 } = require('uuid');
import Post from "@/models/postModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.body;
  const id = JSON.parse(query)?.id;
  const comment_ = JSON.parse(query).comment;

  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const findPost = await Post.findOne({_id: id})

    let comment = findPost?.comments || [];

    comment.push(comment_);

   const updatePost = await Post.findByIdAndUpdate(id, {
        comments: comment
    })

    res.json(updatePost);


  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
