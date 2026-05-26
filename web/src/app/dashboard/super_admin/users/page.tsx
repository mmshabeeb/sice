'use client';

import { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  User,
  Mail,
  Lock,
  Trash2,
  Edit2,
  X,
  Check,
  Building,
  ToggleLeft,
  ToggleRight,
  Shield,
  Briefcase,
  AlertCircle,
  RotateCw,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { apiFetch } from '@/utils/api';

const GOLD = '#C9A84C';

interface UserItem {
  uid: string;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'suspended';
  chapter_id?: string | null;
}

interface ChapterItem {
  id: string;
  name: string;
  city: string;
  state: string;
}

export default function SuperAdminUsers() {
  const [users, setUsers] = useState<UserItem[]>([]);
  const [chapters, setChapters] = useState<ChapterItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  // Modals state
  const [isCreateOpen, setIsCreateOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  
  // Selected user for Edit/Delete
  const [selectedUser, setSelectedUser] = useState<UserItem | null>(null);

  // Search & Filter
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Pagination
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 25;

  // Reset page when filters change
  useEffect(() => {
    setCurrentPage(1);
  }, [searchQuery, roleFilter, statusFilter]);

  // Form states
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [chapterId, setChapterId] = useState('');
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  const fetchUsers = async () => {
    try {
      const res = await apiFetch('/api/admin/applications?type=all_users');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          // Normalize user status (default to active)
          const normalized = (data.users || []).map((u: any) => ({
            ...u,
            status: u.status || 'active',
          }));
          setUsers(normalized);
        }
      }
    } catch (err) {
      console.error('Failed to fetch users:', err);
    }
  };

  const fetchChapters = async () => {
    try {
      const res = await apiFetch('/api/admin/applications?type=chapters');
      if (res.ok) {
        const data = await res.json();
        if (data.success) {
          setChapters(data.chapters || []);
        }
      }
    } catch (err) {
      console.error('Failed to fetch chapters:', err);
    }
  };

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchChapters()]);
      setLoading(false);
    };
    loadData();
  }, []);

  const handleRefresh = async () => {
    setRefreshing(true);
    try {
      await Promise.all([fetchUsers(), fetchChapters()]);
    } catch (err) {
      console.error('Failed to refresh data:', err);
    } finally {
      setRefreshing(false);
    }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName || !email || !password || !role) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_admin_user',
          full_name: fullName,
          email,
          password,
          role,
          chapter_id: role === 'admin' ? chapterId : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await fetchUsers();
        setIsCreateOpen(false);
        // Reset form
        setFullName('');
        setEmail('');
        setPassword('');
        setRole('admin');
        setChapterId('');
      } else {
        setFormError(data.error || 'Failed to create user.');
      }
    } catch (err) {
      console.error(err);
      setFormError('An unexpected error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedUser || !fullName || !role) {
      setFormError('Please fill in all required fields.');
      return;
    }

    setFormLoading(true);
    setFormError(null);

    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'update_admin_user',
          uid: selectedUser.uid,
          full_name: fullName,
          role,
          chapter_id: role === 'admin' ? chapterId : null,
        }),
      });

      const data = await res.json();
      if (res.ok && data.success) {
        await fetchUsers();
        setIsEditOpen(false);
        setSelectedUser(null);
        setFullName('');
        setRole('admin');
        setChapterId('');
      } else {
        setFormError(data.error || 'Failed to update user.');
      }
    } catch (err) {
      console.error(err);
      setFormError('An unexpected error occurred.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteUser = async () => {
    if (!selectedUser) return;
    setFormLoading(true);
    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'delete_admin_user',
          uid: selectedUser.uid,
        }),
      });
      if (res.ok) {
        await fetchUsers();
        setIsDeleteOpen(false);
        setSelectedUser(null);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setFormLoading(false);
    }
  };

  const toggleUserStatus = async (uid: string) => {
    try {
      const res = await apiFetch('/api/admin/applications', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'toggle_user_status',
          uid,
        }),
      });
      if (res.ok) {
        await fetchUsers();
      }
    } catch (err) {
      console.error('Failed to toggle status:', err);
    }
  };

  const openCreateModal = () => {
    setFullName('');
    setEmail('');
    setPassword('');
    setRole('admin');
    setChapterId(chapters[0]?.id || '');
    setFormError(null);
    setIsCreateOpen(true);
  };

  const openEditModal = (user: UserItem) => {
    setSelectedUser(user);
    setFullName(user.name);
    setRole(user.role);
    setChapterId(user.chapter_id || (chapters[0]?.id || ''));
    setFormError(null);
    setIsEditOpen(true);
  };

  const openDeleteModal = (user: UserItem) => {
    setSelectedUser(user);
    setIsDeleteOpen(true);
  };

  // Filters calculation
  const filteredUsers = users.filter((u) => {
    const q = searchQuery.toLowerCase();
    const matchesSearch =
      u.name.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q) ||
      u.uid.toLowerCase().includes(q);

    const matchesRole = roleFilter === 'all' || u.role === roleFilter;
    const matchesStatus = statusFilter === 'all' || u.status === statusFilter;

    return matchesSearch && matchesRole && matchesStatus;
  });

  // Paginated users
  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const paginatedUsers = filteredUsers.slice(startIndex, startIndex + itemsPerPage);

  // Role Badges
  const getRoleBadge = (role: string) => {
    switch (role) {
      case 'super_admin':
        return (
          <Badge className="border border-[#C9A84C]/25 bg-[#C9A84C]/10 text-[#C9A84C] hover:bg-[#C9A84C]/15 font-bold uppercase tracking-wider text-[10px]">
            Super Admin
          </Badge>
        );
      case 'admin':
        return (
          <Badge className="border border-amber-500/20 bg-amber-500/10 text-amber-400 hover:bg-amber-500/15 font-bold uppercase tracking-wider text-[10px]">
            Chapter Admin
          </Badge>
        );
      case 'employee':
        return (
          <Badge className="border border-indigo-500/20 bg-indigo-500/10 text-indigo-400 hover:bg-indigo-500/15 font-bold uppercase tracking-wider text-[10px]">
            Employee
          </Badge>
        );
      case 'merchant':
        return (
          <Badge className="border border-cyan-500/20 bg-cyan-500/10 text-cyan-400 hover:bg-cyan-500/15 font-bold uppercase tracking-wider text-[10px]">
            Merchant
          </Badge>
        );
      case 'creator':
        return (
          <Badge className="border border-emerald-500/20 bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/15 font-bold uppercase tracking-wider text-[10px]">
            Creator
          </Badge>
        );
      default:
        return (
          <Badge className="border border-white/10 bg-white/5 text-gray-400 hover:bg-white/10 font-bold uppercase tracking-wider text-[10px]">
            {role}
          </Badge>
        );
    }
  };

  // Stats calculation
  const totalUsers = users.length;
  const adminCount = users.filter((u) => u.role === 'admin' || u.role === 'super_admin').length;
  const employeeCount = users.filter((u) => u.role === 'employee').length;
  const activeCount = users.filter((u) => u.status === 'active').length;

  return (
    <div className="space-y-6">
      {/* HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-[#F0EBE0] font-bricolage tracking-tight">
            User Directory
          </h1>
          <p className="text-sm text-gray-400">
            System-wide user provisioning, role assignments, and account deactivations.
          </p>
        </div>
        <button
          onClick={openCreateModal}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-transform active:scale-[0.98] shadow-lg shadow-amber-500/10 hover:brightness-105"
          style={{ background: GOLD, color: '#080D26' }}
        >
          <Plus size={16} strokeWidth={2.5} />
          Create New User
        </button>
      </div>

      {/* STATS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Members
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-white font-bricolage">{totalUsers}</div>
            <p className="text-[10px] text-gray-500 mt-1">Across all application systems</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Total Administrators
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-[#C9A84C] font-bricolage">{adminCount}</div>
            <p className="text-[10px] text-gray-500 mt-1">Super & regional chapter admins</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Employees
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-indigo-400 font-bricolage">{employeeCount}</div>
            <p className="text-[10px] text-gray-500 mt-1">Internal operations team</p>
          </CardContent>
        </Card>

        <Card className="border-white/5 bg-white/[0.02] backdrop-blur-sm">
          <CardHeader className="pb-2">
            <CardTitle className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Active Logins
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-400 font-bricolage">{activeCount}</div>
            <p className="text-[10px] text-gray-500 mt-1">Status set to active in system</p>
          </CardContent>
        </Card>
      </div>

      {/* FILTER & ACTIONS BAR */}
      <div className="flex flex-col md:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
          <input
            type="text"
            placeholder="Search by name, email, or user ID..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/[0.03] border border-white/10 rounded-xl pl-10 pr-4 py-2.5 text-sm text-white placeholder-gray-400 focus:outline-none focus:border-amber-500/50 transition-colors"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X size={16} />
            </button>
          )}
        </div>

        <div className="flex flex-wrap gap-2">
          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => setRoleFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all" style={{ background: '#080D26', color: '#fff' }}>All Roles</option>
            <option value="super_admin" style={{ background: '#080D26', color: '#fff' }}>Super Admins</option>
            <option value="admin" style={{ background: '#080D26', color: '#fff' }}>Chapter Admins</option>
            <option value="employee" style={{ background: '#080D26', color: '#fff' }}>Employees</option>
            <option value="merchant" style={{ background: '#080D26', color: '#fff' }}>Merchants</option>
            <option value="creator" style={{ background: '#080D26', color: '#fff' }}>Creators</option>
          </select>

          {/* Status Filter */}
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-white/[0.03] border border-white/10 rounded-xl px-4 py-2 text-sm text-white focus:outline-none focus:border-amber-500/50 cursor-pointer"
            style={{ colorScheme: 'dark' }}
          >
            <option value="all" style={{ background: '#080D26', color: '#fff' }}>All Statuses</option>
            <option value="active" style={{ background: '#080D26', color: '#fff' }}>Active</option>
            <option value="suspended" style={{ background: '#080D26', color: '#fff' }}>Suspended</option>
          </select>

          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center justify-center gap-2 bg-white/[0.03] hover:bg-white/[0.08] active:scale-[0.98] border border-white/10 rounded-xl px-4 py-2 text-sm text-white transition-all duration-200 disabled:opacity-50"
            title="Refresh User Data"
          >
            <RotateCw
              size={16}
              className={`${refreshing ? 'animate-spin text-[#C9A84C]' : 'text-gray-400 hover:text-white transition-colors'}`}
            />
            <span>{refreshing ? 'Syncing...' : 'Sync Data'}</span>
          </button>
        </div>
      </div>

      {/* TABLE */}
      <Card className="border-white/5 bg-white/[0.01] backdrop-blur-sm overflow-hidden">
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <Table>
              <TableHeader className="bg-white/[0.02]">
                <TableRow className="border-white/5 hover:bg-transparent">
                  <TableHead className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">User Details</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">User ID (UID)</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Role</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Associated Chapter</TableHead>
                  <TableHead className="text-gray-400 font-bold uppercase tracking-wider text-[10px]">Status</TableHead>
                  <TableHead className="text-right text-gray-400 font-bold uppercase tracking-wider text-[10px]">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {loading ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-sm text-gray-500">
                      Loading user data...
                    </TableCell>
                  </TableRow>
                ) : filteredUsers.length === 0 ? (
                  <TableRow className="hover:bg-transparent">
                    <TableCell colSpan={6} className="text-center py-12 text-sm text-gray-500">
                      No users found. Try adjusting your filters.
                    </TableCell>
                  </TableRow>
                ) : (
                  paginatedUsers.map((u) => {
                    const initials = u.name
                      ? u.name
                          .split(' ')
                          .map((n) => n[0])
                          .join('')
                          .toUpperCase()
                          .slice(0, 2)
                      : '??';

                    return (
                      <TableRow key={u.uid} className="border-white/5 hover:bg-white/[0.01] transition-colors">
                        <TableCell>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold bg-[#C9A84C]/10 border border-[#C9A84C]/25 text-[#C9A84C]">
                              {initials}
                            </div>
                            <div className="flex flex-col min-w-0">
                              <span className="text-sm font-semibold text-white truncate max-w-[180px]">
                                {u.name}
                              </span>
                              <span className="text-xs text-gray-400 truncate max-w-[200px]">
                                {u.email}
                              </span>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell className="font-mono text-xs text-gray-400 max-w-[120px] truncate">
                          {u.uid}
                        </TableCell>
                        <TableCell>{getRoleBadge(u.role)}</TableCell>
                        <TableCell>
                          {u.role === 'admin' ? (
                            u.chapter_id ? (
                              <div className="flex items-center gap-1.5 text-xs text-white">
                                <Building size={13} className="text-[#C9A84C]" />
                                <span className="capitalize">{u.chapter_id.replace('-', ' ')}</span>
                              </div>
                            ) : (
                              <span className="text-xs text-rose-400 font-medium">Unassigned Chapter</span>
                            )
                          ) : (
                            <span className="text-xs text-gray-600">N/A</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              u.status === 'active'
                                ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                                : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                            }`}
                          >
                            {u.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-2.5">
                            <button
                              onClick={() => toggleUserStatus(u.uid)}
                              className="text-gray-400 hover:text-white transition-colors"
                              title={u.status === 'active' ? 'Suspend Account' : 'Activate Account'}
                            >
                              {u.status === 'active' ? (
                                <ToggleRight size={22} className="text-emerald-500" />
                              ) : (
                                <ToggleLeft size={22} className="text-gray-600" />
                              )}
                            </button>
                            <button
                              onClick={() => openEditModal(u)}
                              className="text-gray-400 hover:text-white transition-colors p-1"
                              title="Edit User"
                            >
                              <Edit2 size={14} />
                            </button>
                            <button
                              onClick={() => openDeleteModal(u)}
                              className="text-rose-400 hover:text-rose-300 transition-colors p-1"
                              title="Delete User"
                            >
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>

        {/* PAGINATION CONTROLS */}
        {filteredUsers.length > 0 && (
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-4 border-t border-white/5 bg-white/[0.01]">
            <div className="text-xs text-gray-400">
              Showing <span className="font-semibold text-white">{Math.min(startIndex + 1, filteredUsers.length)}</span> to{' '}
              <span className="font-semibold text-white">
                {Math.min(startIndex + itemsPerPage, filteredUsers.length)}
              </span>{' '}
              of <span className="font-semibold text-white">{filteredUsers.length}</span> users
            </div>
            <div className="flex items-center gap-1.5">
              {/* First Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-white/5 transition-all active:scale-[0.95]"
                title="First Page"
              >
                <ChevronsLeft size={14} />
              </button>

              {/* Previous Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                disabled={currentPage === 1}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-white/5 transition-all active:scale-[0.95]"
                title="Previous Page"
              >
                <ChevronLeft size={14} />
              </button>

              {/* Page indicators */}
              <div className="flex items-center gap-1">
                {Array.from({ length: totalPages }, (_, idx) => idx + 1)
                  .filter((page) => {
                    return (
                      page === 1 ||
                      page === totalPages ||
                      Math.abs(page - currentPage) <= 1
                    );
                  })
                  .map((page, index, array) => {
                    const isGap = index > 0 && page - array[index - 1] > 1;
                    return (
                      <div key={page} className="flex items-center gap-1">
                        {isGap && <span className="px-1 text-xs text-gray-500">...</span>}
                        <button
                          type="button"
                          onClick={() => setCurrentPage(page)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-semibold border transition-all active:scale-[0.95] ${
                            currentPage === page
                              ? 'border-[#C9A84C] text-[#C9A84C] bg-[#C9A84C]/10 font-bold'
                              : 'border-white/10 bg-white/5 text-gray-400 hover:text-white'
                          }`}
                        >
                          {page}
                        </button>
                      </div>
                    );
                  })}
              </div>

              {/* Next Page */}
              <button
                type="button"
                onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-white/5 transition-all active:scale-[0.95]"
                title="Next Page"
              >
                <ChevronRight size={14} />
              </button>

              {/* Last Page */}
              <button
                type="button"
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className="p-2 rounded-xl bg-white/5 border border-white/10 text-gray-400 hover:text-white disabled:opacity-30 disabled:hover:text-gray-400 disabled:hover:bg-white/5 transition-all active:scale-[0.95]"
                title="Last Page"
              >
                <ChevronsRight size={14} />
              </button>
            </div>
          </div>
        )}
      </Card>

      {/* CREATE USER DIALOG (MODAL) */}
      {isCreateOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl border-0 p-6 space-y-6"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white font-bricolage">
                Create Administrative User
              </h3>
              <button
                onClick={() => setIsCreateOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleCreateUser} className="space-y-4">
              {formError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    disabled={formLoading}
                    placeholder="e.g. Muhammed Shabeeb"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-55"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Email Address *
                </label>
                <div className="relative">
                  <Mail size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="email"
                    required
                    disabled={formLoading}
                    placeholder="e.g. shabeeb@sice.media"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-55"
                  />
                </div>
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Password *
                </label>
                <div className="relative">
                  <Lock size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="password"
                    required
                    disabled={formLoading}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-55"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Role *
                  </label>
                  <select
                    value={role}
                    disabled={formLoading}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value === 'admin' && !chapterId && chapters.length > 0) {
                        setChapterId(chapters[0].id);
                      }
                    }}
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer disabled:opacity-55"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="super_admin" style={{ background: '#080D26' }}>Super Admin</option>
                    <option value="admin" style={{ background: '#080D26' }}>Chapter Admin</option>
                    <option value="employee" style={{ background: '#080D26' }}>Employee</option>
                    <option value="merchant" style={{ background: '#080D26' }}>Merchant</option>
                    <option value="creator" style={{ background: '#080D26' }}>Creator</option>
                  </select>
                </div>

                {role === 'admin' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Assign Chapter *
                    </label>
                    <select
                      value={chapterId}
                      required
                      disabled={formLoading}
                      onChange={(e) => setChapterId(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer disabled:opacity-55"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" disabled style={{ background: '#080D26' }}>Choose chapter</option>
                      {chapters.map((ch) => (
                        <option key={ch.id} value={ch.id} style={{ background: '#080D26' }}>
                          {ch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  disabled={formLoading}
                  onClick={() => setIsCreateOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-55"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !fullName || !email || !password}
                  className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-transform active:scale-[0.98]"
                  style={{ background: GOLD, color: '#080D26' }}
                >
                  {formLoading ? 'Creating...' : 'Create User'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* EDIT USER DIALOG (MODAL) */}
      {isEditOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-md rounded-2xl border-0 p-6 space-y-6"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-lg font-bold text-white font-bricolage">
                Edit User Details
              </h3>
              <button
                onClick={() => setIsEditOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <form onSubmit={handleEditUser} className="space-y-4">
              {formError && (
                <div className="text-xs text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl flex items-center gap-2">
                  <AlertCircle size={14} />
                  {formError}
                </div>
              )}

              <div className="flex flex-col gap-1.5">
                <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                  Full Name *
                </label>
                <div className="relative">
                  <User size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
                  <input
                    type="text"
                    required
                    disabled={formLoading}
                    placeholder="e.g. Muhammed Shabeeb"
                    value={fullName}
                    onChange={(e) => setFullName(e.target.value)}
                    className="w-full bg-white/5 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors disabled:opacity-55"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1.5">
                  <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                    Role *
                  </label>
                  <select
                    value={role}
                    disabled={formLoading}
                    onChange={(e) => {
                      setRole(e.target.value);
                      if (e.target.value === 'admin' && !chapterId && chapters.length > 0) {
                        setChapterId(chapters[0].id);
                      }
                    }}
                    className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer disabled:opacity-55"
                    style={{ colorScheme: 'dark' }}
                  >
                    <option value="super_admin" style={{ background: '#080D26' }}>Super Admin</option>
                    <option value="admin" style={{ background: '#080D26' }}>Chapter Admin</option>
                    <option value="employee" style={{ background: '#080D26' }}>Employee</option>
                    <option value="merchant" style={{ background: '#080D26' }}>Merchant</option>
                    <option value="creator" style={{ background: '#080D26' }}>Creator</option>
                  </select>
                </div>

                {role === 'admin' && (
                  <div className="flex flex-col gap-1.5">
                    <label className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">
                      Assign Chapter *
                    </label>
                    <select
                      value={chapterId}
                      required
                      disabled={formLoading}
                      onChange={(e) => setChapterId(e.target.value)}
                      className="bg-white/5 border border-white/10 rounded-xl px-3.5 py-2.5 text-sm text-white focus:outline-none focus:border-amber-500/50 transition-colors cursor-pointer disabled:opacity-55"
                      style={{ colorScheme: 'dark' }}
                    >
                      <option value="" disabled style={{ background: '#080D26' }}>Choose chapter</option>
                      {chapters.map((ch) => (
                        <option key={ch.id} value={ch.id} style={{ background: '#080D26' }}>
                          {ch.name}
                        </option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  disabled={formLoading}
                  onClick={() => setIsEditOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-55"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={formLoading || !fullName || !role}
                  className="px-4 py-2 rounded-xl text-xs font-semibold disabled:opacity-50 transition-transform active:scale-[0.98]"
                  style={{ background: GOLD, color: '#080D26' }}
                >
                  {formLoading ? 'Saving...' : 'Save Changes'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG (MODAL) */}
      {isDeleteOpen && selectedUser && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
          <div
            className="w-full max-w-sm rounded-2xl border-0 p-6 space-y-6"
            style={{
              background: '#080D26',
              border: '1px solid rgba(240, 235, 224, 0.15)',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.5)',
            }}
          >
            <div className="flex justify-between items-center">
              <h3 className="text-base font-bold text-white font-bricolage">
                Delete System User
              </h3>
              <button
                onClick={() => setIsDeleteOpen(false)}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <X size={18} />
              </button>
            </div>

            <div className="space-y-4">
              <p className="text-xs text-gray-300">
                Are you absolutely sure you want to permanently delete user <strong className="text-white">{selectedUser.name}</strong>?
              </p>
              <p className="text-[10px] text-rose-400 bg-rose-500/10 border border-rose-500/20 p-2.5 rounded-xl">
                Warning: This action will delete this user from both SICE Database and Auth systems. The user will lose access immediately. This cannot be undone.
              </p>

              <div className="flex justify-end gap-3 pt-4 border-t border-white/5">
                <button
                  type="button"
                  disabled={formLoading}
                  onClick={() => setIsDeleteOpen(false)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:text-white hover:bg-white/5 transition-colors disabled:opacity-55"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDeleteUser}
                  disabled={formLoading}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-white bg-rose-600 hover:bg-rose-500 transition-transform active:scale-[0.98] disabled:opacity-50"
                >
                  {formLoading ? 'Deleting...' : 'Delete Permanently'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
