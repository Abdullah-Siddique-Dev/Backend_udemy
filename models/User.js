import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],minlength:3,
      maxlength:200,
      trim: true,
      lowercase:true,
      uppercase:true,
      trim:true,
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      lowercase: true,
      trim: true,
      match:true,

      // custom validation
    //   validate:{
    //   Validator:(v)=>{
    //     return typeof v=="number" && v > 18;
    //   },
    //   message:"Age must be greater than 18"

    // }

    // async validation
    validate:{
      validator:async function (value){
        const user= await User.findOne({
          email:value
        });
        return !user;
      },
      message:"Email already exists in the database"
    }
    },  
    age: {
      type: Number,
      min: [0, "Age must be a positive number"],
      max:[120,"Can not be greater than 120"],
    },
    phone: {
      type: Number,
      min:[11,"Can not be greater than 11"]
    },
    password: {
      type: String,
      required: [true, "Password is required"],
      minglength:6,
    },
    hobbies: {
      type: [String],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    role:{
      type:String, enum:["user", "admin"]
    }
  },
  { timestamps: true }
);

export const User = mongoose.model("User", userSchema);

// ── Dummy Data ─────────────────────────────────────────────
export const dummyUsers = [
  { name: "Alice Johnson", email: "alice@example.com", age: 28, phone: 1234567890, password: "alice123", hobbies: ["reading", "coding"], isVerified: true },
  { name: "Bob Smith", email: "bob@example.com", age: 34, phone: 9876543210, password: "bob123", hobbies: ["gaming", "cooking"], isVerified: false },
  { name: "Charlie Brown", email: "charlie@example.com", age: 22, phone: 5554443333, password: "charlie123", hobbies: ["trekking", "music"], isVerified: true },
  { name: "Diana Prince", email: "diana@example.com", age: 30, phone: 4447778888, password: "diana123", hobbies: ["gyming", "painting"], isVerified: false },
  { name: "Ethan Hunt", email: "ethan@example.com", age: 45, phone: 3336669999, password: "ethan123", hobbies: ["coding", "skydiving"], isVerified: true },
];
