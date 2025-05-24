import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelector } from '../components/LanguageSelector';
import { authService, UserProfile, ProfileKnowledgeArea, ProfileCareerMilestone } from '../lib/api';
import { LogOut, BookOpen, Target, Loader2, AlertCircle, Edit3, PlusCircle } from 'lucide-react'; // Assuming icons

const Profile = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { initializeLanguage } = useLanguage();
  
  const [userFromLocalStorage, setUserFromLocalStorage] = useState<any>(null); // For header display initially
  const [profileData, setProfileData] = useState<UserProfile | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    setUserFromLocalStorage(JSON.parse(storedUser));

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        const data = await authService.getProfile();
        setProfileData(data);
        setError(null);
      } catch (err) {
        setError(err instanceof Error ? err.message : t('profile.errors.loadFailed'));
        console.error("Failed to fetch profile:", err);
        // Potentially logout or redirect if auth error specifically
        if ((err as any)?.response?.status === 401) {
          localStorage.removeItem('token');
          localStorage.removeItem('user');
          navigate('/');
        }
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
    initializeLanguage();
  }, [navigate, initializeLanguage, t]);
  
  const handleLogout = async () => {
    try {
      await authService.logout();
    } catch (logoutError) {
      console.error("Logout failed:", logoutError);
      // Still clear local storage and redirect as a fallback
    } finally {
      navigate('/');
    }
  };

  const formatDate = (dateString?: string | null) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' });
    } catch (e) {
      return dateString; // Return original string if date is invalid
    }
  };

  const getInitials = (name: string = "") => {
    return name.split(' ').map((n) => n[0]).join('').toUpperCase();
  };

  const displayName = profileData?.name || userFromLocalStorage?.name || "User";
  const displayEmail = profileData?.email || userFromLocalStorage?.email || "";

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <header className="bg-white shadow">
        <div className="container mx-auto p-4 flex justify-between items-center">
          <h1 className="text-2xl font-bold text-primary-800">DevRetain</h1>
          <div className="flex items-center space-x-4">
            <LanguageSelector />
            {userFromLocalStorage && (
              <div className="text-sm">
                <span className="block text-gray-500">{t('dashboard.loggedInAs')}</span>
                <span className="font-semibold">{userFromLocalStorage.name}</span>
              </div>
            )}
            <button 
              onClick={handleLogout}
              className="py-1 px-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-6">
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold"><AlertCircle className="inline mr-2 h-5 w-5" />{t('common.error')}: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {profileData && (
          <>
            <div className="mb-8">
              <h2 className="text-2xl font-bold mb-2">{t('profile.title')}</h2>
              <p className="text-gray-600">{t('profile.description')}</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="md:col-span-1">
                <div className="bg-white rounded-lg shadow p-6 mb-6">
                  <div className="flex items-center space-x-4 mb-4">
                    <div className="h-16 w-16 rounded-full bg-primary-100 flex items-center justify-center text-primary-600 text-xl font-bold">
                      {getInitials(displayName)}
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">{displayName}</h3>
                      <p className="text-gray-500">{profileData.role === 'admin' ? t('profile.roles.admin') : t('profile.roles.developer')}</p>
                    </div>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-1">{t('profile.email')}</p>
                    <p className="font-medium">{displayEmail}</p>
                  </div>
                  <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-1">{t('profile.joined')}</p>
                    <p className="font-medium">{formatDate(profileData.createdAt)}</p>
                  </div>
                  {/* Placeholder for department, if needed later */}
                  {/* <div className="border-t pt-4 mt-4">
                    <p className="text-sm text-gray-500 mb-1">{t('profile.department')}</p>
                    <p className="font-medium">Engineering</p>
                  </div> */}
                  <div className="mt-6">
                    <button className="w-full text-sm bg-primary-50 text-primary-600 hover:bg-primary-100 py-2 px-3 rounded-md flex items-center justify-center">
                      <Edit3 className="h-4 w-4 mr-2" />
                      {t('profile.editProfile')}
                    </button>
                  </div>
                </div>
                
                {/* Skills Assessment - This section was static, can be kept or removed/updated if dynamic data becomes available */}
                <div className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold mb-4">{t('profile.skillsAssessment.title')}</h3>
                  {/* ... (keep existing static skills assessment or remove) ... */}
                  <p className="text-sm text-gray-400">{t('common.placeholder.feature')}</p>
                </div>
              </div>
              
              <div className="md:col-span-2 space-y-6">
                <div className="bg-white rounded-lg shadow">
                  <div className="p-6 border-b">
                    <h3 className="text-lg font-bold">{t('profile.knowledgeAreas.title')}</h3>
                    <p className="text-sm text-gray-500">{t('profile.knowledgeAreas.description')}</p>
                  </div>
                  <div className="p-6">
                    {profileData.knowledgeAreas.length > 0 ? (
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
                          {profileData.knowledgeAreas.map((area: ProfileKnowledgeArea) => (
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
                                <div className="text-sm text-gray-500">{formatDate(area.lastUpdated)}</div>
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
                    ) : (
                       <p className="text-sm text-gray-500">{t('profile.knowledgeAreas.noData')}</p>
                    )}
                    <div className="mt-6 flex justify-center">
                      <button className="text-sm bg-primary-600 text-white hover:bg-primary-700 py-2 px-4 rounded-md flex items-center">
                        <PlusCircle className="h-4 w-4 mr-2" />
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
                    {profileData.careerMilestones.length > 0 ? (
                      <div className="relative">
                        {profileData.careerMilestones.map((milestone: ProfileCareerMilestone, index: number) => {
                          const isCompleted = milestone.status === 'completed' || milestone.status === 'achieved';
                          return (
                            <div key={milestone.id} className="mb-8 flex items-start">
                              <div className="flex flex-col items-center mr-4">
                                <div 
                                  className={`rounded-full h-8 w-8 flex items-center justify-center ${
                                    isCompleted ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'
                                  }`}
                                >
                                  {isCompleted ? (
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
                                {index < profileData.careerMilestones.length - 1 && (
                                  <div className="h-full w-0.5 bg-gray-200 my-2"></div>
                                )}
                              </div>
                              <div className="bg-gray-50 rounded-lg p-4 flex-grow">
                                <h4 className="font-medium text-gray-900">{milestone.title}</h4>
                                <p className="text-sm text-gray-500">
                                  {isCompleted 
                                    ? `${t('profile.careerPathway.completedOn')} ${formatDate(milestone.date)}` 
                                    : `${t('profile.careerPathway.plannedFor')} ${formatDate(milestone.plannedDate)} (${milestone.status})`}
                                </p>
                                {!isCompleted && milestone.status !== 'planned' && ( /* Assuming 'planned' doesn't need 'start working' */
                                  <button className="mt-2 text-xs bg-primary-50 text-primary-600 hover:bg-primary-100 py-1 px-2 rounded">
                                    {t('profile.careerPathway.startWorking')}
                                  </button>
                                )}
                              </div>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <p className="text-sm text-gray-500">{t('profile.careerPathway.noData')}</p>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </>
        )}
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