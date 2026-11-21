import mongoose from "mongoose";

const MONGO_URI =
  "mongodb+srv://practice:practice123@cluster0.b3gdydm.mongodb.net/?retryWrites=true&w=majority";


  const userSchema= new mongoose.Schema({
    name:String,
    email:{
      type:String,
      unique:true,  // Unique index - no duplicate emails
      required:true
    },
    age:Number,
  });

  // Add indexes for better query performance
  userSchema.index({ name: 1 });           // Single field index
  userSchema.index({ age: 1 });            // Index for age queries
  userSchema.index({ name: 1, age: -1 });  // Compound index


  const postSchema= new mongoose.Schema({
    content:String,
    date:{
        type:Date,
        default:Date.now,
        index:true  // Index for date queries
    },
    userSummary:{
        name:String,
        profilePicture:String
    },
    userRef:{
        type:mongoose.Schema.Types.ObjectId, 
        ref:"User",
        index:true  // Index for faster user lookups
    }
  });

  // Compound index for common query: "Get posts by user, sorted by date"
  postSchema.index({ userRef: 1, date: -1 });
  
  // Text index for searching post content
  postSchema.index({ content: 'text' });


  const User= mongoose.model("User", userSchema);
  const Post= mongoose.model("Post", postSchema); 


  async function createUser(name, email, age){
    const newUser= new User({
        name:name,
        email:email,
        age:age,
    });    
  await newUser.save();
  console.log(newUser);

  }


  async function createPost(content,user, userId){
    const newPost= new Post ({
        content:content,
        userSummary:user,
        userRef:userId
    });
     await newPost.save();
  console.log(newPost);
  }

  async function getPosts() {
     const posts = await Post.find();
     console.log(posts);
  }

  // Function to demonstrate index usage
  async function getPostsByUser(userId) {
     // This query uses the compound index { userRef: 1, date: -1 }
     const posts = await Post.find({ userRef: userId }).sort({ date: -1 });
     console.log(`Posts by user ${userId}:`, posts);
  }

  async function searchPosts(searchTerm) {
     // This uses the text index on content
     const posts = await Post.find({ $text: { $search: searchTerm } });
     console.log(`Search results for "${searchTerm}":`, posts);
  }

  async function getUserByEmail(email) {
     // This uses the unique index on email (very fast!)
     const user = await User.findOne({ email: email });
     console.log("User found:", user);
  }

  createUser("Code Bless you", {
    name:"code bless you", profilePicture: "profile.jpg"
  },
  "234234kjlk3j4lk2j4kl3"

  )

