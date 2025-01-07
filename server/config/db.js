import mongoose from "mongoose"

// Functino to connect to the MongoDB database

const connectDB = async () => {
    mongoose.connection.on('connected',()=> console.log("Database connected"))
    await mongoose.connect(`${process.env.MONGODB_URI}/job-portal`)
    

}
export default connectDB