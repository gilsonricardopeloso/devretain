import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelector } from '../components/LanguageSelector';

// Mock data for the user profile
const knowledgeAreas = [
  { id: 1, name: 'Frontend Architecture', level: 3, lastUpdated: '2023-04-15' },
  { id: 2, name: 'React Component Design', level: 4, lastUpdated: '2023-05-22' },
  { id: 3, name: 'API Integration', level: 3, lastUpdated: '2023-03-10' },
  { id: 4, name: 'Unit Testing', level: 2, lastUpdated: '2023-01-30' },
];

const careerMilestones = [
  { id: 1, title: 'Senior Developer Certification', completed: true, date: '2023-02-15' },
  { id: 2, title: 'Technical Leadership Workshop', completed: true, date: '2023-04-10' },
  { id: 3, title: 'System Architecture Certification', completed: false, plannedDate: '2023-08-20' },
  { id: 4, title: 'Team Lead Position', completed: false, plannedDate: '2023-12-01' },
];

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { initializeLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  
  useEffect(() => {
    // Check if user is authenticated
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    // If user is admin, we could redirect to dashboard here
  }, [navigate]);
  
  useEffect(() => {
    // Inicializa o idioma ao carregar o profile
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
          <h2 className="text-2xl font-bold mb-2">{t('profile.title')}</h2>
          <p className="text-gray-600">{t('profile.description')}</p>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="md:col-span-1">
            <div className="bg-white rounded-lg shadow p-6 mb-6">
              <div className="flex items-center space-x-4 mb-4">
                <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold">
                  {user.name.split(' ').map((name: string) => name[0]).join('')}
                </div>
                <div>
                  <h3 className="text-lg font-bold">{user.name}</h3>
                  <p className="text-gray-500">Software Developer</p>
                </div>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-1">{t('profile.email')}</p>
                <p className="font-medium">{user.email}</p>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-1">{t('profile.department')}</p>
                <p className="font-medium">Engineering</p>
              </div>
              <div className="border-t pt-4 mt-4">
                <p className="text-sm text-gray-500 mb-1">{t('profile.joined')}</p>
                <p className="font-medium">January 15, 2022</p>
              </div>
              <div className="mt-6">
                <button className="w-full text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 py-2 px-3 rounded-md">
                  {t('profile.editProfile')}
                </button>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold mb-4">{t('profile.skillsAssessment.title')}</h3>
              <div className="space-y-4">
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{t('profile.skillsAssessment.technicalKnowledge')}</span>
                    <span className="text-sm font-medium">85%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '85%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{t('profile.skillsAssessment.documentation')}</span>
                    <span className="text-sm font-medium">70%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '70%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{t('profile.skillsAssessment.knowledgeSharing')}</span>
                    <span className="text-sm font-medium">65%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '65%' }}></div>
                  </div>
                </div>
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <span className="text-sm font-medium">{t('profile.skillsAssessment.mentoring')}</span>
                    <span className="text-sm font-medium">60%</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div className="bg-primary-600 h-2 rounded-full" style={{ width: '60%' }}></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          
          <div className="md:col-span-2 space-y-6">
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">{t('profile.knowledgeAreas.title')}</h3>
                <p className="text-sm text-gray-500">{t('profile.knowledgeAreas.description')}</p>
              </div>
              <div className="p-6">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('profile.knowledgeAreas.knowledgeArea')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('profile.knowledgeAreas.expertiseLevel')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('profile.knowledgeAreas.lastUpdated')}
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        {t('profile.knowledgeAreas.actions')}
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {knowledgeAreas.map((area) => (
                      <tr key={area.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{area.name}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <svg
                                key={i}
                                className={`h-4 w-4 ${
                                  i < area.level ? 'text-primary-500' : 'text-gray-300'
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
                          <div className="text-sm text-gray-500">{area.lastUpdated}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <a href="#" className="text-primary-600 hover:text-primary-900 mr-4">
                            {t('profile.knowledgeAreas.update')}
                          </a>
                          <a href="#" className="text-primary-600 hover:text-primary-900">
                            {t('profile.knowledgeAreas.document')}
                          </a>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                <div className="mt-6 flex justify-center">
                  <button className="text-sm bg-primary-600 text-white hover:bg-primary-700 py-2 px-4 rounded-md">
                    {t('profile.knowledgeAreas.addKnowledgeArea')}
                  </button>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow">
              <div className="p-6 border-b">
                <h3 className="text-lg font-bold">{t('profile.careerPathway.title')}</h3>
                <p className="text-sm text-gray-500">{t('profile.careerPathway.description')}</p>
              </div>
              <div className="p-6">
                <div className="relative">
                  {careerMilestones.map((milestone, index) => (
                    <div key={milestone.id} className="mb-8 flex items-start">
                      <div className="flex flex-col items-center mr-4">
                        <div 
                          className={`rounded-full h-8 w-8 flex items-center justify-center ${
                            milestone.completed ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                          }`}
                        >
                          {milestone.completed ? (
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                              <path
                                fillRule="evenodd"
                                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                                clipRule="evenodd"
                              />
                            </svg>
                          ) : (
                            <span>{index + 1}</span>
                          )}
                        </div>
                        {index < careerMilestones.length - 1 && (
                          <div className="h-full w-0.5 bg-gray-200 my-2"></div>
                        )}
                      </div>
                      <div className="bg-gray-50 rounded-lg p-4 flex-grow">
                        <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                        <p className="text-sm text-gray-500">
                          {milestone.completed 
                            ? `${t('profile.careerPathway.completedOn')} ${milestone.date}` 
                            : `${t('profile.careerPathway.plannedFor')} ${milestone.plannedDate}`}
                        </p>
                        {!milestone.completed && (
                          <button className="mt-2 text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 py-1 px-2 rounded">
                            {t('profile.careerPathway.startWorking')}
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
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

export default Profile; 