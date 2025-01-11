import React, { useContext, useEffect, useState } from 'react';
import { assets } from '../assets/assets';
import { AppContext } from '../context/AppContext';
import axios from 'axios'
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';


const RecruiterLogin = () => {
  const [state, setState] = useState('Login');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [image,setImage] = useState(null)
  const [isTextDataSubmited,setIsTextDataSubmited] = useState(false)

  const {setShowRecruiterLogin,backendUrl,setCompanyToken,setCompanyData} = useContext(AppContext)

  const navigate = useNavigate() 

  const onSubmitHandler = async (e) => {
    e.preventDefault()
    if(state == "Sign Up" && !isTextDataSubmited){
        return setIsTextDataSubmited(true)
    }
    try{
        if(state === "Login"){
            console.log(backendUrl)
            const {data} = await axios.post(`${backendUrl}/api/company/login`,{email,password})
            if(data.success){
                // it means user is successfully logged in 
                console.log(data);
                setCompanyData(data.company)
                setCompanyToken(data.token)
                localStorage.setItem('companyToken',data.token)
                
                setShowRecruiterLogin(false)
                navigate('/dashboard')
            }else{
                toast.error(data.message)
            }
        }else{

            const formData = new FormData()
            formData.append('name',name)
            formData.append('password',email)
            formData.append('email',email)
            formData.append('image',image)
            
            const {data} = await axios.post(backendUrl + '/api/company/register',formData)
            
            if(data.success){
                console.log(data);
                setCompanyData(data.company)
                setCompanyToken(data.token)
                localStorage.setItem('companyToken',data.token)
                setShowRecruiterLogin(false)
                navigate('/dashboard')
            }else{
                toast.error(data.message)
            }
        }
    }catch(error){
        toast.error(error.message)
    }






  }

  useEffect(()=>{
    document.body.style.overflow = 'hidden'
    return () => {
        document.body.style.overflow = 'unset'
    }
  },[])


  return (
    <div className="fixed inset-0 z-10 bg-black/50 backdrop-blur-sm flex justify-center items-center">
        <form onSubmit={onSubmitHandler} className="relative bg-white p-8 w-full max-w-lg rounded-xl shadow-xl text-gray-700">
            <h1 className="text-center text-3xl font-bold mb-4 text-gray-800">Recruiter {state}</h1>
            <p className="text-center text-sm text-gray-500 mb-6">Welcome back! Please {state.toLowerCase()} to continue.</p>
            { state === "Sign Up" && isTextDataSubmited 
                ? <>
                    {/* Providing Option to Upload Company Logo */}
                    <div className='flex items-center gap-4 my-10'>
                        <label htmlFor='image'>
                            <img className='w-16 rounded-full' src={image ? URL.createObjectURL(image) :  assets.upload_area}></img>
                            <input onChange={e => {
                                    const file = e.target.files[0];
                                    if (file) {
                                    
                                      setImage(file);
                                    }
                                    }
                                } type="file" id='image' hidden/>
                        </label>
                        <p>Upload Company <br /> logo</p>
                    </div>
                </>
                :<div className="space-y-4">
                    {/* Option To Write Company Name in case of Sign Up */}
                    {
                        state !== 'Login' && (
                            
                            <div className="flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-lg hover:shadow-sm">
                                <img src={assets.person_icon} alt="Person Icon" className="w-6 h-6" />
                                <input
                                className="w-full text-sm placeholder-gray-400 focus:outline-none"
                                onChange={(e) => setName(e.target.value)}
                                type="text"
                                placeholder="Company Name"
                                required
                                value={name}
                                />
                            </div>
                        )
                    }
                    
                    <div className="flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-lg hover:shadow-sm">
                        <img src={assets.email_icon} alt="Email Icon" className="w-6 h-6" />
                        <input
                        className="w-full text-sm placeholder-gray-400 focus:outline-none"
                        onChange={(e) => setEmail(e.target.value)}
                        type="email"
                        placeholder="Email Address"
                        required
                        value={email}
                        />
                    </div>
                    <div className="flex items-center gap-3 border border-gray-300 px-4 py-2 rounded-lg hover:shadow-sm">
                        <img src={assets.lock_icon} alt="Lock Icon" className="w-6 h-6" />
                        <input
                        className="w-full text-sm placeholder-gray-400 focus:outline-none"
                        onChange={(e) => setPassword(e.target.value)}
                        type="password"
                        placeholder="Password"
                        required
                        value={password}
                        />
                    </div>
                    
                </div>
            }
            
            {/* Option Only When we are Logging In */}
            { state === "Login" &&  <p className='text-sm text-blue-600 my-4 cursor-pointer'>Forgot password</p>}

            
            
            <button
            className="mt-6 w-full py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:ring focus:ring-blue-200 transition-all duration-200 font-medium"
            type="submit"
            >
            {state === 'Login' ? 'login': isTextDataSubmited ?  'Create Account' :'next'}
            </button>
            {/* Footer */}
            <div className="text-center mt-4 text-sm">
            {state === 'Login' ? (
                <p className='mt-5 text-center'>
                Don't have an account?{' '}
                <span
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => setState('Sign Up')}
                >
                    Sign Up
                </span>
                </p>
            ) : (
                <p className='mt-5 text-center'>
                Already have an account?{' '}
                <span
                    className="text-blue-600 font-semibold cursor-pointer hover:underline"
                    onClick={() => setState('Login')}
                >
                    Login
                </span>
                </p>
            )}
            <img onClick={e => setShowRecruiterLogin(false)} className='absolute top-5 right-5 cursor-pointer' src={assets.cross_icon}></img>
            </div>
        </form>
    </div>
  );
};

export default RecruiterLogin;
