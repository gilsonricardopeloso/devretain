import { useState } from 'react';
import { z } from 'zod';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { LanguageSelector } from '../components/LanguageSelector';

// Define schema for form validation
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

type LoginFormData = z.infer<typeof loginSchema>;

const Landing = () => {
  const { t } = useTranslation();
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
      
      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      
      if (response.data.user.role === 'admin') {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (error) {
      setErrors({ general: t('auth.errors.invalidCredentials') });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex flex-col bg-gradient-to-br from-blue-50 to-indigo-100">
      <header className="w-full px-4 py-4 md:px-8 md:py-6 flex items-center justify-between">
        <h1 className="text-2xl md:text-3xl font-bold text-primary-800">DevRetain</h1>
        <LanguageSelector />
      </header>
      
      <main className="flex-grow container mx-auto flex items-center justify-center px-2 py-2">
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8 w-full max-w-5xl">
          <div className="flex flex-col justify-center space-y-6">
            <h2 className="text-4xl font-bold text-gray-900">
              {t('landing.title')}
            </h2>
             <p className="text-lg text-gray-700">
              {t('landing.description')}
            </p>
             <ul className="space-y-2">
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>{t('landing.features.knowledgeMap')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>{t('landing.features.documentation')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>{t('landing.features.knowledgeTransfer')}</span>
              </li>
              <li className="flex items-start">
                <span className="mr-2 text-primary-600">✓</span>
                <span>{t('landing.features.onboarding')}</span>
              </li>
            </ul>
          </div>
          
          <div className="flex-1 w-full max-w-md bg-white p-6 md:p-8 rounded-none md:rounded-xl shadow-lg mx-0 md:mx-4 my-0 md:my-8">
            <h3 className="text-xl md:text-2xl font-bold mb-6 text-center">
              {t('auth.login.title')}
            </h3>
            
            <form onSubmit={handleSubmit} className="space-y-4">
              {errors.general && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                  {errors.general}
                </div>
              )}
              
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  {t('auth.login.email')}
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
                  {t('auth.login.password')}
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
              
              <div className="flex flex-col sm:flex-row items-center justify-between gap-2">
                <div className="flex items-center">
                  <input
                    id="remember-me"
                    name="remember-me"
                    type="checkbox"
                    className="h-4 w-4 text-primary-600 border-gray-300 rounded focus:ring-primary-500"
                  />
                  <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700">
                    {t('auth.login.rememberMe')}
                  </label>
                </div>
                
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  {t('auth.login.forgotPassword')}
                </a>
              </div>
              
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-2 px-4 bg-primary-600 hover:bg-primary-700 text-white font-medium rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
              >
                {isLoading ? t('auth.login.loading') : t('auth.login.submit')}
              </button>
              
              <div className="text-center mt-4">
                <span className="text-sm text-gray-600">{t('auth.login.noAccount')} </span>
                <a href="#" className="text-sm text-primary-600 hover:text-primary-700">
                  {t('auth.login.contactAdmin')}
                </a>
              </div>
            </form>
          </div>
        </div>
      </main>
      
      <footer className="w-full px-2 py-2 md:px-6 md:py-2 text-center text-gray-600 text-sm mt-0">
        {t('common.footer.copyright', { year: new Date().getFullYear() })}
      </footer>
    </div>
  );
};

export default Landing; 