import express from "express";
import mongoose from "mongoose";
import { User, dummyUsers } from "./models/User.js";

const app = express();
const PORT = 3000;

// ── Middleware ──────────────────────────────────────────────
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ── MongoDB Connection ─────────────────────────────────────
// Replace the cluster URL below with your actual MongoDB Atlas link
const MONGO_URI =
  "mongodb+srv://practice:practice123@cluster0.b3gdydm.mongodb.net/?retryWrites=true&w=majority";

mongoose
  .connect(MONGO_URI)
  .then(() => console.log("✅ Connected to MongoDB"))
  .catch((err) => console.error("❌ MongoDB connection error:", err.message));

// ── Routes ─────────────────────────────────────────────────

// Seed the database with dummy users
app.post("/users/seed", async (req, res) => {
  try {
    await User.deleteMany();
    await User.insertMany(dummyUsers);
    res.json({ message: "Seeded 5 dummy users" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Create a new user
app.post("/users", async (req, res) => {
  try {
    const user = new User(req.body);
    const saved = await user.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Get all users
app.get("/users", async (req, res) => {
  try {
    const users = await User.find();
    res.json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a single user by ID
app.get("/users/:id", async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Update a user by ID
app.put("/users/:id", async (req, res) => {
  try {
    const updated = await User.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ error: "User not found" });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// Delete a user by ID
app.delete("/users/:id", async (req, res) => {
  try {
    const deleted = await User.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ error: "User not found" });
    res.json({ message: "User deleted successfully" });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// ── Start Server ────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});


async function  getUsers(){
    const users=await User.find( )
    .select("-password -isVerified").limit(10).skip();
    console.log(users);
       
}

getUsers();


// regex ( regular expression)

// async function  getUsers(){
//     const users=await User.find({email:/gmail.com$} )
//     .select("-password -isVerified").limit(10).skip();
//     console.log(users);
       
// } 

// how many information we store like we count the document but this one is fast as comare to count dcoument 
//  const users=await User.estimatedDocumentCount();
//     console.log(users);


// const users=await User.CountDcoument();
//    console.log(users);



//pagination
/** 
async function  getUsers(){

    const currentPage=1;
    const perPageData=4;

    const users=await User.find( )
    .skip((currentPage-1)*perPageData)
    .limit(perPageDate);
       

    console.log(users);
}
    */



//  update user
/*
async function updateUser(){

const result = await User.findoneAndUpdate(
User.updateone({
name:"Code Blesss you"}, {
$set:{
email:"update@gmail.com"}}
);

{new:true, runValidaors:true }
}

console.log(result)
}

updateUser()

*/

// delete data


/*
async function deleteUser(){
const result = await User.deleteMany({age:{$gt:15}, isVerified:false})
}

*/
