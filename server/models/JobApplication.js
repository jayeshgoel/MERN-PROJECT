import mongoose from "mongoose"

const JobApplicationSchema = new mongoose.Schema({
    userId : {type :String,ref:'User',require:true},
    companyid :{type : mongoose.Schema.Types.ObjectId,ref:'Company',require:true},
    jobId :{type : mongoose.Schema.Types.ObjectId,ref:'Job',require:true},
    jobId :{type : mongoose.Schema.Types.ObjectId,ref:'Job',require:true},
    status : {type : String,default:'Pending'},
    date : {type:Number,require : true}
})

const JobApplication = mongoose.model('JobApplication',JobApplicationSchema)
export default JobApplication