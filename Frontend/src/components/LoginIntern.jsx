import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import axios from "axios"
import {useNavigate} from "react-router-dom"
import {authAction} from '../store/auth'
import {useDispatch} from 'react-redux'


const LoginIntern = () => {
    const [Values,setValues] = useState({
      name:"",DOB:"",
   })
   const [error, setError] = useState(null); 
  const [loading, setLoading] = useState(false); 


  const [inputType, setInputType] = useState('Password'); // Initially set to 'text'
  
   const navigate = useNavigate()
   const dispatch = useDispatch()
   
   const change= (e)=>{
    const {name ,value} = e.target;
    setValues({...Values,[name]: value});
  };
  const submit= async (e)=>{
    e.preventDefault();
    setError(null); 
  setLoading(true);
   try {
    if( Values.name ==="" || Values.DOB === "" ){
      alert("All field are required")
    }
    else{
      const response = await axios.post(`http://qodeit.store/api/login-intern`,Values);
      // console.log(response.data)
      

      dispatch(authAction.login())
      
      localStorage.setItem("id", response.data.id)
      localStorage.setItem("token", response.data.token)
      
      navigate("/ProfileIntern")
    }
    
   } catch (error) {
    // Handle the backend error
    if (error.response && error.response.status === 400) {
      // Parse the response to access the message
      const parsedResponse = JSON.parse(error.request.response);
      setError(parsedResponse.message); // Display error from backend
      alert(parsedResponse.message); // Display an alert
    } else {
      setError("Login failed. Please try again."); // Handle other errors
    }
  } finally {
    setLoading(false); // End loading
  }
  }



  const toggleInputType = () => {
    setInputType(prevType => (prevType === 'text' ? 'password' : 'text'));
};
  return (
    <div className='w-full h-[90vh] flex items-center justify-center flex-col'>
           <h1 className='text-3xl font-bold' >INTERN LOGIN </h1>
        <div>
            
        
    <div className='flex items-center justify-center border-8 w-80 h-80' >
    <form className="space-y-6">
       <div>
         <label htmlFor="Username" >
         Username 
         </label>
         <div className="mt-1">
           <input
             id="name"
             name="name"
             type='text'
             autoComplete="name"
             required
             className="p-2 border-2 rounded-md"
             placeholder="Username"
             value={Values.name}
             onChange={change}
             
           />
          
         </div>
       </div>

       <div>
            <label htmlFor="DOB" className="block text-sm font-medium">
                Date Of Birth (Don't use "<span className='text-red-500' >/</span>")
            </label>
            <div className="relative mt-1">
                <input
                    id="DOB"
                    name="DOB"
                    type={inputType} // Toggle between 'text' and 'password'
                    autoComplete="current-DOB"
                    required
                    className="w-full p-2 pr-10 border-2 rounded-md" // Added padding to the right
                    placeholder="ddmmyyyy"
                    value={Values.DOB}
                    onChange={change}
                />
                <button 
                    type="button" 
                    onClick={toggleInputType} 
                    className="absolute inset-y-0 right-0 px-3 py-1 text-sm bg-gray-200 rounded-r-md"
                >
                    {inputType === 'text' ? <i className="ri-eye-fill"></i> : <i className="ri-eye-close-fill"></i>}
                </button>
            </div>
        </div>

       <div>
         <button
           type="submit"
           className="w-24 h-10 text-white rounded-md bg-zinc-700"
           onClick={submit}
           >
           Sign in
         </button>
       </div>
     </form>
    </div>
     <div className='flex items-center justify-between gap-5 p-3 mt-2 border-8' >
<p>Create An Account</p>
      <Link className='flex items-center justify-center w-24 h-10 text-white rounded-md bg-zinc-700' to={"/SigninIntern"} >Sign In</Link>
      </div>
      </div>
     
   </div>
   
  )
}

export default LoginIntern
