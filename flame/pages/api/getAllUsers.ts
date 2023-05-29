import Post from "@/models/postModel";
import User from "@/models/userModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.query;
  const { limit } = query;


  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const foundPost = await User.find().limit(limit || 5)

    res.json(foundPost);

   
  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
