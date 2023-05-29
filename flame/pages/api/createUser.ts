import User from "@/models/userModel";
import connectMongo from "@/utils/connectMongo";

export default async function products(req: any, res: any) {
  const query = req.query;
  const { email, name, photoURL } = query;

  try {
    // console.log('CONNECTING TO MONGO');
    await connectMongo();
    console.log("CONNECTED TO MONGO");

    // console.log('CREATING DOCUMENT');
    const doesUserExist = await User.findOne({
      email,
    });

    if (doesUserExist) {
      res.json({success: true});
    } else {
      const userCreated = await User.create({
        email,
        name,
        username: name,
        photoURL,
        date: new Date(),
      });

      res.json({success: true});
    }

    // console.log('CREATED DOCUMENT');
  } catch (error) {
    console.log(error);
    res.json({ error });
  }

  // use the information from the query to get the products
  // then send the data back to the client
}
