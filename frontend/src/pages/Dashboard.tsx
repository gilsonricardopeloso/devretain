import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useLanguage } from '../hooks/useLanguage';
import { LanguageSelector } from '../components/LanguageSelector';
import { authService, getAdminDashboardData, AdminDashboardData, KnowledgeHeatMapItem } from '../lib/api';
import { LogOut, Map, BarChart3, AlertTriangle, FileText, Loader2, AlertCircle } from 'lucide-react'; // Assuming icons

const Dashboard = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
  const { initializeLanguage } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [dashboardData, setDashboardData] = useState<AdminDashboardData | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/');
      return;
    }
    
    const parsedUser = JSON.parse(storedUser);
    setUser(parsedUser);
    
    if (parsedUser.role !== 'admin') {
      navigate('/profile');
      setIsLoading(false); // Not an admin, no data to load for this page specifically
    } else {
      // User is admin, fetch dashboard data
      const fetchDashboardData = async () => {
        try {
          setIsLoading(true);
          const data = await getAdminDashboardData();
          setDashboardData(data);
          setError(null);
        } catch (err) {
          setError(err instanceof Error ? err.message : t('dashboard.errors.loadFailed'));
          console.error("Failed to fetch admin dashboard data:", err);
           // Potentially logout or redirect if auth error specifically
          if ((err as any)?.response?.status === 401) {
            handleLogout(true); // Pass true to indicate it's an auth error logout
          }
        } finally {
          setIsLoading(false);
        }
      };
      fetchDashboardData();
    }
    initializeLanguage();
  }, [navigate, initializeLanguage, t]);

  const handleLogout = async (isAuthError: boolean = false) => {
    if (!isAuthError) { // Avoid double logout if already handling auth error
      try {
        await authService.logout();
      } catch (logoutError) {
        console.error("Logout failed:", logoutError);
      }
    }
    // Always clear local storage and redirect
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };

  if (!user) { // Initial check before useEffect runs fully
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Loader2 className="h-12 w-12 animate-spin text-primary-600" />
      </div>
    );
  }
  
  // If user is not admin, they are redirected by useEffect, but this prevents rendering admin content briefly.
  if (user.role !== 'admin' && !isLoading) { 
    // navigate('/profile') is already called in useEffect, this just prevents flicker.
    // Or show a generic "Access Denied" or redirect immediately if navigate hasn't fired.
    return <div className="p-6">{t('common.accessDenied')}</div>;
  }

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
              onClick={() => handleLogout()}
              className="py-1 px-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md flex items-center"
            >
              <LogOut className="h-4 w-4 mr-1.5" />
              {t('dashboard.logout')}
            </button>
          </div>
        </div>
      </header>
      
      <main className="flex-grow container mx-auto p-6">
        <div className="mb-8">
          <h2 className="text-2xl font-bold mb-2">{t('dashboard.welcome')} {user.name}!</h2>
          <p className="text-gray-600">{t('dashboard.description')}</p>
        </div>

        {isLoading && (
          <div className="flex justify-center items-center py-10">
            <Loader2 className="h-10 w-10 animate-spin text-primary-600" />
          </div>
        )}

        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong className="font-bold"><AlertCircle className="inline mr-2 h-5 w-5" />{t('common.error')}: </strong>
            <span className="block sm:inline">{error}</span>
          </div>
        )}

        {dashboardData && !isLoading && !error && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
              <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                <BarChart3 className="h-8 w-8 text-primary-600" />
                <div>
                  <div className="text-primary-600 text-2xl font-bold">
                    {dashboardData.stats.keyKnowledgeAreas}
                  </div>
                  <div className="text-gray-500 text-sm">{t('dashboard.stats.keyKnowledgeAreas')}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                <AlertTriangle className="h-8 w-8 text-yellow-500" />
                <div>
                  <div className="text-yellow-500 text-2xl font-bold">
                    {dashboardData.stats.vulnerabilityAlerts}
                  </div>
                  <div className="text-gray-500 text-sm">{t('dashboard.stats.vulnerabilityAlerts')}</div>
                </div>
              </div>
              <div className="bg-white rounded-lg shadow p-6 flex items-center space-x-4">
                <FileText className="h-8 w-8 text-green-500" />
                <div>
                  <div className="text-green-500 text-2xl font-bold">
                    {dashboardData.stats.technicalDocuments}
                  </div>
                  <div className="text-gray-500 text-sm">{t('dashboard.stats.technicalDocuments')}</div>
                </div>
              </div>
            </div>
            
            <div className="bg-white rounded-lg shadow mb-8">
              <div className="p-6 border-b flex items-center space-x-3">
                <Map className="h-6 w-6 text-primary-700" />
                <div>
                  <h3 className="text-lg font-semibold">{t('dashboard.knowledgeHeatMap.title')}</h3>
                  <p className="text-sm text-gray-500">{t('dashboard.knowledgeHeatMap.description')}</p>
                </div>
              </div>
              <div className="p-6">
                {dashboardData.heatMapData.length > 0 ? (
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
                      {dashboardData.heatMapData.map((item: KnowledgeHeatMapItem) => (
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
                            <div className="text-sm text-gray-900">{item.ownerName}</div>
                            <div className="text-xs text-gray-500">{item.ownerEmail}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div 
                              className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.vulnerabilityScore && item.vulnerabilityScore > 7
                                  ? 'bg-red-100 text-red-800'
                                  : item.vulnerabilityScore && item.vulnerabilityScore > 4
                                  ? 'bg-yellow-100 text-yellow-800'
                                  : 'bg-green-100 text-green-800'
                              }`}
                            >
                              {item.vulnerabilityScore !== null && item.vulnerabilityScore !== undefined ? `${item.vulnerabilityScore}/10` : t('common.notApplicable')}
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : (
                  <p className="text-sm text-gray-500">{t('dashboard.knowledgeHeatMap.noData')}</p>
                )}
              </div>
            </div>
            
            {/* Static sections - can be kept as is or updated later if dynamic data is available */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">{t('dashboard.recentActivity.title')}</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-400">{t('common.placeholder.feature')}</p>
                  {/* Existing static recent activity list can be kept or removed */}
                </div>
              </div>
              
              <div className="bg-white rounded-lg shadow">
                <div className="p-6 border-b">
                  <h3 className="text-lg font-semibold">{t('dashboard.recommendedActions.title')}</h3>
                </div>
                <div className="p-6">
                  <p className="text-sm text-gray-400">{t('common.placeholder.feature')}</p>
                  {/* Existing static recommended actions list can be kept or removed */}
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

export default Dashboard; 