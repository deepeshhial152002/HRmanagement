import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAction } from '../store/auth';
import { useDispatch } from 'react-redux';
import axios from 'axios';

const SigninIntern = () => {
  const [HrNameAndId, setHrNameAndId] = useState([]);
  const [formValues, setFormValues] = useState({
    name: '',
    DOB: '',
    hrID: ''
  });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`http://qodeit.store/api/getall-hr`);
        setHrNameAndId(response.data.data);
      } catch (error) {
        console.error('Error fetching profile data', error);
      }
    };
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormValues({ ...formValues, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (formValues.name === '' || formValues.DOB === '' || formValues.hrID === '') {
        alert('All fields are required');
      } else {
        const response = await axios.post(`http://qodeit.store/api/sign-up-intern`, formValues);
        console.log('Response:', response.data);
        alert(response.data.message);
        navigate('/LoginIntern');
      }
    } catch (error) {
      console.error('Sign up error:', error);
      if (error.response) {
        // Handle errors from the server
        if (error.response.status === 400) {
          try {
            const parsedResponse = JSON.parse(error.request.response);
            setError(parsedResponse.message);
            alert(parsedResponse.message);
          } catch (e) {
            console.error('Error parsing response:', e);
          }
        } else {
          setError('Sign up failed. Please try again.');
        }
      } else {
        setError('Sign up failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <div className="flex flex-col items-center justify-center min-h-screen px-4 py-8 sm:px-6 lg:px-8">
      <h1 className="text-2xl font-bold text-center sm:text-3xl">INTERN Sign Up</h1>
      <div className="w-full max-w-md p-6 mt-8 bg-white rounded-md shadow-md sm:max-w-lg">
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label htmlFor="name" className="block text-sm font-medium">
              Username (please enter your Full Name)
            </label>
            <input
              placeholder="Username"
              id="name"
              name="name"
              type="text"
              value={formValues.name}
              onChange={handleChange}
              required
              className="block w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="DOB" className="block text-sm font-medium">
              Date Of Birth (Don't use "<span className='text-red-500'>/</span>")
            </label>
            <input
              placeholder="ddmmyyyy"
              id="DOB"
              name="DOB"
              type="text"
              value={formValues.DOB}
              onChange={handleChange}
              required
              className="block w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

          <div>
            <label htmlFor="hrID" className="block text-sm font-medium">
              Select HR
            </label>
            <select
              id="hrID"
              name="hrID"
              value={formValues.hrID}
              onChange={handleChange}
              required
              className="block w-full p-2 mt-1 border rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>
                Select an HR
              </option>
              {HrNameAndId.map((hr) => (
                <option key={hr._id} value={hr._id}>
                  {hr.Username}
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2 text-white rounded-md bg-zinc-700 hover:bg-zinc-600"
            disabled={loading}
          >
            {loading ? 'Signing up...' : 'Sign up'}
          </button>
        </form>
        <div className="mt-4 text-center">
          <p>
            Already a user?{' '}
            <Link className="text-blue-400 hover:text-blue-600" to="/LoginIntern">
              Login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default SigninIntern;
