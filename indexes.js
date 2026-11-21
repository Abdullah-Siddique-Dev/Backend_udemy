import mongoose from 'mongoose';

const MONGO_URI =
  "mongodb+srv://practice:practice123@cluster0.b3gdydm.mongodb.net/?retryWrites=true&w=majority";


  await mongoose.connect(process.env.MONGO_URI);
import { User } from "./models/User.js";



async function main (){

    try{
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB Connected");

        await User.collection.createIndex({ name: 1 });

        await User.collection.createIndex({ age: 1 });

          console.log("Age index created");
    }
    catch(error){
        console.log(error.message);
    }
    finally {
    await mongoose.disconnect();
  }

}

main();