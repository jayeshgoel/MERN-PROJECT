import React, { useContext, useEffect, useState } from 'react'
import { jobsData, manageJobsData } from '../assets/assets'
import moment from 'moment'
import { useNavigate } from 'react-router-dom'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import axios from 'axios'
import Loading from '../components/Loading'

const ManageJobs = () => {
    const navigate = useNavigate()

    const [jobs,setJob] = useState(false)

    // Function to fetch Company Job

    const {backendUrl,companyToken} = useContext(AppContext)

    const fetchCompanyJobs = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/company/list-jobs',{
                headers : {token : companyToken}
            })
            if(data.success){
                setJob(data.jobsData.reverse())
                console.log(data.jobsData)
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)   
        }
    }

    // Function to change job Visibility
    const changeJobVisibility = async (id) => {
        try {
            console.log("id is " + id)
            console.log("token is " + companyToken)
            const {data} = await axios.post(backendUrl+'/api/company/change-visibility',
            {id},
            {headers : {token : companyToken}})
            
            console.log(data)
            if(data.success){
                fetchCompanyJobs()
                toast.success(data.message)
                
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect(()=>{
        console.log(companyToken)
        if(companyToken){
            fetchCompanyJobs()
        }
    },[companyToken])
    
  return jobs ? jobs.length === 0 ? (
  <div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No Jobs Available or posted</p>
  </div>
  ) :  
  (
    <div className='container p-4 max-w-5xl'>
        <div className='overflow-x-auto'>
            <table className='min-w-full bg-white border border-gray-200 max-sm:text-sm'>
                <thead>
                    <tr>
                        <th className='py-2 px-4 border-b text-left max-sm:hidden'>#</th>
                        <th className='py-2 px-4 border-b text-left'>Job Title</th>
                        <th className='py-2 px-4 border-b text-left max-sm:hidden'>Date</th>
                        <th className='py-2 px-4 border-b text-left max-sm:hidden'>Location</th>
                        <th className='py-2 px-4 border-b text-center'>Application</th>
                        <th className='py-2 px-4 border-b text-left'>Visible</th>
                    </tr>
                </thead>
                <tbody>
                    {   
                         jobs.map((job,index)=>(
                            <tr key={index} className='text-gray-700'>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{index+1}</td>
                                <td className='py-2 px-4 border-b'>{job.title}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{moment(job.date).format('ll')}</td>
                                <td className='py-2 px-4 border-b max-sm:hidden'>{job.location}</td>
                                <td className='py-2 px-4 border-b'>{job.applicants}</td>
                                <td className='py-2 px-4 border-b'>
                                    <input onChange={()=>changeJobVisibility(job._id)} className='scale-125 ml-4' checked = {job.visible} type="checkbox" />
                                </td>
                            </tr>
                        ))
                        
                    }
                </tbody>
            </table>
        </div>
        <div className='mt-4 flex justify-end'>
            <button onClick={e => navigate('/dashboard/add-job')} className='bg-black text-white py-2 px-4 rounded'  >Add New Job</button>
        </div>
    </div>
  ) : <Loading/>
}

export default ManageJobs