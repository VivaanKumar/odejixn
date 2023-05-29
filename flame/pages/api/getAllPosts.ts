import Post from "@/models/postModel";
import User from "@/models/userModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.query;
  const { limit, type, search } = query;

  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    if (type == "recent") {
      const foundPost = await Post.find()
        .limit(limit || 10)
        .sort({ createdAt: -1 });

      res.json(foundPost);
    } else {
      const foundPost = await Post.aggregate([
        { $addFields: { likes: 1, likes_count: { $size: "$likes" } } },
        { $sort: { likes_count: -1 } },
      ]);

      res.json(foundPost);
    }
  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
