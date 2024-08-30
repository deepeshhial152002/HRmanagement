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
            // Redirect to the protected route
            navigate('/gjasdjagsfkuhaskufhas');
        } else {
            alert('Incorrect username or password');
        }
    };

    const toggleInputType = () => {
        setInputType((prevType) => (prevType === 'password' ? 'text' : 'password'));
    };

    return (
        <div className="flex flex-col items-center justify-center min-h-screen px-4">
            <h1 className="mb-8 text-3xl font-bold text-center">Admin Login</h1>
            <div className="w-full max-w-md p-8 bg-white border-8 rounded-lg shadow-md md:p-11">
                <form className="space-y-6" onSubmit={handleLogin}>
                    <div>
                        <label htmlFor="username" className="block text-sm font-medium text-gray-700">Username</label>
                        <input
                            id="username"
                            name="username"
                            type="text"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            required
                            className="block w-full p-2 mt-1 border-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                        />
                    </div>

                    <div>
                        <label htmlFor="password" className="block text-sm font-medium text-gray-700">Password</label>
                        <div className="relative mt-1">
                            <input
                                id="password"
                                name="password"
                                type={inputType}
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="block w-full p-2 pr-10 border-2 rounded-md focus:ring-blue-500 focus:border-blue-500"
                            />
                            <button
                                type="button"
                                onClick={toggleInputType}
                                className="absolute inset-y-0 right-0 flex items-center px-3 py-1 text-sm bg-gray-200 rounded-r-md focus:outline-none"
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
                        className="w-full py-2 text-white rounded-md bg-zinc-700 hover:bg-zinc-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-zinc-600"
                    >
                        Login
                    </button>
                </form>
            </div>
        </div>
    );
};

export default AdmineLogin;
