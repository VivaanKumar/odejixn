import User from "@/models/userModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.query;
  const { email } = query;

  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    const foundUser = await User.findOne({email});

    console.log(foundUser)

    res.json(foundUser);

   
  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
