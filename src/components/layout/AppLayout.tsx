import { Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut } from 'lucide-react';
import { toast } from 'sonner';

export function AppLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();

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
    <div className="min-h-screen bg-slate-50">
      <nav className="border-b bg-white px-4 py-3 shadow-sm">
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

      <main className="mx-auto max-w-7xl p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
