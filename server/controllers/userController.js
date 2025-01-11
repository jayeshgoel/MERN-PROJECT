import Job from "../models/Job.js"
import JobApplication from "../models/JobApplication.js"
import User from "../models/User.js"
import {v2 as cloudinary} from 'cloudinary'

// Get User Data
export const getUserData = async (req,res) => {
    const userId = req.auth.userId

    try{
        const user = await User.findById(userId)
        if(!user){
            return res.json({
                success : false, 
                message : 'User not found'
            })
        }
        res.json({
            success : true,
            user
        })
    }catch(error){
        res.json({
            success : false,
            message : error.message 
        })
    }
}

// Apply for job
export const applyForJob = async(req,res) => {
    const {jobId} = req.body
    const userId = req.auth.userId
    try {
        const isAlreadyApplied = await JobApplication.findOne({ jobId, userId });
        if(isAlreadyApplied){
            return res.json({
                success : false ,
                message : 'Already Applied'
            })
        }
        const jobData = await Job.findById(jobId)
        if(!jobData){
            return res.json({
                success : false,
                message : 'Job not found'
            })
        }
        await JobApplication.create({
            companyid : jobData.companyid,
            userId,
            jobId,
            date : Date.now()
        })
        res.json({
            success : true,
            message : "Applied Successfully"
        })
    } catch (error) {
        res.json({
            success : false,
            message : error.message 
        })
    }
}

// Get user applied applications 
export const getUserJobApplications = async(req,res) => {
    try {
        const userId = req.auth.userId
        const application = await JobApplication.find({userId})
                                .populate('companyid','name email image')
                                .populate('jobId','title description location category level salary')
                                .exec()
        if(!application){
            return res.json({
                success : false,
                message : 'No Job Application found for this user.'
            })
        }
        res.json({
            success : true,
            application
        })    
    } catch (error) {
        res.json({
            success : false ,
            message : error.message
        })
    }
    
}

// Update User Profile(resume)
export const updateUserResume = async (req,res)=>{
    try{
        
        const userId = req.auth.userId
        const resumeFile = req.file
        const userData = await User.findById(userId)

        if(resumeFile){
            console.log('Uploading Resume')
            const resumeUpload = await cloudinary.uploader.upload(resumeFile.path)
            console.log('uploaded Resume')
            userData.resume = resumeUpload.secure_url
        }
        console.log('Saving Data')
        await userData.save()
        console.log('Saved Data')
        return res.json({
            success : true ,
            message : 'Resume Updated'
        })

    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
}