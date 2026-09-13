import mongoose, { Schema, Types } from "mongoose";

interface Category{
  name:string;
  normalizedName:string;
  parent:Types.ObjectId | null;
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
    },
    parent:{
      type:Schema.Types.ObjectId,
      ref:"Category",
      default:null,
    },
    active:{
      type:Boolean,
      default:true,
    }
  },
  {
    timestamps:true,
  }
);

// Same category name is allowed under different parents,
// but not twice under the same parent.
categorySchema.index(
  { parent: 1, normalizedName: 1 },
  { unique: true }
);


const Category=mongoose.model<Category>("Category", categorySchema);

module.exports = Category;