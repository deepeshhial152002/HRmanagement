import React, { useEffect, useState } from 'react'
import {Link, useNavigate} from "react-router-dom"
import {authAction} from '../store/auth'
import {useDispatch} from 'react-redux'
import axios from "axios"
const SigninIntern = () => {
    const [HrNameAndId,setHrNameAndId] = useState([])
    const [formValues, setFormValues] = useState({
        name: '',
       
        DOB:'',
        hrID: ''
    }); 
    const [error, setError] = useState(null); 
    const [loading, setLoading] = useState(false); 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    useEffect(() => {
       
            const fetchProfile = async () => {
                try {
                    const response = await axios.get(`http://qodeit.store/api/v1/getall-hr`,);
                    setHrNameAndId(response.data.data);
                } catch (error) {
                    console.error("Error fetching profile data", error);
                }
            };
            fetchProfile();
        
    }, []);
 // console.log(HrNameAndId)
 
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormValues({ ...formValues, [name]: value });
    };



    const handleSubmit = (e) => {
        e.preventDefault();
        // Submit form logic
        console.log(formValues);
    };





    const submit= async (e)=>{
        e.preventDefault();
        setError(null); 
      setLoading(true);
       try {
        if( formValues.name ==="" || formValues.DOB === "" || formValues.hrID === ""){
          alert("All field are required")
        }
        else{
          const response = await axios.post(`http://qodeit.store/api/v1/sign-up-intern`,formValues);
          console.log(response.data)
          
    
          alert(response.data.message)
          navigate("/LoginIntern")
          
          
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
   
  return (
    <div className="flex flex-col items-center justify-center h-screen">
        <h1 className='text-3xl font-bold' >INTERN Sign Up</h1>
        <div className='border-8 p-7' >
            
    <form className="space-y-6 w-96" onSubmit={handleSubmit}>
        <div  >
            <label htmlFor="username">Username (please enter your Full Name)</label>
            <input
            placeholder='username'
                id="name"
                name="name"
                type="text"
                value={formValues.name}
                onChange={handleChange}
                required
                className="block w-full p-1 mt-1 border-2 rounded-md"
            />
        </div>

     

        <div>
       
            <label htmlFor="DOB"> Date Of Birth  (Dont use "<span className='text-red-500' >/</span>")  </label>
            <input
            placeholder='ddmmyyyy'
                id="DOB"
                name="DOB"
                type="text"
                value={formValues.DOB}
                onChange={handleChange}
                required
                className="block w-full p-1 mt-1 border-2 rounded-md"
            />
        </div>

        <div>
            <label htmlFor="hrID">Select HR</label>
            <select
                id="hrID"
                name="hrID"
                value={formValues.hrID}
                onChange={handleChange}
                required
                className="block w-full p-1 mt-1 border-2 rounded-md"
            >
                <option value="" disabled>Select an HR</option>
                {HrNameAndId.map((hr) => (
                    <option key={hr._id} value={hr._id}>
                        {hr.Username}
                    </option>
                ))}
            </select>
        </div>

        <button
            type="submit"
            className="w-full py-2 text-white rounded-md bg-zinc-700"
            onClick={submit}
        >
            Sign In
        </button>
    </form>
    <div className='mt-2' >

    <p>already a user  <Link className='text-blue-400 hover:text-blue-600' to={"/LoginIntern"} >Login</Link></p>
    </div>
    </div>
    
</div>
  )
}

export default SigninIntern
