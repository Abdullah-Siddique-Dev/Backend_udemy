import mongoose from "mongoose";

import {User} from "./models/User.js";


const MONGO_URI =
  "mongodb+srv://practice:practice123@cluster0.b3gdydm.mongodb.net/?retryWrites=true&w=majority";


  const postSchema = new mongoose.Schema({
    content:{
        type:String,
        required:true,
    },

    date:{
        type:Date,
        default:Date.now,
    },

    user:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true,
    },
  })

  const Post = mongoose.model("Post", postSchema);

// 2. Helper Functions
async function createUser(name, email, age, phone, password) {
  const newUser = new User({ name, email, age, phone, password });
  await newUser.save();
  console.log("User created:", newUser);
  return newUser;
}

async function createPost(content, userId) {
  const newPost = new Post({
    content,
    user: userId,
  });
  await newPost.save();
  console.log("Post created:", newPost);
  return newPost;
}


async function getPosts() {
  // .populate("user") replaces the user ObjectId with the full User document
  const posts = await Post.find().populate("user", "name email");
  console.log("All posts:", posts);
}

// 3. Connect & Run in Order
async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    // Note: Your User.js schema requires `password` (and validates unique email)
    const user = await createUser(
      "Code Bless You",
      "code@gmail.com",
      25,
      12345678901,
      "secret123"
    );

    await createPost("This is my first referenced post!", user._id);
    await getPosts();
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();