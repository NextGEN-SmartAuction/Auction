import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const LoginPage = () => {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [passwordVisible, setPasswordVisible] = useState(false);
    const navigate = useNavigate();

    const togglePasswordVisibility = () => {
        setPasswordVisible(!passwordVisible);
    };

    const handleFormSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.get(
                `${process.env.REACT_APP_ServerUrl}/login`,
                {
                    params: {
                        identifier: identifier,
                        password: password,
                    },
                    withCredentials: true,
                }
            );

            if (response.data.status === 'success') {
                axios
                    .get(`${process.env.REACT_APP_ServerUrl}/profile`, {
                        withCredentials: true,
                    })
                    .then((response) => {
                        const { username, role } = response.data;
                        localStorage.setItem('loggeduser', username);
                        localStorage.setItem('role', role);
                        navigate(`/${role}`);
                        window.location.reload()
                    })
                    .catch((error) => {
                        console.error('Profile fetch failed:', error);
                    });
            } else {
                toast.error('Login failed', {
                    position: 'bottom-right',
                    autoClose: 1400,
                });
            }
        } catch (error) {
            console.error(error);
            if (error.response?.data?.error === 'UserNotFound') {
                toast.error('User not found', {
                    position: 'bottom-right',
                    autoClose: 1400,
                });
            } else if (error.response?.data?.error === 'IncorrectPassword') {
                toast.error('Incorrect password', {
                    position: 'bottom-right',
                    autoClose: 1400,
                });
            } else {
                toast.error('An error occurred', {
                    position: 'bottom-right',
                    autoClose: 1400,
                });
            }
        }
    };

    return (
        <div className="modal modal-signin position-static d-block py-2">
            <ToastContainer position="bottom-right" autoClose={1400} />
            <div className="modal-dialog">
                <div className="modal-content rounded-4 shadow">
                    <div className="modal-header p-5 pb-4 border-bottom-0">
                        <h1 className="fw-bold mb-0 fs-2">Login Page</h1>
                    </div>
                    <div className="modal-body p-5 pt-0">
                        <form onSubmit={handleFormSubmit}>
                            <div className="form-floating mb-3">
                                <input
                                    type="text"
                                    className="form-control rounded-3"
                                    id="identifier"
                                    name="identifier"
                                    placeholder="Username"
                                    value={identifier}
                                    onChange={(e) => setIdentifier(e.target.value)}
                                />
                                <label htmlFor="identifier">Username</label>
                            </div>

                            <div className="form-floating mb-3">
                                <input
                                    type={passwordVisible ? 'text' : 'password'}
                                    className="form-control rounded-3"
                                    id="password"
                                    name="password"
                                    placeholder="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                                <label htmlFor="password">Password</label>
                            </div>

                            <div className="col-10 d-flex">
                                <input
                                    type="checkbox"
                                    className="form-check-input mx-2"
                                    id="showConfirmPassword"
                                    onChange={togglePasswordVisibility}
                                />
                                <p>Show password</p>
                            </div>
                            <button className="w-100 mb-2 btn btn-lg rounded-3 btn-primary" type="submit">
                                Login
                            </button>
                        </form>

                        <br />
                        <h6 className="text-muted">
                            Don't have an account? <Link to="/signup">Signup</Link>
                        </h6>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LoginPage;
