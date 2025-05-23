import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelector } from '../components/LanguageSelector';

// Mock data for the dashboard
const knowledgeData = [
  { id: 1, area: 'Frontend Architecture', level: 4, owner: 'John Doe', vulnerabilityScore: 8 },
  { id: 2, area: 'Backend API Design', level: 5, owner: 'Jane Smith', vulnerabilityScore: 3 },
  { id: 3, area: 'Database Optimization', level: 3, owner: 'John Doe', vulnerabilityScore: 7 },
  { id: 4, area: 'Security Protocols', level: 4, owner: 'Alice Johnson', vulnerabilityScore: 5 },
  { id: 5, area: 'CI/CD Pipeline', level: 5, owner: 'Bob Williams', vulnerabilityScore: 2 },
  { id: 6, area: 'Microservices Architecture', level: 2, owner: 'John Doe', vulnerabilityScore: 9 }
];

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { initializeLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    // Check if user is authenticated and is admin
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    if (parsedUser.role !== 'admin') {
      navigate('/profile');
    }
  }, [navigate]);

  useEffect(() => {
    // Inicializa o idioma ao carregar o dashboard
    initializeLanguage();
  }, [initializeLanguage]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) return null;

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-800">DevRetain</h1>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            <div className="text-sm">
              <span className="block text-gray-500">{t('dashboard.loggedInAs')}</span>
              <span className="font-semibold">{user.name}</span>
            </div>
            <button
              onClick={handleLogout}
              className="py-1 px-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
            >
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome')}</h2>
          <p className="text-gray-600">{t('dashboard.description')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-primary-600 text-xl font-bold mb-2">6</div>
            <div className="text-gray-500">{t('dashboard.stats.keyKnowledgeAreas')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-yellow-500 text-xl font-bold mb-2">3</div>
            <div className="text-gray-500">{t('dashboard.stats.vulnerabilityAlerts')}</div>
          </div>
          <div className="bg-white rounded-lg shadow p-6">
            <div className="text-green-500 text-xl font-bold mb-2">12</div>
            <div className="text-gray-500">{t('dashboard.stats.technicalDocuments')}</div>
          </div>
        </div>
        
        <div className="bg-white rounded-lg shadow mb-8">
          <div className="p-6 border-b">
            <h3 className="text-lg font-semibold">{t('dashboard.knowledgeHeatMap.title')}</h3>
            <p className="text-sm text-gray-500">{t('dashboard.knowledgeHeatMap.description')}</p>
          </div>
          <div className="p-6">
            <table className="min-w-full divide-y divide-gray-200">
              <thead>
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('dashboard.knowledgeHeatMap.knowledgeArea')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('dashboard.knowledgeHeatMap.expertiseLevel')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('dashboard.knowledgeHeatMap.primaryOwner')}
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    {t('dashboard.knowledgeHeatMap.vulnerability')}
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {knowledgeData.map((item) => (
                  <tr key={item.id}>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900">{item.area}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        {[...Array(5)].map((_, i) => (
                          <svg
                            key={i}
                            className={`h-4 w-4 ${
                              i < item.level ? 'text-primary-500' : 'text-gray-300'
                            }`}
                            fill="currentColor"
                            viewBox="0 0 20 20"
                          >
                            <path
                              fillRule="evenodd"
                              d="M10 15.585l-7.07 3.711 1.351-7.87-5.719-5.573 7.895-1.148L10 0l3.543 7.705 7.895 1.148-5.719 5.573 1.351 7.87L10 15.585z"
                              clipRule="evenodd"
                            />
                          </svg>
                        ))}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{item.owner}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div 
                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          item.vulnerabilityScore > 7
                            ? 'bg-red-100 text-red-800'
                            : item.vulnerabilityScore > 4
                            ? 'bg-yellow-100 text-yellow-800'
                            : 'bg-green-100 text-green-800'
                        }`}
                      >
                        {item.vulnerabilityScore}/10
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">{t('dashboard.recentActivity.title')}</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center">
                    <span className="text-blue-600 text-sm">JM</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">João Moreira</span> {t('dashboard.recentActivity.documented')} {t('dashboard.recentActivity.technicalDecision')} {t('dashboard.recentActivity.on')}{' '}
                      <span className="font-medium">Frontend Architecture</span>
                    </p>
                    <p className="text-xs text-gray-500">{t('dashboard.recentActivity.timeAgo')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                    <span className="text-green-600 text-sm">CO</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Cecilia Oliveira</span> {t('dashboard.recentActivity.completed')} {t('dashboard.recentActivity.knowledgeTransfer')} {t('dashboard.recentActivity.for')}{' '}
                      <span className="font-medium">Security Protocols</span>
                    </p>
                    <p className="text-xs text-gray-500">{t('dashboard.recentActivity.timeAgo')}</p>
                  </div>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-purple-100 flex items-center justify-center">
                    <span className="text-purple-600 text-sm">BW</span>
                  </div>
                  <div>
                    <p className="text-sm">
                      <span className="font-medium">Bob Williams</span> {t('dashboard.recentActivity.updated')} {t('dashboard.recentActivity.documentation')} {t('dashboard.recentActivity.on')}{' '}
                      <span className="font-medium">CI/CD Pipeline</span>
                    </p>
                    <p className="text-xs text-gray-500">{t('dashboard.recentActivity.timeAgo')}</p>
                  </div>
                </li>
              </ul>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow">
            <div className="p-6 border-b">
              <h3 className="text-lg font-semibold">{t('dashboard.recommendedActions.title')}</h3>
            </div>
            <div className="p-6">
              <ul className="space-y-4">
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-red-100 flex items-center justify-center text-red-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">
                      {t('dashboard.recommendedActions.highRisk')}
                    </p>
                  </div>
                  <button className="text-xs font-medium text-white hover:text-gray-100">
                    {t('dashboard.recommendedActions.scheduleNow')}
                  </button>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-yellow-100 flex items-center justify-center text-yellow-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">
                      {t('dashboard.recommendedActions.mediumRisk')}
                    </p>
                  </div>
                  <button className="text-xs font-medium text-white hover:text-gray-100">
                    {t('dashboard.recommendedActions.assignTask')}
                  </button>
                </li>
                <li className="flex items-start space-x-3">
                  <div className="flex-shrink-0 h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                    <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </div>
                  <div className="flex-grow">
                    <p className="text-sm font-medium">
                      {t('dashboard.recommendedActions.integrateKnowledge')}
                    </p>
                  </div>
                  <button className="text-xs font-medium text-white hover:text-gray-100">
                    {t('dashboard.recommendedActions.viewDetails')}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </main>
      
      <footer className="bg-white border-t">
        <div className="container mx-auto px-6 py-4 text-center text-gray-500 text-sm">
          {t('common.footer.copyright', { year: new Date().getFullYear() })}
        </div>
      </footer>
    </div>
  );
};

export default Dashboard; 