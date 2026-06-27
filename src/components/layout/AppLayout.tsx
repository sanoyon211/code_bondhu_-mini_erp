import { useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { Button } from '../ui/button';
import { LogOut, LayoutDashboard, Package, Users, Truck, ShoppingCart, TrendingUp, BarChart3, Boxes } from 'lucide-react';
import { FiMenu, FiX } from 'react-icons/fi';
import { toast } from 'sonner';

export function AppLayout() {
  const { signOut, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

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
      <nav className="sticky top-0 w-full border-b bg-white/80 backdrop-blur-md px-4 py-3 shadow-sm z-30 print:hidden">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              className="md:hidden p-1 -ml-1 text-slate-600 hover:text-violet-600"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              {isMobileMenuOpen ? <FiX className="w-6 h-6" /> : <FiMenu className="w-6 h-6" />}
            </button>
            <div className="flex items-center justify-center rounded-xl bg-gradient-to-br from-violet-600 to-violet-800 p-2 shadow-md shadow-violet-200">
              <Boxes className="w-5 h-5 text-white" />
            </div>
            <span 
              className="text-xl font-extrabold tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-slate-900 via-violet-900 to-slate-800 hidden sm:inline-block"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              Mini ERP
            </span>
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

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <>
          <div 
            className="md:hidden fixed inset-0 z-20 bg-slate-900/20 backdrop-blur-sm print:hidden" 
            onClick={() => setIsMobileMenuOpen(false)}
          />
          <div className="md:hidden bg-white border-b border-slate-200 print:hidden shadow-md absolute w-full z-30 top-[60px]">
            <nav className="flex flex-col p-4 space-y-4 text-sm font-medium text-slate-600">
            <Link to="/dashboard" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 hover:text-violet-600 transition-colors p-2 rounded-md ${isActive('/dashboard') ? 'text-violet-600 bg-violet-50/80 font-semibold' : ''}`}><LayoutDashboard className="w-5 h-5" />Dashboard</Link>
            <Link to="/products" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 hover:text-violet-600 transition-colors p-2 rounded-md ${isActive('/products') ? 'text-violet-600 bg-violet-50/80 font-semibold' : ''}`}><Package className="w-5 h-5" />Products</Link>
            <Link to="/customers" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 hover:text-violet-600 transition-colors p-2 rounded-md ${isActive('/customers') ? 'text-violet-600 bg-violet-50/80 font-semibold' : ''}`}><Users className="w-5 h-5" />Customers</Link>
            <Link to="/suppliers" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 hover:text-violet-600 transition-colors p-2 rounded-md ${isActive('/suppliers') ? 'text-violet-600 bg-violet-50/80 font-semibold' : ''}`}><Truck className="w-5 h-5" />Suppliers</Link>
            <Link to="/purchases" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 hover:text-violet-600 transition-colors p-2 rounded-md ${isActive('/purchases') ? 'text-violet-600 bg-violet-50/80 font-semibold' : ''}`}><ShoppingCart className="w-5 h-5" />Purchases</Link>
            <Link to="/sales" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 hover:text-violet-600 transition-colors p-2 rounded-md ${isActive('/sales') ? 'text-violet-600 bg-violet-50/80 font-semibold' : ''}`}><TrendingUp className="w-5 h-5" />Sales</Link>
            <Link to="/reports" onClick={() => setIsMobileMenuOpen(false)} className={`flex items-center gap-3 hover:text-violet-600 transition-colors p-2 rounded-md ${isActive('/reports') ? 'text-violet-600 bg-violet-50/80 font-semibold' : ''}`}><BarChart3 className="w-5 h-5" />Reports</Link>
          </nav>
          </div>
        </>
      )}

      {/* Desktop Navigation */}
      <div className="hidden md:block bg-white border-b border-slate-200 print:hidden">
        <div className="mx-auto max-w-7xl px-4">
          <nav className="flex space-x-6 h-12 items-center text-sm font-medium text-slate-600">
            <Link to="/dashboard" className={`flex items-center gap-2 hover:text-violet-600 px-2 py-1 transition-colors ${isActive('/dashboard') ? 'text-violet-600' : ''}`}><LayoutDashboard className="w-4 h-4" />Dashboard</Link>
            <Link to="/products" className={`flex items-center gap-2 hover:text-violet-600 px-2 py-1 transition-colors ${isActive('/products') ? 'text-violet-600' : ''}`}><Package className="w-4 h-4" />Products</Link>
            <Link to="/customers" className={`flex items-center gap-2 hover:text-violet-600 px-2 py-1 transition-colors ${isActive('/customers') ? 'text-violet-600' : ''}`}><Users className="w-4 h-4" />Customers</Link>
            <Link to="/suppliers" className={`flex items-center gap-2 hover:text-violet-600 px-2 py-1 transition-colors ${isActive('/suppliers') ? 'text-violet-600' : ''}`}><Truck className="w-4 h-4" />Suppliers</Link>
            <Link to="/purchases" className={`flex items-center gap-2 hover:text-violet-600 px-2 py-1 transition-colors ${isActive('/purchases') ? 'text-violet-600' : ''}`}><ShoppingCart className="w-4 h-4" />Purchases</Link>
            <Link to="/sales" className={`flex items-center gap-2 hover:text-violet-600 px-2 py-1 transition-colors ${isActive('/sales') ? 'text-violet-600' : ''}`}><TrendingUp className="w-4 h-4" />Sales</Link>
            <Link to="/reports" className={`flex items-center gap-2 hover:text-violet-600 px-2 py-1 transition-colors ${isActive('/reports') ? 'text-violet-600' : ''}`}><BarChart3 className="w-4 h-4" />Reports</Link>
          </nav>
        </div>
      </div>

      <main className="flex-1 mx-auto max-w-7xl w-full p-4 sm:p-6 lg:p-8">
        <Outlet />
      </main>
    </div>
  );
}
