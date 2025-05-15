import { useNavigate } from 'react-router-dom';

interface HeaderProps {
  userName: string;
  userRole?: string;
}

const Header = ({ userName, userRole }: HeaderProps) => {
  const navigate = useNavigate();
  
  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/');
  };
  
  return (
    <header className="bg-white shadow">
      <div className="container mx-auto p-4 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-primary-800">DevRetain</h1>
        <div className="flex items-center space-x-4">
          <div className="text-sm">
            <span className="block text-gray-500">
              {userRole ? `Logged in as (${userRole})` : 'Welcome back,'}
            </span>
            <span className="font-semibold">{userName}</span>
          </div>
          <button 
            onClick={handleLogout}
            className="py-1 px-3 text-sm bg-gray-200 hover:bg-gray-300 text-gray-800 rounded-md"
          >
            Logout
          </button>
        </div>
      </div>
    </header>
  );
};

export default Header; 