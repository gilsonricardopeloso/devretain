import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Define schema for form validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Landing = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState<LoginFormData>({
    email: '',
    password: '',
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const validateForm = () => {
    try {
      loginSchema.parse(formData);
      setErrors({});
      return true;
    } catch (error) {
      if (error instanceof z.ZodError) {
        const newErrors: Record<string, string> = {};
        error.errors.forEach((err) => {
          if (err.path) {
            newErrors[err.path[0]] = err.message;
          }
        });
        setErrors(newErrors);
      }
      return false;
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;
    
    setIsLoading(true);
    
    try {
      const response = await axios.post('http://localhost:3000/auth/login', formData);
      
      // Store the token in localStorage
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      // Redirect based on user role
      if (response.data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setErrors({ general: 'Invalid credentials. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="container mx-auto p-6">
        <div className="flex justify-between items-center">
          <h1 className="text-3xl font-bold text-primary-800">DevRetain</h1>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto flex items-center justify-center px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">Technical Knowledge Retention System</h2>
            <p className="text-lg text-gray-700">
              Preserve, document, and transfer critical technical knowledge within your organization.
              Reduce the impact of losing key technical staff and accelerate onboarding.
            </p>
            <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>Map knowledge concentration and vulnerabilities</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>Document decisions and technical context</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>Structure offboarding knowledge transfer</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>Accelerate new hire onboarding</span>
              </li>
            </ul>
          </div>
          
          <div className="bg-white p-8 rounded-xl shadow-lg">
            <h3 className="text-2xl font-bold mb-6 text-center">Login to Your Account</h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                  placeholder="you@example.com"
                />
                {errors.email && (
                  <p className="mt-1 text-sm text-red-600">{errors.email}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-primary-500 focus:border-primary-500"
                />
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    Remember me
                  </label>
                </div>
                
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Forgot password?
                </a>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </button>
              
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">Don't have an account? </span>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  Contact your administrator
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <footer className="container mx-auto p-6 text-center text-gray-600 text-sm">
        &copy; {new Date().getFullYear()} DevRetain. All rights reserved.
      </footer>
    </div>
  );
};

export default Landing; 