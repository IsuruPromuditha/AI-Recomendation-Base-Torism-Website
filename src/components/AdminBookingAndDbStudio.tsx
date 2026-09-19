import React, { useState, useEffect } from 'react';
import {
  Database,
  CalendarCheck,
  Search,
  Filter,
  RefreshCw,
  Trash2,
  CheckCircle,
  Clock,
  XCircle,
  Download,
  Terminal,
  Table,
  Layers,
  Server,
  DollarSign,
  Users,
  ShieldCheck,
  Eye,
  EyeOff,
  ExternalLink,
  ChevronRight,
  Sparkles,
  AlertCircle,
  FileCode,
  Lock,
  LogOut,
  Key,
  Shield,
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

  const [activeTab, setActiveTab] = useState<'bookings' | 'phpmyadmin'>('bookings');

  // Bookings state
  const [bookings, setBookings] = useState<BookingRecord[]>([]);
  const [isLoadingBookings, setIsLoadingBookings] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('All');
  const [selectedBooking, setSelectedBooking] = useState<BookingRecord | null>(null);

  // phpMyAdmin Studio state
  const [dbTables, setDbTables] = useState<any[]>([]);
  const [selectedTable, setSelectedTable] = useState<string>('bookings');
  const [tableRows, setTableRows] = useState<any[]>([]);
  const [isLoadingTable, setIsLoadingTable] = useState(false);
  const [sqlQuery, setSqlQuery] = useState('SELECT * FROM bookings ORDER BY id DESC LIMIT 25;');
  const [sqlResult, setSqlResult] = useState<any | null>(null);
  const [isExecutingSql, setIsExecutingSql] = useState(false);

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

  // Fetch DB Tables metadata
  const fetchDbTables = async () => {
    try {
      const res = await fetch('/api/db/tables');
      const data = await res.json();
      if (data.success && data.tables) {
        setDbTables(data.tables);
      }
    } catch (err) {
      console.warn('Could not fetch DB tables:', err);
    }
  };

  // Fetch rows for selected table
  const fetchTableRows = async (tableName: string) => {
    setIsLoadingTable(true);
    setSelectedTable(tableName);
    try {
      const res = await fetch(`/api/db/table/${tableName}`);
      const data = await res.json();
      if (data.success && data.rows) {
        setTableRows(data.rows);
      }
    } catch (err) {
      console.warn('Could not fetch table rows:', err);
    } finally {
      setIsLoadingTable(false);
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
    if (!confirm('Are you sure you want to delete this booking record?')) return;
    try {
      const res = await fetch(`/api/bookings/${id}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.success) {
        setBookings((prev) => prev.filter((b) => b.id !== id));
      }
    } catch (err) {
      console.error('Failed to delete booking:', err);
    }
  };

  // Execute SQL Query
  const handleExecuteSql = async () => {
    if (!sqlQuery.trim()) return;
    setIsExecutingSql(true);
    try {
      const res = await fetch('/api/db/query', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ query: sqlQuery }),
      });
      const data = await res.json();
      setSqlResult(data);
    } catch (err: any) {
      setSqlResult({ success: false, error: err?.message || 'SQL execution failed' });
    } finally {
      setIsExecutingSql(false);
    }
  };

  useEffect(() => {
    fetchBookings();
    fetchDbTables();
    fetchTableRows('bookings');
  }, []);

  // Login handlers
  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoggingIn(true);
    setLoginError(null);

    setTimeout(() => {
      const emailLower = adminEmail.trim().toLowerCase();
      const pass = adminPassword.trim();
      if (
        (emailLower === 'admin@wayfarer.lk' || emailLower === 'admin') &&
        (pass === 'admin2026' || pass === 'admin123' || pass === 'admin')
      ) {
        localStorage.setItem('wayfarer_admin_auth', 'true');
        setIsAuthenticated(true);
        setLoginError(null);
      } else {
        setLoginError('Invalid Administrator credentials. Please verify your Email/Username and Passkey.');
      }
      setIsLoggingIn(false);
    }, 350);
  };

  const handleDemoLogin = () => {
    setAdminEmail('admin@wayfarer.lk');
    setAdminPassword('admin2026');
    localStorage.setItem('wayfarer_admin_auth', 'true');
    setIsAuthenticated(true);
    setLoginError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('wayfarer_admin_auth');
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

  // --------------------------------------------------------------------------
  // UN-AUTHENTICATED: DEDICATED ADMIN LOGIN PORTAL
  // --------------------------------------------------------------------------
  if (!isAuthenticated) {
    return (
      <div className="max-w-xl mx-auto my-6 bg-slate-900/95 border border-amber-500/30 rounded-3xl p-6 sm:p-8 shadow-2xl backdrop-blur-xl relative overflow-hidden">
        {/* Ambient Top Glow */}
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
                <span>Restricted Access • SLTDA Central Portal</span>
              </span>
              <h2 className="text-2xl font-black text-white font-serif mt-2">
                Administrator & Database Portal
              </h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto mt-1">
                Please authenticate with your WayFarer DMC credentials to manage reservations and query the MySQL phpMyAdmin engine.
              </p>
            </div>
          </div>

          {/* Quick Demo Access Bar */}
          <div className="p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-between gap-3">
            <div className="min-w-0 text-left">
              <span className="text-[11px] font-bold text-amber-300 block">
                Evaluation Demo Account Ready
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
              <span>1-Click Demo Login</span>
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
                Administrator Email / Username
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
                Security Passkey / Password
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-500 hover:text-slate-300 p-1"
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
                  <span>Authenticate as Administrator</span>
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
            <span>DMC Officer Verification</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Top Header & Switcher with Authenticated Badge & Logout */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-xl">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 flex items-center gap-1">
              <ShieldCheck className="w-3 h-3 text-emerald-400" />
              <span>Authenticated Admin #ADM-8092</span>
            </span>
            <span className="text-xs text-slate-400">Chandana Perera (Lead Operations & DBA)</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black text-white font-serif">
            Tour Reservations & phpMyAdmin Studio
          </h2>
          <p className="text-xs text-slate-300 mt-1 max-w-xl">
            Inspect live tour reservations, update client statuses, or execute SQL queries on the MySQL/phpMyAdmin database engine.
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
              onClick={() => setActiveTab('phpmyadmin')}
              className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                activeTab === 'phpmyadmin'
                  ? 'bg-amber-500 text-slate-950 shadow-md font-black'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Database className="w-4 h-4" />
              <span>phpMyAdmin Studio</span>
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="p-2.5 rounded-xl bg-slate-950 hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 border border-slate-800 transition-colors flex items-center gap-1.5 text-xs font-semibold cursor-pointer"
            title="Sign out of Administrator console"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden md:inline">Sign Out</span>
          </button>
        </div>
      </div>

      {/* ----------------------------------------------------------------------
          VIEW 1: TOUR BOOKINGS ADMIN MANAGEMENT
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
                Pending Requests
              </span>
              <div className="text-2xl font-black text-orange-400 mt-1">
                {bookings.filter((b) => b.status === 'Pending').length}
              </div>
              <span className="text-[10px] text-slate-400 mt-0.5 block">Awaiting guide assignment</span>
            </div>
          </div>

          {/* Search & Filter Toolbar */}
          <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3 bg-slate-900 p-4 rounded-3xl border border-slate-800">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by customer name, ref (WF-XXXXX), email, or tour..."
                className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-3.5 py-2 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center gap-2">
              <div className="flex items-center gap-1 bg-slate-950 p-1 rounded-xl border border-slate-800">
                {['All', 'Confirmed', 'Pending', 'Completed', 'Cancelled'].map((st) => (
                  <button
                    key={st}
                    onClick={() => setStatusFilter(st)}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-medium transition-all ${
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
                className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
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
                            className="p-1.5 rounded-lg text-slate-500 hover:text-red-400 hover:bg-slate-800 transition-colors"
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
          VIEW 2: PHPMYADMIN DATABASE STUDIO
      ----------------------------------------------------------------------- */}
      {activeTab === 'phpmyadmin' && (
        <div className="space-y-6">
          {/* phpMyAdmin Header Bar */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-black">
                  <Database className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-white text-base">phpMyAdmin Database Engine</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-emerald-500/20 text-emerald-400 border border-emerald-500/30">
                      CONNECTED
                    </span>
                  </div>
                  <p className="text-xs text-slate-400 font-mono">
                    Server: 127.0.0.1 via TCP/IP • Server version: 8.0.35-MySQL • Database: wayfarer_travel_db
                  </p>
                </div>
              </div>

              {/* SQL Export Button */}
              <div className="flex items-center gap-2">
                <a
                  href="/api/db/export"
                  download="wayfarer_travel_db.sql"
                  className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs shadow-md transition-all flex items-center gap-2"
                >
                  <Download className="w-4 h-4" />
                  <span>Download SQL Dump (.sql)</span>
                </a>
              </div>
            </div>

            {/* phpMyAdmin Quick Information */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 text-xs">
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Active Database</span>
                <span className="font-bold font-mono text-amber-300">wayfarer_travel_db</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Default Collation</span>
                <span className="font-bold font-mono text-slate-200">utf8mb4_unicode_ci</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Storage Engine</span>
                <span className="font-bold font-mono text-slate-200">InnoDB (ACID Compliant)</span>
              </div>
              <div className="p-3 rounded-2xl bg-slate-950 border border-slate-800">
                <span className="text-[10px] text-slate-500 block">Total Schemas</span>
                <span className="font-bold font-mono text-slate-200">{dbTables.length} Tables</span>
              </div>
            </div>
          </div>

          {/* Interactive SQL Query Console */}
          <div className="bg-slate-900 rounded-3xl border border-slate-800 p-5 shadow-xl space-y-3">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Terminal className="w-4 h-4 text-amber-400" />
                <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                  SQL Query Console
                </h3>
              </div>

              {/* Sample Query Presets */}
              <div className="flex items-center gap-1.5 text-[10px]">
                <span className="text-slate-500">Presets:</span>
                {[
                  { label: 'SELECT bookings', q: 'SELECT * FROM bookings ORDER BY id DESC LIMIT 25;' },
                  { label: 'SELECT tours', q: 'SELECT * FROM tours WHERE price_usd < 1000;' },
                  { label: 'SELECT users', q: 'SELECT id, full_name, email, role FROM users;' },
                ].map((p, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setSqlQuery(p.q)}
                    className="px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700 text-slate-300 font-mono transition-colors"
                  >
                    {p.label}
                  </button>
                ))}
              </div>
            </div>

            <div className="relative">
              <textarea
                rows={3}
                value={sqlQuery}
                onChange={(e) => setSqlQuery(e.target.value)}
                className="w-full bg-slate-950 border border-slate-800 rounded-2xl p-3 font-mono text-xs text-amber-300 focus:outline-none focus:border-amber-500"
              />
            </div>

            <div className="flex items-center justify-between">
              <div className="text-[11px] text-slate-400">
                Type any valid SQL statement (`SELECT`, `INSERT`, `UPDATE`, `SHOW TABLES`).
              </div>
              <button
                onClick={handleExecuteSql}
                disabled={isExecutingSql}
                className="px-5 py-2 rounded-xl bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-400 hover:to-orange-400 text-slate-950 font-bold text-xs shadow-md transition-all disabled:opacity-50 flex items-center gap-2"
              >
                {isExecutingSql ? (
                  <span>Executing...</span>
                ) : (
                  <>
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Execute SQL Query</span>
                  </>
                )}
              </button>
            </div>

            {/* SQL Execution Output */}
            {sqlResult && (
              <div className="mt-3 p-3.5 rounded-2xl bg-slate-950 border border-slate-800 text-xs">
                <div className="flex items-center justify-between pb-2 border-b border-slate-800 mb-2">
                  <span className="font-mono text-emerald-400 font-bold">
                    ✓ Query took {sqlResult.execution_time_ms || 1.2} ms ({sqlResult.rows_count || 0} rows returned)
                  </span>
                  <span className="text-slate-500 text-[10px] font-mono">{sqlResult.query}</span>
                </div>
                {sqlResult.rows && sqlResult.rows.length > 0 ? (
                  <div className="overflow-x-auto max-h-48">
                    <table className="w-full text-left font-mono text-[11px]">
                      <thead>
                        <tr className="text-slate-400 border-b border-slate-800">
                          {Object.keys(sqlResult.rows[0]).map((col) => (
                            <th key={col} className="p-1.5">
                              {col}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {sqlResult.rows.map((row: any, i: number) => (
                          <tr key={i} className="hover:bg-slate-900 border-b border-slate-900">
                            {Object.values(row).map((val: any, j: number) => (
                              <td key={j} className="p-1.5 text-slate-300">
                                {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                              </td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : (
                  <div className="text-slate-400">{sqlResult.message || 'Statement executed successfully.'}</div>
                )}
              </div>
            )}
          </div>

          {/* Database Tables Explorer */}
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Tables List Sidebar */}
            <div className="bg-slate-900 rounded-3xl border border-slate-800 p-4 space-y-2">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block px-2 mb-2">
                Tables ({dbTables.length})
              </span>
              <div className="space-y-1">
                {dbTables.map((tbl) => (
                  <button
                    key={tbl.name}
                    onClick={() => fetchTableRows(tbl.name)}
                    className={`w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-mono transition-all text-left ${
                      selectedTable === tbl.name
                        ? 'bg-amber-500 text-slate-950 font-bold shadow-sm'
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2">
                      <Table className="w-3.5 h-3.5" />
                      <span>{tbl.name}</span>
                    </div>
                    <span
                      className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${
                        selectedTable === tbl.name
                          ? 'bg-slate-950 text-amber-400'
                          : 'bg-slate-950 text-slate-500'
                      }`}
                    >
                      {tbl.rows_count}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            {/* Table Rows Viewer */}
            <div className="lg:col-span-3 bg-slate-900 rounded-3xl border border-slate-800 p-5 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-sm font-bold text-white flex items-center gap-2 font-mono">
                    <Table className="w-4 h-4 text-amber-400" />
                    <span>Table: {selectedTable}</span>
                  </h3>
                  <p className="text-[11px] text-slate-400">
                    Browsing live records from `wayfarer_travel_db`.`{selectedTable}`
                  </p>
                </div>
                <button
                  onClick={() => fetchTableRows(selectedTable)}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${isLoadingTable ? 'animate-spin' : ''}`} />
                </button>
              </div>

              {/* Rows Grid */}
              <div className="overflow-x-auto rounded-2xl border border-slate-800 max-h-96">
                {tableRows.length === 0 ? (
                  <div className="p-8 text-center text-xs text-slate-500">
                    No rows currently in `{selectedTable}`.
                  </div>
                ) : (
                  <table className="w-full text-left text-xs font-mono">
                    <thead className="bg-slate-950 text-[10px] uppercase text-slate-400 border-b border-slate-800 sticky top-0">
                      <tr>
                        {Object.keys(tableRows[0]).map((col) => (
                          <th key={col} className="p-3 font-bold">
                            {col}
                          </th>
                        ))}
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-800/60 text-slate-300">
                      {tableRows.map((row, idx) => (
                        <tr key={idx} className="hover:bg-slate-850 transition-colors">
                          {Object.values(row).map((val: any, j: number) => (
                            <td key={j} className="p-3 text-[11px] max-w-xs truncate">
                              {typeof val === 'object' ? JSON.stringify(val) : String(val)}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          </div>

          {/* phpMyAdmin Setup Instructions Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 space-y-3">
            <h4 className="text-sm font-bold text-white flex items-center gap-2">
              <FileCode className="w-4 h-4 text-amber-400" />
              <span>Importing into your local / cPanel phpMyAdmin</span>
            </h4>
            <p className="text-xs text-slate-300 leading-relaxed">
              WayFarer provides clean SQL DDL & DML scripts in the project root under <code className="text-amber-400 font-mono">db/schema.sql</code> and <code className="text-amber-400 font-mono">db/seeds.sql</code>.
            </p>
            <ol className="list-decimal list-inside space-y-1 text-xs text-slate-300">
              <li>Open your local or hosted phpMyAdmin (e.g. via XAMPP, WAMP, or cPanel at <code className="text-amber-400 font-mono">http://localhost/phpmyadmin</code>).</li>
              <li>Create a new database named <code className="text-amber-400 font-mono">wayfarer_travel_db</code> with Collation <code className="text-amber-400 font-mono">utf8mb4_unicode_ci</code>.</li>
              <li>Click on the <strong>Import</strong> tab and select the downloaded <code className="text-amber-400 font-mono">wayfarer_travel_db.sql</code> file, or run the schema script directly in the SQL tab.</li>
              <li>All tables for bookings, multi-day tours, destinations, users, and cultural festivals will be initialized instantly.</li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
};
