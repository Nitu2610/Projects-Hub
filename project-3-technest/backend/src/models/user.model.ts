import mongoose from "mongoose";

interface User{
  fullName: string;
  email:string;
  password: string;
  mobile:string;
  role:string;
}


const userSchema = new mongoose.Schema<User>(
  {
    fullName: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select:false
    },
    mobile: {
      type: String,
      required: true,
      match:[/^[6-9]\d{9}$/,"Please provide a valid Indian mobile number"]
    },
    role: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  },
);


const User= mongoose.model<User>("User", userSchema);


module.exports=User;



// Why is this okay if we're using CommonJS?

// This is an important distinction:

// Project module system: CommonJS

// TypeScript source syntax: can use import