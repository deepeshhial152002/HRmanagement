import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const AdmineLogin = () => {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');


    const [inputType, setInputType] = useState('password');

    
    const navigate = useNavigate();

    const hardcodedUsername = 'admin';
    const hardcodedPassword = 'admin123';

    const handleLogin = (e) => {
        e.preventDefault();

        // Check if the entered username and password match the hardcoded credentials
        if (username === hardcodedUsername && password === hardcodedPassword) {
            // Set a flag in localStorage to indicate the user is logged in
          
            // Redirect to the protected route
            navigate('/gjasdjagsfkuhaskufhas');
        } else {
            alert('Incorrect username or password');
        }
    };

    const toggleInputType = () => {
        setInputType(prevType => (prevType === 'password' ? 'text' : 'password'));
    };

    return (
        <div className="flex flex-col items-center justify-center h-screen">
             <h1 className='text-3xl font-bold' >Admin LOGIN</h1>
            <div className='border-8 p-11 ' >
                
           
            <form className="space-y-6 w-96" onSubmit={handleLogin}>
                <div>
                    <label htmlFor="username">Username</label>
                    <input
                        id="username"
                        name="username"
                        type="text"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                        className="block w-full p-2 mt-1 border-2 rounded-md"
                    />
                </div>

                <div>
            <label htmlFor="password">Password</label>
            <div className="relative mt-1"> {/* Added relative positioning */}
                <input
                    id="password"
                    name="password"
                    type={inputType}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="block w-full p-2 pr-10 border-2 rounded-md" // Added padding to the right
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

                <button
                    type="submit"
                    className="w-full py-2 text-white rounded bg-zinc-700"
                >
                    Login
                </button>
            </form>
            </div>
        </div>
    );
};

export default AdmineLogin;
