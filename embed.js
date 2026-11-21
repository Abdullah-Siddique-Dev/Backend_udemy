import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://practice:practice123@cluster0.b3gdydm.mongodb.net/?retryWrites=true&w=majority";

// 1. Define Child Schema (Sub-document) First
const postSchema = new mongoose.Schema({
  content: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user:userSchema
});

// 2. Embed postSchema Directly Inside Parent Schema
const embeddedUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  age: Number,
  posts: [postSchema], // Posts are stored inside the User document
});

// Only ONE model is needed because Posts live inside User
const EmbeddedUser = mongoose.model("EmbeddedUser", embeddedUserSchema);

// 3. Helper Functions
async function createUser(name, email, age) {
  const newUser = new EmbeddedUser({
    name,
    email,
    age,
    posts: [],
  });
  await newUser.save();
  console.log("User created:", newUser);
  return newUser;
}

async function createPost(userId, content) {
  const user = await EmbeddedUser.findById(userId);
  if (!user) throw new Error("User not found");

  // Push new post object directly into the user's embedded array
  user.posts.push({ content });
  await user.save();

  console.log("Post embedded inside user:", user);
  return user;
}

async function getUsersWithPosts() {
  // No .populate() needed — posts are already inside the user document
  const users = await EmbeddedUser.find();
  console.log("All users with embedded posts:", JSON.stringify(users, null, 2));
}

// 4. Connect & Run Sequentially
async function run() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("✅ MongoDB connected");

    const user = await createUser("Code Bless You", "code@gmail.com", 25);
    await createPost(user._id, "First embedded post!");
    await createPost(user._id, "Second embedded post!");
    await getUsersWithPosts();
  } catch (err) {
    console.error("❌ Error:", err.message);
  } finally {
    await mongoose.disconnect();
  }
}

run();