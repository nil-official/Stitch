import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import InputField from './InputField';
import { FaSpinner } from 'react-icons/fa';
import { register } from '../../redux/auth/action';
import { AUTH_ROUTES } from '../../routes/routePaths';

function Register() {

  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errors, setErrors] = useState({});
  const dispatch = useDispatch();
  const { loading, error, message } = useSelector((state) => state.auth);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validateInputs()) return;
    dispatch(register(firstName, lastName, email, password));
  };

  const validateInputs = () => {
    let isValid = true;
    const newErrors = {};

    if (!firstName) {
      newErrors.firstName = "First name is required";
      isValid = false;
    }

    if (!lastName) {
      newErrors.lastName = "Last name is required";
      isValid = false;
    }

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
    } else if (password.length < 8 || password.length > 16) {
      newErrors.password = "Password must be between 8 and 16 characters";
      isValid = false;
    }

    setErrors(newErrors);
    return isValid;
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-lg bg-white p-6 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center mb-6">Register</h2>

        <form onSubmit={handleSubmit}>
          <InputField
            label="First Name"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
            error={errors.firstName}
          />

          <InputField
            label="Last Name"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
            error={errors.lastName}
          />

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
            placeholder="Password (8-16 characters)"
            error={errors.password}
          />

          {error && <p className="text-red-500 text-center mb-4">{error}</p>}
          {message && <p className="text-green-500 text-center mb-4">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center"
          >
            {loading ? (
              <FaSpinner className="animate-spin mr-2" />
            ) : null}
            {loading ? 'Registering...' : 'Register'}
          </button>
        </form>

        <Link to={AUTH_ROUTES.LOGIN}>
          <button
            disabled={loading}
            className="mt-2 w-full bg-gray-800 text-white py-2 rounded-lg hover:bg-gray-900 transition duration-200 flex items-center justify-center"
          >
            Back to Login
          </button>
        </Link>
      </div>
    </div>
  );
}

export default Register;