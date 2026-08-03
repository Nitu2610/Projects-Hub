const mongoose= require('mongoose');

const connectDB= async () =>  {
  try {
    await mongoose.connect(process.env.MONGO_URL);

    console.log('✅ MongoDB Connected.')
  } catch (error) {
    console.log('❌ MongoDB connection Failed');
    console.log(error.message);

    process.exit(1)
  }
  
}

module.exports=connectDB;