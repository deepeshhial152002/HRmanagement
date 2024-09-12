import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authAction } from '../store/auth';
import { useDispatch } from 'react-redux';

const LoginIntern = () => {
  const [Values, setValues] = useState({ name: '', DOB: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('password'); // Initially set to 'password'

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const change = (e) => {
    const { name, value } = e.target;
    setValues({ ...Values, [name]: value });
  };

  const submit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      if (Values.name === '' || Values.DOB === '') {
        alert('All fields are required');
      } else {
        const response = await axios.post(`http://qodeit.store/api/login-intern`, Values);
        // const response = await axios.post(`http://localhost:3007/api/login-intern`, Values);

        dispatch(authAction.login());

        localStorage.setItem('id', response.data.id);
        localStorage.setItem('token', response.data.token);

        navigate('/ProfileIntern');
      }
    } catch (error) {
      if (error.response && error.response.status === 400) {
        const parsedResponse = JSON.parse(error.request.response);
        setError(parsedResponse.message);
        alert(parsedResponse.message);
      } else {
        setError('Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const toggleInputType = () => {
    setInputType((prevType) => (prevType === 'text' ? 'password' : 'text'));
  };

  return (
    <div className="flex flex-col items-center justify-center w-full min-h-screen p-4 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">INTERN LOGIN</h1>
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label htmlFor="Username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="name"
                name="name"
                type="text"
                autoComplete="name"
                required
                className="w-full p-2 border-2 rounded-md"
                placeholder="Username"
                value={Values.name}
                onChange={change}
              />
            </div>
          </div>

          <div>
            <label htmlFor="DOB" className="block text-sm font-medium text-gray-700">
              Date Of Birth (Don't use "<span className="text-red-500">/</span>")
            </label>
            <div className="relative mt-1">
              <input
                id="DOB"
                name="DOB"
                type={inputType}
                autoComplete="current-DOB"
                required
                className="w-full p-2 pr-10 border-2 rounded-md"
                placeholder="ddmmyyyy"
                value={Values.DOB}
                onChange={change}
              />
              <button
                type="button"
                onClick={toggleInputType}
                className="absolute inset-y-0 right-0 flex items-center px-3 py-1 text-sm bg-gray-200 rounded-r-md"
              >
                {inputType === 'text' ? <i className="ri-eye-fill"></i> : <i className="ri-eye-close-fill"></i>}
              </button>
            </div>
          </div>

          <div>
            <button
              type="submit"
              className="w-full h-10 text-white transition rounded-md bg-zinc-700 hover:bg-zinc-800"
              disabled={loading}
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </div>

          {error && <p className="text-sm text-red-500">{error}</p>}
        </form>
      </div>

      <div className="flex items-center justify-between w-full max-w-sm gap-4 p-3 mt-4 text-center bg-white rounded-lg shadow-md">
        <p>Create An Account</p>
        <Link
          className="w-full h-10 text-white transition rounded-md bg-zinc-700 hover:bg-zinc-800"
          to="/SigninIntern"
        >
          Sign up
        </Link>
      </div>
    </div>
  );
};

export default LoginIntern;
