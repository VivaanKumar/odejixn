
const { v4: uuidv4 } = require('uuid');
import Post from "@/models/postModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.body;
  const { id, email } = JSON.parse(query);

  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const post = await Post.findById(id);
    let postLikes: string[] = post?.likes || [];

    if(postLikes.includes(email)) {



      const updatedPost = await Post.findByIdAndUpdate(id, {
        likes: postLikes.filter(a => a !== email)
      })

      res.json({liked: false});
    } else {

      postLikes.push(email);

      const updatedPost = await Post.findByIdAndUpdate(id, {
        likes: postLikes,
      })

      res.json({liked: true});
    }
    

    res.json({liked: true})
  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
