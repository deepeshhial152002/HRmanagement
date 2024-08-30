import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { authAction } from '../store/auth';
import { useDispatch } from 'react-redux';

const LoginHR = () => {
  const [Values, setValues] = useState({ Username: '', password: '' });
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [inputType, setInputType] = useState('password'); 

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
      if (Values.Username === '' || Values.password === '') {
        alert('All fields are required');
      } else {
        const response = await axios.post('http://qodeit.store/api/login', Values);

        dispatch(authAction.login());
        localStorage.setItem('id', response.data.id);
        localStorage.setItem('token', response.data.token);

        navigate('/ProfileHR');
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
    <div className="flex flex-col items-center justify-center w-full h-screen p-4 bg-gray-100">
      <h1 className="mb-6 text-3xl font-bold">HR LOGIN</h1>
      <div className="w-full max-w-sm p-8 bg-white rounded-lg shadow-md">
        <form className="space-y-6" onSubmit={submit}>
          <div>
            <label htmlFor="Username" className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <div className="mt-1">
              <input
                id="Username"
                name="Username"
                type="text"
                autoComplete="username"
                required
                className="w-full p-2 border-2 rounded-md"
                placeholder="Username"
                value={Values.Username}
                onChange={change}
              />
            </div>
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative mt-1">
              <input
                id="password"
                name="password"
                type={inputType}
                autoComplete="current-password"
                required
                className="w-full p-2 pr-10 border-2 rounded-md"
                placeholder="Password"
                value={Values.password}
                onChange={change}
              />
              <button
                type="button"
                onClick={toggleInputType}
                className="absolute inset-y-0 right-0 flex items-center px-3 py-1 text-sm bg-gray-200 rounded-r-md"
              >
                {inputType === 'text' ? (
                  <i className="ri-eye-fill"></i>
                ) : (
                  <i className="ri-eye-close-fill"></i>
                )}
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
    </div>
  );
};

export default LoginHR;
