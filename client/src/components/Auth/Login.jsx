import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link, useNavigate } from 'react-router-dom';
import InputField from './InputField';
import { FaSpinner } from 'react-icons/fa';
import { login } from '../../redux/auth/action';

export const Login = () => {

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { loading, error, token } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    dispatch(login(email, password));
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (!email) {
      newErrors.email = "Email is required";
      isValid = false;
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = "Please enter a valid email address";
      isValid = false;
    }

    if (!password) {
      newErrors.password = "Password is required";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  useEffect(() => {
    if (token) navigate("/");
  }, [token, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Log In</h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="Email-id"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email id"
            error={errors.email}
          />
          <InputField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Password"
            error={errors.password}
          />

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            {loading ? 'Logging in...' : 'Submit'}
          </button>
        </form>

        <div className="text-center mt-4">
          Not a user?
          <Link to="/register" className="text-sky-400 ml-1"> Register</Link>
        </div>
      </div>
    </div>
  );
};

export default Login;