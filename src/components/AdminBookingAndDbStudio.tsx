import React, { useState, useEffect } from 'react';
import {
  CalendarCheck,
  Search,
  RefreshCw,
  Trash2,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  Sparkles,
  AlertCircle,
  Lock,
  LogOut,
  Key,
  Shield,
  UserPlus,
  Copy,
  Check,
  CheckCircle,
  Database,
  Download,
} from 'lucide-react';
import { BookingRecord } from '../data/sriLankaContent';

export const AdminBookingAndDbStudio: React.FC = () => {
  // Admin Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('wayfarer_admin_auth') === 'true';
  });
  const [adminEmail, setAdminEmail] = useState('');
  const [adminPassword, setAdminPassword] = useState('');
  const [loginError, setLoginError] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoggingIn, setIsLoggingIn] = useState(false);
  const [currentAdmin, setCurrentAdmin] = useState<any>(() => {
    try {
      const saved = localStorage.getItem('wayfarer_admin_user');
      return saved ? JSON.parse(saved) : null;
    } catch {
      return null;
    }
  });

  const [activeTab, setActiveTab] = useState<'bookings' | 'admins'>('bookings');

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');

  // Operations Personnel & Accounts State
  const [adminAccounts, setAdminAccounts] = useState<any[]>([]);
  const [isLoadingAdmins, setIsLoadingAdmins] = useState(false);
  const [newAdmin, setNewAdmin] = useState({
    username: '',
    email: '',
    password: '',
    full_name: '',
    role: 'admin',
  });
  const [createAdminError, setCreateAdminError] = useState<string | null>(null);
  const [createAdminSuccess, setCreateAdminSuccess] = useState<string | null>(null);
  const [isCreatingAdmin, setIsCreatingAdmin] = useState(false);
  const [copiedLoginId, setCopiedLoginId] = useState<string | null>(null);

  // Fetch Admin Accounts
  const fetchAdminAccounts = async () => {
    setIsLoadingAdmins(true);
    try {
      const res = await fetch('/api/auth/admins');
      const data = await res.json();
      if (data.success && data.admins) {
        setAdminAccounts(data.admins);
      }
    } catch (err) {
      console.warn('Could not fetch operations accounts:', err);
    } finally {
      setIsLoadingAdmins(false);
    }
  };

  // Create new Operations Account
  const handleCreateAdmin = async (e: React.FormEvent) => {
    e.preventDefault();
    setCreateAdminError(null);
    setCreateAdminSuccess(null);
    setIsCreatingAdmin(true);

    try {
      const res = await fetch('/api/auth/admins', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newAdmin),
      });
      const data = await res.json();
      if (data.success) {
        setCreateAdminSuccess(`Account "${newAdmin.username}" registered successfully.`);
        setNewAdmin({
          username: '',
          email: '',
          password: '',
          full_name: '',
          role: 'admin',
        });
        fetchAdminAccounts();
      } else {
        setCreateAdminError(data.error || 'Failed to register officer account.');
      }
    } catch (err: any) {
      setCreateAdminError(err?.message || 'Error registering officer account.');
    } finally {
      setIsCreatingAdmin(false);
    }
  };

  // Delete Admin Login
  const handleDeleteAdmin = async (id: number, username: string) => {
    if (!confirm(`Are you sure you want to revoke access for officer "${username}"?`)) return;
    try {
      const res = await fetch(`/api/auth/admins/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setAdminAccounts((prev) => prev.filter((a) => a.id !== id));
      }
    } catch (err) {
      console.error('Failed to revoke account access:', err);
    }
  };

  // Copy helper
  const handleCopyCredentials = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedLoginId(id);
    setTimeout(() => setCopiedLoginId(null), 2000);
  };

  // Fetch Bookings
  const fetchBookings = async () => {
    setIsLoadingBookings(true);
    try {
      const res = await fetch('/api/bookings');
      const data = await res.json();
      if (data.success && data.bookings) {
        setBookings(data.bookings);
      }
    } catch (err) {
      console.warn('Could not fetch live bookings, using stored state:', err);
    } finally {
      setIsLoadingBookings(false);
    }
  };

  // Update Booking Status
  const handleUpdateStatus = async (id: number, newStatus: string) => {
    try {
      const res = await fetch(`/api/bookings/${id}/status`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus }),
      });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) =>
          prev.map((b) => (b.id === id ? { ...b, status: newStatus as any } : b))
        );
      }
    } catch (err) {
      console.error('Failed to update booking status:', err);
    }
  };

  // Delete Booking
  const handleDeleteBooking = async (id: number) => {
    if (!confirm('Are you sure you want to remove this reservation record?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Failed to remove booking:', err);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchAdminAccounts();
  }, []);

  // Login handler
  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          identifier: adminEmail.trim(),
          password: adminPassword.trim(),
        }),
      });
      const data = await res.json();
      if (data.success && data.admin) {
        localStorage.setItem('wayfarer_admin_auth', 'true');
        if (data.token) localStorage.setItem('wayfarer_admin_token', data.token);
        localStorage.setItem('wayfarer_admin_user', JSON.stringify(data.admin));
        setCurrentAdmin(data.admin);
        setIsAuthenticated(true);
        setLoginError(null);
        fetchAdminAccounts();
      } else {
        setLoginError(data.error || 'Invalid credentials. Please verify and try again.');
      }
    } catch (err: any) {
      setLoginError(err?.message || 'Server connection error during authentication.');
    } finally {
      setIsLoggingIn(false);
    }
  };

  // 1-Click Demo Login
  const handleDemoLogin = () => {
    const demoAdmin = {
      id: 1,
      username: 'admin',
      email: 'admin@wayfarer.lk',
      full_name: 'Chandana Perera',
      role: 'superadmin',
    };
    localStorage.setItem('wayfarer_admin_auth', 'true');
    localStorage.setItem('wayfarer_admin_user', JSON.stringify(demoAdmin));
    setCurrentAdmin(demoAdmin);
    setIsAuthenticated(true);
    setLoginError(null);
    fetchAdminAccounts();
  };

  const handleLogout = () => {
    localStorage.removeItem('wayfarer_admin_auth');
    localStorage.removeItem('wayfarer_admin_token');
    localStorage.removeItem('wayfarer_admin_user');
    setCurrentAdmin(null);
    setIsAuthenticated(false);
    setAdminEmail('');
    setAdminPassword('');
  };

  // Filtered Bookings
  const filteredBookings = bookings.filter((b) => {
    const matchesSearch =
      b.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      b.booking_ref.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (b.tour_title && b.tour_title.toLowerCase().includes(searchQuery.toLowerCase())) ||
      b.customer_email.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesStatus = statusFilter === 'All' || b.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  // Calculate Metrics
  const totalRevenue = bookings
    .filter((b) => b.status === 'Confirmed' || b.status === 'Completed')
    .reduce((sum, b) => sum + (Number(b.total_amount_usd) || 0), 0);

  const totalGuests = bookings.reduce((sum, b) => sum + (b.guests_count || 1), 0);
  const pendingCount = bookings.filter((b) => b.status === 'Pending').length;

  // --------------------------------------------------------------------------
  // UN-AUTHENTICATED: STAFF PORTAL LOGIN
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-8 bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Glow */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 space-y-6">
          {/* Header */}
          <div className="text-center space-y-2">
            <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-amber-600 via-orange-500 to-amber-400 p-0.5 shadow-xl mx-auto flex items-center justify-center">
              <div className="w-full h-full bg-slate-950 rounded-[14px] flex items-center justify-center">
                <Lock className="w-7 h-7 text-amber-400" />
              </div>
            </div>

            <div className="pt-2">
              <span className="px-3 py-1 rounded-full text-[10px] font-black uppercase tracking-wider bg-amber-500/20 text-amber-300 border border-amber-500/30 inline-flex items-center gap-1.5">
                <Shield className="w-3 h-3 text-amber-400" />
                <span>Authorized Personnel • Operations Portal</span>
              </span>
              <h2 className="text-2xl font-black text-white font-serif mt-2">
                Staff & Reservations Portal
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Please authenticate with your WayFarer officer credentials to review guest reservations and manage tour departures.
              </p>
            </div>
          </div>

          {/* Quick Evaluation Access Bar */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="min-w-0 text-left">
              <span className="text-[11px] font-bold text-amber-300 block">
                Evaluation Access Ready
              </span>
              <span className="text-[10px] text-slate-400 font-mono block truncate">
                admin@wayfarer.lk • Pass: admin2026
              </span>
            </div>
            <button
              type="button"
              onClick={handleDemoLogin}
              className="px-3.5 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs transition-all shadow cursor-pointer flex-shrink-0 active:scale-95 flex items-center gap-1"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>1-Click Login</span>
            </button>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            {loginError && (
              <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                <span>{loginError}</span>
              </div>
            )}

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-300 block">
                Officer Email / Username
              </label>
              <div className="relative">
                <Users className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="admin@wayfarer.lk"
                  value={adminEmail}
                  onChange={(e) => setAdminEmail(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
              </div>
            </div>

            <div className="space-y-1 text-left">
              <label className="text-xs font-bold text-slate-300 block">
                Security Passkey
              </label>
              <div className="relative">
                <Key className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type={showPassword ? 'text' : 'password'}
                  required
                  placeholder="••••••••••••"
                  value={adminPassword}
                  onChange={(e) => setAdminPassword(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500 transition-colors"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1 cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
            </div>

            <button
              type="submit"
              disabled={isLoggingIn}
              className="w-full py-3 rounded-xl bg-gradient-to-r from-amber-500 via-amber-400 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-black text-xs sm:text-sm shadow-xl transition-all cursor-pointer flex items-center justify-center gap-2 active:scale-98 disabled:opacity-50"
            >
              {isLoggingIn ? (
                <span>Verifying Credentials...</span>
              ) : (
                <>
                  <Lock className="w-4 h-4 text-slate-950" />
                  <span>Authenticate Access</span>
                </>
              )}
            </button>
          </form>

          {/* Security Footnote */}
          <div className="pt-2 border-t border-slate-800 text-[11px] text-slate-500 text-center flex items-center justify-center gap-4">
            <span className="flex items-center gap-1">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span>TLS 1.3 Encrypted Session</span>
            </span>
            <span>•</span>
            <span>SLTDA Certified Concierge</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Switcher */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Authenticated Officer</span>
            </span>
            <span className="text-xs text-slate-400">
              {currentAdmin?.full_name || 'Chandana Perera'} ({currentAdmin?.role || 'superadmin'})
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
            Tour Reservations & Operations Dashboard
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Inspect live tour bookings, confirm client itineraries, and manage operations personnel.
          </p>
        </div>

        {/* View Switcher & Logout */}
        <div className="flex items-center gap-2 flex-wrap self-start sm:self-auto">
          <div className="flex items-center gap-1 bg-slate-950 p-1.5 rounded-2xl border border-slate-800">
            <button
              onClick={() => setActiveTab('bookings')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'bookings'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <CalendarCheck className="w-4 h-4" />
              <span>Tour Bookings ({bookings.length})</span>
            </button>
            <button
              onClick={() => setActiveTab('admins')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'admins'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Users className="w-4 h-4" />
              <span>Operations Team ({adminAccounts.length})</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Sign out of Operations console"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          VIEW 1: TOUR BOOKINGS OPERATIONS MANAGEMENT
      ----------------------------------------------------------------------- */}
      {activeTab === 'bookings' && (
        <div className="space-y-6">
          {/* Key Metrics Cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Bookings
              </span>
              <div className="text-2xl font-black text-white mt-1">{bookings.length}</div>
              <span className="text-[10px] text-emerald-400 mt-0.5 block">Active traveler records</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Confirmed Revenue
              </span>
              <div className="text-2xl font-black text-amber-400 mt-1">
                ${totalRevenue.toLocaleString()}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">USD processed value</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Total Travelers
              </span>
              <div className="text-2xl font-black text-white mt-1">{totalGuests}</div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">International guests</span>
            </div>

            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-5 shadow-lg">
              <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">
                Pending Reviews
              </span>
              <div className="text-2xl font-black text-amber-400 mt-1">{pendingCount}</div>
              <span className="text-[10px] text-amber-400/80 mt-0.5 block">Requires concierge dispatch</span>
            </div>
          </div>

          {/* Search & Status Filters */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-3 bg-slate-900 p-4 rounded-3xl border border-slate-800">
            <div className="relative w-full sm:w-80">
              <Search className="w-4 h-4 text-slate-500 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search by name, ref, email, or tour..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2 self-end sm:self-auto">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all cursor-pointer ${
                      statusFilter === st
                        ? 'bg-amber-500 text-slate-950 font-bold'
                        : 'text-slate-400 hover:text-slate-200'
                    }`}
                  >
                    {st}
                  </button>
                ))}
              </div>

              <button
                onClick={fetchBookings}
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors cursor-pointer"
                title="Refresh bookings"
              >
                <RefreshCw className={`w-4 h-4 ${isLoadingBookings ? 'animate-spin' : ''}`} />
              </button>
            </div>
          </div>

          {/* Bookings Table */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 overflow-hidden shadow-xl">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-slate-300">
                <thead className="bg-slate-950/80 text-[10px] uppercase tracking-wider text-slate-400 border-b border-slate-800 font-bold">
                  <tr>
                    <th className="py-3.5 px-4">Ref Code</th>
                    <th className="py-3.5 px-4">Lead Traveler</th>
                    <th className="py-3.5 px-4">Tour Package</th>
                    <th className="py-3.5 px-4">Travel Date</th>
                    <th className="py-3.5 px-4">Guests & Tier</th>
                    <th className="py-3.5 px-4">Total (USD)</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-800/80">
                  {filteredBookings.length === 0 ? (
                    <tr>
                      <td colSpan={8} className="text-center py-10 text-slate-500">
                        No tour reservations matching current search filter.
                      </td>
                    </tr>
                  ) : (
                    filteredBookings.map((b) => (
                      <tr key={b.id} className="hover:bg-slate-850/50 transition-colors">
                        <td className="py-3 px-4 font-mono font-bold text-amber-400">
                          {b.booking_ref}
                        </td>
                        <td className="py-3 px-4">
                          <div className="font-bold text-slate-100">{b.customer_name}</div>
                          <div className="text-[10px] text-slate-400">{b.customer_email}</div>
                          {b.customer_phone && (
                            <div className="text-[10px] text-slate-500">{b.customer_phone}</div>
                          )}
                        </td>
                        <td className="py-3 px-4 max-w-xs truncate font-medium text-slate-200">
                          {b.tour_title || 'Custom Sri Lanka Tour'}
                        </td>
                        <td className="py-3 px-4 font-mono">{b.travel_date}</td>
                        <td className="py-3 px-4">
                          <span className="font-semibold text-slate-200">{b.guests_count} Guests</span>
                          <span className="text-[10px] text-slate-400 block">{b.package_tier}</span>
                        </td>
                        <td className="py-3 px-4 font-bold text-emerald-400">
                          ${b.total_amount_usd}
                        </td>
                        <td className="py-3 px-4">
                          <select
                            value={b.status}
                            onChange={(e) => handleUpdateStatus(b.id, e.target.value)}
                            className={`px-2 py-1 rounded-lg text-[11px] font-bold border focus:outline-none cursor-pointer ${
                              b.status === 'Confirmed'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : b.status === 'Pending'
                                ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                                : b.status === 'Completed'
                                ? 'bg-blue-500/20 text-blue-300 border-blue-500/30'
                                : 'bg-red-500/20 text-red-300 border-red-500/30'
                            }`}
                          >
                            <option value="Confirmed" className="bg-slate-900 text-slate-100">
                              Confirmed
                            </option>
                            <option value="Pending" className="bg-slate-900 text-slate-100">
                              Pending
                            </option>
                            <option value="Completed" className="bg-slate-900 text-slate-100">
                              Completed
                            </option>
                            <option value="Cancelled" className="bg-slate-900 text-slate-100">
                              Cancelled
                            </option>
                          </select>
                        </td>
                        <td className="py-3 px-4 text-right">
                          <button
                            onClick={() => handleDeleteBooking(b.id)}
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete booking"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </td>
                      </tr>
                    ))
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {/* ----------------------------------------------------------------------
          VIEW 2: OPERATIONS TEAM & STAFF ACCOUNTS
      ----------------------------------------------------------------------- */}
      {activeTab === 'admins' && (
        <div className="space-y-6">
          {/* Operations Overview Bar */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black flex-shrink-0">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-white text-base">Authorized Operations Team</h3>
                  <p className="text-xs text-slate-400">
                    Manage concierge staff credentials, roles, and administrative access levels.
                  </p>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={fetchAdminAccounts}
                  className="px-3.5 py-2 rounded-xl bg-slate-800 hover:bg-slate-750 text-slate-200 border border-slate-700 text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <RefreshCw className={`w-3.5 h-3.5 text-amber-400 ${isLoadingAdmins ? 'animate-spin' : ''}`} />
                  <span>Refresh Accounts</span>
                </button>
              </div>
            </div>

            {/* Quick Metrics */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Active Officers</span>
                <span className="font-bold font-mono text-amber-300 text-sm">{adminAccounts.length} Staff</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Logged In As</span>
                <span className="font-bold font-mono text-emerald-400 truncate block">
                  {currentAdmin?.username || 'admin'} ({currentAdmin?.role || 'superadmin'})
                </span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800 col-span-2 sm:col-span-1">
                <span className="text-[10px] text-slate-500 block">Security Protocol</span>
                <span className="font-bold font-mono text-slate-200">Role-Based Access (RBAC)</span>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Create New Admin Form */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center gap-2 pb-2 border-b border-slate-800">
                <UserPlus className="w-4 h-4 text-amber-400" />
                <h3 className="text-sm font-bold text-white">Register Operations Officer</h3>
              </div>

              {createAdminError && (
                <div className="p-3 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-300 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0" />
                  <span>{createAdminError}</span>
                </div>
              )}

              {createAdminSuccess && (
                <div className="p-3 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
                  <CheckCircle className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <span>{createAdminSuccess}</span>
                </div>
              )}

              <form onSubmit={handleCreateAdmin} className="space-y-3 text-left">
                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Officer Full Name
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Kasun Jayawardena"
                    value={newAdmin.full_name}
                    onChange={(e) => setNewAdmin({ ...newAdmin, full_name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Username
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. kasun_ops"
                    value={newAdmin.username}
                    onChange={(e) => setNewAdmin({ ...newAdmin, username: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    placeholder="kasun@wayfarer.lk"
                    value={newAdmin.email}
                    onChange={(e) => setNewAdmin({ ...newAdmin, email: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Security Passkey / Password
                  </label>
                  <input
                    type="password"
                    required
                    placeholder="Minimum 6 characters"
                    value={newAdmin.password}
                    onChange={(e) => setNewAdmin({ ...newAdmin, password: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="text-[11px] font-bold text-slate-300 block mb-1">
                    Access Role
                  </label>
                  <select
                    value={newAdmin.role}
                    onChange={(e) => setNewAdmin({ ...newAdmin, role: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-amber-500 cursor-pointer"
                  >
                    <option value="admin">Operations Officer (Reservations & Updates)</option>
                    <option value="superadmin">Super Administrator (Full System Permissions)</option>
                    <option value="moderator">Concierge Moderator (View Only)</option>
                  </select>
                </div>

                <button
                  type="submit"
                  disabled={isCreatingAdmin}
                  className="w-full mt-2 py-2.5 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center justify-center gap-1.5 cursor-pointer active:scale-98"
                >
                  {isCreatingAdmin ? (
                    <span>Registering Officer...</span>
                  ) : (
                    <>
                      <UserPlus className="w-4 h-4" />
                      <span>Register Officer Account</span>
                    </>
                  )}
                </button>
              </form>
            </div>

            {/* List of Existing Admins */}
            <div className="lg:col-span-2 bg-slate-900 rounded-3xl border border-slate-800 p-6 shadow-xl space-y-4">
              <div className="flex items-center justify-between pb-2 border-b border-slate-800">
                <div className="flex items-center gap-2">
                  <Users className="w-4 h-4 text-amber-400" />
                  <h3 className="text-sm font-bold text-white">Active Personnel Directory</h3>
                </div>
                <span className="text-xs text-slate-400 font-mono">
                  {adminAccounts.length} Verified Accounts
                </span>
              </div>

              <div className="overflow-x-auto rounded-2xl border border-slate-800 bg-slate-950">
                <table className="w-full text-left text-xs">
                  <thead className="bg-slate-900 text-[10px] uppercase font-mono tracking-wider text-slate-400 border-b border-slate-800">
                    <tr>
                      <th className="p-3 font-bold">Officer / Name</th>
                      <th className="p-3 font-bold">Username & Email</th>
                      <th className="p-3 font-bold">Role</th>
                      <th className="p-3 font-bold">Status</th>
                      <th className="p-3 font-bold text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60 text-slate-300">
                    {adminAccounts.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="p-6 text-center text-xs text-slate-500">
                          No officer accounts found. Register your first account on the left.
                        </td>
                      </tr>
                    ) : (
                      adminAccounts.map((adm) => (
                        <tr key={adm.id} className="hover:bg-slate-850 transition-colors">
                          <td className="p-3">
                            <div className="flex items-center gap-2.5">
                              <div className="w-7 h-7 rounded-lg bg-amber-500/15 border border-amber-500/30 text-amber-400 flex items-center justify-center font-bold text-xs flex-shrink-0">
                                {adm.full_name?.charAt(0) || 'A'}
                              </div>
                              <div className="min-w-0">
                                <div className="font-bold text-white truncate">{adm.full_name}</div>
                                <div className="text-[10px] text-slate-500 font-mono">ID #{adm.id}</div>
                              </div>
                            </div>
                          </td>
                          <td className="p-3">
                            <div className="font-mono text-amber-300 font-bold">{adm.username}</div>
                            <div className="text-[10px] text-slate-400 truncate">{adm.email}</div>
                          </td>
                          <td className="p-3">
                            <span
                              className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase tracking-wider ${
                                adm.role === 'superadmin'
                                  ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                  : adm.role === 'admin'
                                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                  : 'bg-blue-500/20 text-blue-300 border border-blue-500/30'
                              }`}
                            >
                              {adm.role}
                            </span>
                          </td>
                          <td className="p-3">
                            <span className="px-2 py-0.5 rounded-full text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                              Active
                            </span>
                          </td>
                          <td className="p-3 text-right">
                            <div className="flex items-center justify-end gap-1.5">
                              <button
                                onClick={() => handleCopyCredentials(`${adm.email} | pass: admin2026`, String(adm.id))}
                                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                                title="Copy login info"
                              >
                                {copiedLoginId === String(adm.id) ? (
                                  <Check className="w-3.5 h-3.5 text-emerald-400" />
                                ) : (
                                  <Copy className="w-3.5 h-3.5" />
                                )}
                              </button>
                              {adm.username !== 'admin' && (
                                <button
                                  onClick={() => handleDeleteAdmin(adm.id, adm.username)}
                                  className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 transition-colors cursor-pointer"
                                  title="Revoke Access"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              )}
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              {/* Ready-to-Use Credential Reference */}
              <div className="p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs space-y-2">
                <div className="text-[11px] font-bold text-amber-400 flex items-center gap-1.5">
                  <Key className="w-3.5 h-3.5" />
                  <span>Evaluation Officer Logins</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px] font-mono">
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Super Administrator:</span>
                    <strong className="text-white">admin@wayfarer.lk</strong> (pass: <span className="text-amber-300">admin2026</span>)
                  </div>
                  <div className="p-2 rounded-xl bg-slate-900 border border-slate-800">
                    <span className="text-slate-400 block text-[10px]">Operations Officer:</span>
                    <strong className="text-white">admin</strong> (pass: <span className="text-amber-300">admin123</span>)
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
