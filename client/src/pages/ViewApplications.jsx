import React, { useContext, useEffect, useState } from 'react'
import { assets, viewApplicationsPageData } from '../assets/assets'
import { AppContext } from '../context/AppContext'
import { toast } from 'react-toastify'
import Loading from '../components/Loading'
import axios from 'axios'

const ViewApplications = () => {
    const {backendUrl,companyToken} = useContext(AppContext)
    const [applications,setApplication] = useState(false)
    
    // Function to fetch copmany Job Applications data 
    const fetchCompanyJobApplications = async () => {
        try {
            const {data} = await axios.get(backendUrl + '/api/company/applicants',{
                headers : {token : companyToken}
            })
            
            if(data.success ){
                setApplication(data.applications.reverse())
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }
    // Function to Update Job Application Status
    const changeJobApplicationStatus = async (id,status) => {
        try {
            const {data} = await axios.post(backendUrl + '/api/company/change-status',
            {id,status},
            {headers : {token : companyToken }})
            console.log(data)
            if(data.success){
                
                fetchCompanyJobApplications()
            }else{
                toast.error(data.message)
            }
        } catch (error) {
            toast.error(error.message)
        }
    }

    useEffect( () => {
        if(companyToken){
            fetchCompanyJobApplications()
        }
    },[companyToken])


  return applications ? applications.length === 0 ? (
    <div className='flex items-center justify-center h-[70vh]'>
    <p className='text-xl sm:text-2xl'>No Applications Posted</p>
  </div> 
  ) : 
  (
    <div className='container mx-auto p-4'>
        <div>
            <table className='w-full max-w-4xl bg-white border border-gray-20 max-sm:text-sm'>
                <thead>
                    <tr className='border-b'>
                    <th className='py-2 px-4 text-left'>#</th>
                    <th className='py-2 px-4 text-left'>User name</th>
                    <th className='py-2 px-4 text-left max-sm:hidden'>Job Title</th>
                    <th className='py-2 px-4 text-left max-sm:hidden'>Location</th>
                    <th className='py-2 px-4 text-left'>Resume</th>
                    <th className='py-2 px-4 text-left'>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {applications.filter(item => item.jobId && item.userId).map((application,index)=>(
                        <tr key={index} className='text-gray-700'>  
                            <td className='py-2 px-4 border-b text-center'>{index+1}</td>
                            <td className='py-2 px-4 border-b text-center flex items-center'>
                                <img className='w-8 h-8 rounded-full mr-3 max-sm:hidden' src={application.userId.image} alt="" />
                                <span>{application.userId.name}</span>
                            </td>
                            <td className='py-2 px-4 border-b max-sm:hidden'>{application.jobId.title}</td>
                            <td className='py-2 px-4 border-b max-sm:hidden'>{application.jobId.location}</td>
                            <td className='py-2 px-4 border-b'>
                                <a href={application.userId.resume} target='_blank'
                                    className='bg-blue-50 text-blue-400 px-3 py-1 rounded inline-flex gap-2 items-center'
                                >
                                    Resume 
                                    <img src={assets.resume_download_icon } alt="" />
                                </a>
                            </td>
                            <td className='py-2 px-4 border-b relative'> 
                                {application.status === "Pending"
                                    
                                    ?<div className='relative inline-block text-left group'>
                                    <button className='text-gray-500 action-button'>...</button>
                                    <div className='z-10 hidden absolute right-0 md:left-0 top-0 mt-2 w-32 bg-white border border-gray-200 rounded shadow group-hover:block'>
                                        <button onClick={()=>changeJobApplicationStatus(application._id,'Accepted') && (application.status="Accepted")} className='block w-full text-left px-4 py-2 text-blue-500 hover:bg-gray-100'>Accept</button>
                                        <button onClick={()=>changeJobApplicationStatus(application._id,'Rejected') && (application.status="Rejected")} className='block w-full text-left px-4 py-2 text-red-500 hover:bg-gray-100'>Reject</button>
                                    </div>
                                </div> : <div>{application.status}</div>

                                }
                                
                            </td>

                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    </div> 
  ): <Loading/>
}

export default ViewApplications