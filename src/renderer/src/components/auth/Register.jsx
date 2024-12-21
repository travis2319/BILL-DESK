import { useState, useEffect } from 'react';
import { Link, useNavigate,useLocation } from 'react-router-dom';

const Register = () => {
  const [userData, setUserData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  },);
  
  const navigate = useNavigate();
  const location = useLocation();

  // useEffect(() => {
  //   const timeout = setTimeout(() => {
  //     console.log("event resize");
  //     window.dispatchEvent(new Event('resize'));
  //   }, 100);
  
  //   return () => clearTimeout(timeout);
  // }, []);

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setUserData(prevState => ({
      ...prevState,
      [id]: value
    }));
  };

  const handleUserData = async (e) => {
    e.preventDefault();

    // Basic validation
    if (userData.password !== userData.confirmPassword) {
      alert('Passwords do not match');
      return;
    }

    try {
      const result = await window.electron.ipcRenderer.invoke(
        'auth-create-user', 
        userData.name, 
        userData.email, 
        userData.password
      );

      console.log(result.message);
      alert(result.message);
      console.log('Route changed to:', location.pathname);
      // Reset form and redirect after successful registration
      setUserData({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
      });
      navigate('/'); // Redirect to login page
    } catch (err) {
      console.error('Error inserting data:', err);
      alert('Failed to insert data');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-300">
      <div className="w-full max-w-md p-6 bg-white rounded-lg shadow-md">
        <h1 className="text-2xl font-bold text-center mb-6">Register</h1>
        <form onSubmit={handleUserData}>
          <div className="mb-4">
            <label htmlFor="name" className="block text-sm font-medium text-gray-700">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              value={userData.name}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your full name"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
              Email
            </label>
            <input
              type="email"
              id="email"
              value={userData.email}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Enter your email"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type="password"
              id="password"
              value={userData.password}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Create a password"
              required
            />
          </div>
          <div className="mb-6">
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={userData.confirmPassword}
              onChange={handleInputChange}
              className="w-full px-4 py-2 mt-1 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
              placeholder="Confirm your password"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full px-4 py-2 text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring focus:ring-blue-300"
          >
            Register
          </button>
        </form>
        <p className="mt-4 text-sm text-center text-gray-600">
          Already have an account?{' '}
          <Link to="/" className="text-blue-500 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
