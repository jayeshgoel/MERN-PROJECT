// Register a new company

import Company from "../models/Company.js";
import bcrypt from 'bcrypt'
import {v2 as cloudinary} from 'cloudinary'
import generateToken from "../utils/generateToken.js";
import Job from "../models/Job.js";
import JobApplication from "../models/JobApplication.js";

export const registerCompany = async (req,res) => {
    const {name,email,password} = req.body
    const imageFile = req.file;
    if(!name || !email || !password || !imageFile){
        return res.json({sucess:false,message : "Missing Details"})
    }
    try{
        const companyExists = await Company.findOne({email})

        if(companyExists){
            return res.json({success : false ,message : "Company already registered"})
        }

        const salt = await bcrypt.genSalt(10)
        const hashPassword = await bcrypt.hash(password,salt)
        // Saving image on cloudinary
        const imageUpload = await cloudinary.uploader.upload(imageFile.path)
        
        const company = await Company.create({
            name,
            email,
            password:hashPassword,
            image : imageUpload.secure_url
        })
        
        res.json({
            success : true,
            company : {
                _id : company._id,
                name : company.name,
                email : company.email,
                image : company.image
            },
            token : generateToken(company._id)
        })
        
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
    
}

// Company Login 
export const loginCompany = async (req,res) => {
    // Email - stack@gmail.com  
    // password - 123
    const {email,password} = req.body
    try{
        const company = await Company.findOne({email})
        if(await bcrypt.compare(password,company.password)){
            res.send({
                success : true ,
                company : {
                    _id : company._id,
                    name : company.name,
                    email : company.email,
                    image : company.image
                },
                token : generateToken(company._id)
            })
        }else{
            res.json({
                success : false,
                message : "Invalid email or Password"
            })
        }
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
}

// Get Company Data
export const getCompanyData = async (req,res) => {
    try{
        const company = req.company 
        res.json({
            success : true,
            company
        })
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
}

// Post a new Job 
export const postJob = async(req,res) => {
    const {title,description,location,salary,level,category} = req.body
    const companyId = req.company._id
    try{
        const newJob = new Job({
            title,
            description,
            location,
            salary,
            companyid : companyId,
            date : Date.now(),
            level,
            category
        })
        await newJob.save()
        
        res.json({
            success : true,
            newJob
        })
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
}

// Get Company Job Applicants
export const getCompanyJobApplicants = async (req,res) => {
    try {
        const companyid = req.company._id
        // Find Job applications for th euser and populate related data
        const applications = await JobApplication.find({companyid})
                                    .populate('userId','name image resume')
                                    .populate('jobId','title location category level salary')
                                    .exec()
            
        return res.json({success : true,applications})          
        

    } catch (error) {
        res.json({   
            success : false,
            message:error.message }
        )
    }
    
}

// Get Company Posted Jobs 
export const getCompanyPostedJobs = async (req,res) => {
    try{
        const companyId = req.company._id
        const jobs = await Job.find({companyid : companyId})

        // (Todo) Adding no. of applications info in data

        const jobsData = await Promise.all(jobs.map(async (job)=>{
            const applicants = await JobApplication.find({jobId : job._id})
            return {...job.toObject(),applicants:applicants.length}
        }))


        res.json({
            success : true ,
            jobsData : jobsData
        })
    }catch(error){
        res.json({
            success : false,
            message : error.message
        })
    }
}

// Change Job Application Status 
export const changeJobApplicationStatus = async (req,res) => {
    try {
        const {id,status} = req.body
        // Find Job Application and update status
        const data = await JobApplication.findOneAndUpdate({_id : id},{status})
        return res.json({
            success : true,
            message : "Status Changed"
        })
    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
    

}

// Change Job Visibility 
export const changeVisibility = async (req,res) => {
    try {
        const {id} = req.body
        const companyId = req.company._id
        const job = await Job.findById(id)
        if(companyId.toString() === job.companyid.toString()){
            job.visible = ! job.visible
        }
        await job.save()
        res.json({
            success : true ,
            jobData : job
        })

    } catch (error) {
        res.json({
            success : false,
            message : error.message
        })
    }
}


