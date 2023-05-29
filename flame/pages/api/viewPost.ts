const { v4: uuidv4 } = require("uuid");
import Post from "@/models/postModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.query;
  const { id, email } = query;

  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const post = await Post.findById(id);
    let viewLikes: string[] = post?.views || [];

    if (!viewLikes.includes(email)) {
      viewLikes.push(email);

      const updatedPost = await Post.findByIdAndUpdate(id, {
        views: viewLikes,
      });

      res.json(query);
    } else {
        res.json({ success2: true });
    }

    // res.json({ deded: true });
  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
