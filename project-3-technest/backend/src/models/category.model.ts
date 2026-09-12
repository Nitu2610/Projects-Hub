import mongoose from "mongoose";

interface Category{
  name:string;
  normalizedName:string;
  active:boolean;
}

const categorySchema= new mongoose.Schema<Category>(
  {
    name:{
      type:String,
      required:true,
    },
    normalizedName:{
      type:String,
      required:true,
      unique:true, 
    },
    active:{
      type:Boolean,
      default:true,
    }
  },
  {
    timestamps:true,
  }
)


const Category=mongoose.model<Category>("Category", categorySchema);

module.exports = Category;