import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function AppLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const isActive = (path: string) => location.pathname.startsWith(path);


  const handleLogout = async () => {
    try {
      await signOut();
      navigate('/login');
      toast.success('Logged out successfully');
    } catch (error) {
      toast.error('Failed to log out');
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col">
      <nav className="border-b bg-white px-4 py-3 shadow-sm z-10 print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-md bg-blue-600 font-bold text-white">
              E
            </div>
            <span className="text-lg font-semibold tracking-tight text-slate-900">Mini ERP</span>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="hidden text-sm text-slate-500 sm:inline-block">
              {user?.email}
            </span>
            <Button variant="outline" size="sm" onClick={handleLogout} className="gap-2">
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline-block">Logout</span>
            </Button>
          </div>
        </div>
      </nav>

      <div className="bg-white border-b border-slate-200 print:hidden">
        <div className="mx-auto max-w-7xl px-4 overflow-x-auto">
          <nav className="flex space-x-6 h-12 items-center text-sm font-medium text-slate-600">
            <Link to="/dashboard" className={`hover:text-blue-600 px-2 py-1 transition-colors ${isActive('/dashboard') ? 'text-blue-600' : ''}`}>Dashboard</Link>
            <Link to="/products" className={`hover:text-blue-600 px-2 py-1 transition-colors ${isActive('/products') ? 'text-blue-600' : ''}`}>Products</Link>
            <Link to="/customers" className={`hover:text-blue-600 px-2 py-1 transition-colors ${isActive('/customers') ? 'text-blue-600' : ''}`}>Customers</Link>
            <Link to="/suppliers" className={`hover:text-blue-600 px-2 py-1 transition-colors ${isActive('/suppliers') ? 'text-blue-600' : ''}`}>Suppliers</Link>
            <Link to="/purchases" className={`hover:text-blue-600 px-2 py-1 transition-colors ${isActive('/purchases') ? 'text-blue-600' : ''}`}>Purchases</Link>
            <Link to="/sales" className={`hover:text-blue-600 px-2 py-1 transition-colors ${isActive('/sales') ? 'text-blue-600' : ''}`}>Sales</Link>
            <Link to="/reports" className={`hover:text-blue-600 px-2 py-1 transition-colors ${isActive('/reports') ? 'text-blue-600' : ''}`}>Reports</Link>
          </nav>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
