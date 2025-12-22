import { Link } from 'react-router-dom';

const Home = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 p-4">
      <h1 className="text-4xl font-bold mb-6 text-white">Todo App</h1>
      <div className="flex flex-col sm:flex-row gap-4">
        <Link
          to="/login"
          className="bg-blue-600 text-white py-3 px-8 rounded-lg hover:bg-blue-700 transition-colors duration-200 text-center font-semibold"
        >
          Login
        </Link>
        <Link
          to="/signup"
          className="bg-green-600 text-white py-3 px-8 rounded-lg hover:bg-green-700 transition-colors duration-200 text-center font-semibold"
        >
          Sign Up
        </Link>
      </div>
    </div>
  );
};

export default Home;
