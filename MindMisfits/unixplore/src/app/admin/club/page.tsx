'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useToast } from "@/components/ui/use-toast";
import { Loader2, LogOut, Users, RefreshCw, LayoutDashboard, Megaphone, Calendar, Settings, ChevronRight, Plus, ExternalLink } from 'lucide-react';
import { motion } from 'framer-motion';

interface Stats {
    announcement_count: number;
    active_registrations: number;
    total_views: number;
}

export default function ClubAdminPage() {
    const router = useRouter();
    const { toast } = useToast();
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [loading, setLoading] = useState(false);
    const [statsLoading, setStatsLoading] = useState(false);
    const [error, setError] = useState('');
    const [adminData, setAdminData] = useState<any>(null);
    const [stats, setStats] = useState<Stats | null>(null);
    const [credentials, setCredentials] = useState({
        email: '',
        password: '',
    });
    const [activeTab, setActiveTab] = useState('dashboard');

    useEffect(() => {
        const token = localStorage.getItem('club_token');
        if (token) {
            setIsLoggedIn(true);
            fetchStats();
        }
    }, []);

    const fetchStats = async () => {
        setStatsLoading(true);
        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/stats', {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();

            if (data.success) {
                setStats(data.data);
            } else {
                if (response.status === 401) handleLogout();
            }
        } catch (error) {
            console.error('Error fetching stats:', error);
        } finally {
            setStatsLoading(false);
        }
    };

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/club/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(credentials),
            });

            const data = await response.json();

            if (data.success) {
                localStorage.setItem('club_token', data.data.token);
                setAdminData(data.data.admin);
                setIsLoggedIn(true);
                fetchStats();
            } else {
                setError(data.error || 'Login failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const handleLogout = () => {
        localStorage.removeItem('club_token');
        setIsLoggedIn(false);
        setAdminData(null);
        setStats(null);
        setCredentials({ email: '', password: '' });
    };

    const handleUpdateDetails = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);
        const data = Object.fromEntries(formData.entries());

        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/details', {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(data),
            });

            if (response.ok) {
                toast({ title: "Success", description: "Club details updated successfully" });
            } else {
                toast({ title: "Error", description: "Failed to update details", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handlePostAnnouncement = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/announcements', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (response.ok) {
                toast({ title: "Success", description: "Announcement posted" });
                fetchStats();
                (e.target as HTMLFormElement).reset();
            } else {
                toast({ title: "Error", description: "Failed to post announcement", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const handleAddRegistration = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget);

        try {
            const token = localStorage.getItem('club_token');
            const response = await fetch('/api/admin/club/registrations', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(Object.fromEntries(formData)),
            });

            if (response.ok) {
                toast({ title: "Success", description: "Registration link added" });
                fetchStats();
                (e.target as HTMLFormElement).reset();
            } else {
                toast({ title: "Error", description: "Failed to add registration", variant: "destructive" });
            }
        } catch (error) {
            toast({ title: "Error", description: "Network error", variant: "destructive" });
        } finally {
            setLoading(false);
        }
    };

    const getStatusBadge = (status: string) => {
        const variants: Record<string, any> = {
            approved: { variant: 'default', label: 'Approved', className: 'bg-green-500/20 text-green-400 hover:bg-green-500/30 border-green-500/50' },
            pending: { variant: 'secondary', label: 'Pending Approval', className: 'bg-yellow-500/20 text-yellow-400 hover:bg-yellow-500/30 border-yellow-500/50' },
            rejected: { variant: 'destructive', label: 'Rejected', className: 'bg-red-500/20 text-red-400 hover:bg-red-500/30 border-red-500/50' },
        };
        const config = variants[status] || variants.pending;
        return <Badge variant="outline" className={config.className}>{config.label}</Badge>;
    };

    if (!isLoggedIn) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-black relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/20 via-purple-900/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />

                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full relative z-10"
                >
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardHeader className="text-center pb-2">
                            <div className="mx-auto w-16 h-16 rounded-2xl bg-primary/20 flex items-center justify-center mb-4">
                                <Users className="h-8 w-8 text-primary" />
                            </div>
                            <CardTitle className="text-2xl font-bold text-white">Club Admin</CardTitle>
                            <CardDescription>Login to manage your community</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleLogin} className="space-y-4">
                                {error && (
                                    <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive text-sm">
                                        {error}
                                    </div>
                                )}

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                    <Input
                                        required
                                        type="email"
                                        value={credentials.email}
                                        onChange={(e) => setCredentials({ ...credentials, email: e.target.value })}
                                        placeholder="admin@example.com"
                                        className="bg-white/5 border-white/10 focus:border-primary"
                                    />
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Password</label>
                                    <Input
                                        required
                                        type="password"
                                        value={credentials.password}
                                        onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                                        placeholder="••••••••"
                                        className="bg-white/5 border-white/10 focus:border-primary"
                                    />
                                </div>

                                <Button type="submit" className="w-full h-11 bg-primary hover:bg-primary/90" disabled={loading}>
                                    {loading ? (
                                        <>
                                            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                            Logging in...
                                        </>
                                    ) : (
                                        'Login to Dashboard'
                                    )}
                                </Button>

                                <p className="text-sm text-center text-muted-foreground">
                                    Don&apos;t have an account?{' '}
                                    <a href="/register/club" className="text-primary hover:underline font-medium">
                                        Register Club
                                    </a>
                                </p>
                            </form>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-background flex">
            {/* Sidebar */}
            <div className="w-64 bg-card border-r border-white/10 hidden md:flex flex-col">
                <div className="p-6 border-b border-white/10">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-primary/20 flex items-center justify-center">
                            <Users className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                            <h2 className="font-bold text-white">UniXplore</h2>
                            <p className="text-xs text-muted-foreground">Club Admin</p>
                        </div>
                    </div>
                </div>

                <div className="flex-1 py-6 px-4 space-y-2">
                    <Button
                        variant={activeTab === 'dashboard' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('dashboard')}
                    >
                        <LayoutDashboard className="mr-2 h-4 w-4" />
                        Dashboard
                    </Button>
                    <Button
                        variant={activeTab === 'announcements' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('announcements')}
                    >
                        <Megaphone className="mr-2 h-4 w-4" />
                        Announcements
                    </Button>
                    <Button
                        variant={activeTab === 'registrations' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('registrations')}
                    >
                        <Calendar className="mr-2 h-4 w-4" />
                        Registrations
                    </Button>
                    <Button
                        variant={activeTab === 'settings' ? 'secondary' : 'ghost'}
                        className="w-full justify-start"
                        onClick={() => setActiveTab('settings')}
                    >
                        <Settings className="mr-2 h-4 w-4" />
                        Settings
                    </Button>
                </div>

                <div className="p-4 border-t border-white/10">
                    <div className="flex items-center gap-3 mb-4 px-2">
                        <div className="w-8 h-8 rounded-full bg-primary/20 flex items-center justify-center">
                            <span className="text-xs font-bold text-primary">CA</span>
                        </div>
                        <div className="overflow-hidden">
                            <p className="text-sm font-medium truncate text-white">Admin</p>
                            <p className="text-xs text-muted-foreground truncate">{adminData?.clubName}</p>
                        </div>
                    </div>
                    <Button variant="outline" className="w-full border-white/10 hover:bg-destructive/10 hover:text-destructive hover:border-destructive/20" onClick={handleLogout}>
                        <LogOut className="mr-2 h-4 w-4" />
                        Logout
                    </Button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 flex flex-col overflow-hidden">
                {/* Header */}
                <header className="h-16 border-b border-white/10 bg-card/50 backdrop-blur-sm flex items-center justify-between px-6">
                    <div className="flex items-center gap-4">
                        <h1 className="text-xl font-semibold text-white">
                            {activeTab === 'dashboard' && 'Dashboard Overview'}
                            {activeTab === 'announcements' && 'Announcements'}
                            {activeTab === 'registrations' && 'Manage Registrations'}
                            {activeTab === 'settings' && 'Club Settings'}
                        </h1>
                        {adminData?.clubStatus && getStatusBadge(adminData.clubStatus)}
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="outline" size="icon" onClick={fetchStats} disabled={statsLoading} className="border-white/10">
                            <RefreshCw className={`h-4 w-4 ${statsLoading ? 'animate-spin' : ''}`} />
                        </Button>
                    </div>
                </header>

                {/* Content Scrollable Area */}
                <main className="flex-1 overflow-y-auto p-6">
                    <div className="max-w-6xl mx-auto space-y-8">
                        {adminData?.clubStatus === 'pending' && (
                            <Card className="border-yellow-500/20 bg-yellow-500/10 mb-6">
                                <CardContent className="pt-6 flex items-start gap-4">
                                    <div className="p-2 bg-yellow-500/20 rounded-lg">
                                        <Loader2 className="h-5 w-5 text-yellow-500 animate-spin" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-yellow-500 mb-1">Pending Approval</h3>
                                        <p className="text-sm text-yellow-200/80">
                                            Your club registration is awaiting approval from your college admin.
                                            Some features may be limited until approved.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {adminData?.clubStatus === 'rejected' && (
                            <Card className="border-destructive/20 bg-destructive/10 mb-6">
                                <CardContent className="pt-6 flex items-start gap-4">
                                    <div className="p-2 bg-destructive/20 rounded-lg">
                                        <LogOut className="h-5 w-5 text-destructive" />
                                    </div>
                                    <div>
                                        <h3 className="font-semibold text-destructive mb-1">Registration Rejected</h3>
                                        <p className="text-sm text-destructive/80">
                                            Your club registration was not approved. Please contact your college admin for more information.
                                        </p>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {activeTab === 'dashboard' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-8">
                                {/* Stats Grid */}
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                    <Card className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border-blue-500/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-blue-400">Announcements</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-white">{stats?.announcement_count ?? '-'}</div>
                                            <p className="text-xs text-muted-foreground mt-1">Published updates</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-amber-500/10 to-orange-500/10 border-amber-500/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-amber-400">Active Registrations</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-white">{stats?.active_registrations ?? '-'}</div>
                                            <p className="text-xs text-muted-foreground mt-1">Ongoing events</p>
                                        </CardContent>
                                    </Card>
                                    <Card className="bg-gradient-to-br from-purple-500/10 to-pink-500/10 border-purple-500/20">
                                        <CardHeader className="pb-2">
                                            <CardTitle className="text-sm font-medium text-purple-400">Total Views</CardTitle>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-4xl font-bold text-white">{stats?.total_views ?? '-'}</div>
                                            <p className="text-xs text-muted-foreground mt-1">Club page visits</p>
                                        </CardContent>
                                    </Card>
                                </div>

                                {/* Quick Actions */}
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                                    <Card className="border-white/10 bg-card/50">
                                        <CardHeader>
                                            <CardTitle>Quick Actions</CardTitle>
                                            <CardDescription>Manage your club content</CardDescription>
                                        </CardHeader>
                                        <CardContent className="space-y-3">
                                            <Button variant="outline" className="w-full justify-between group border-white/10 hover:bg-white/5" onClick={() => setActiveTab('announcements')}>
                                                <span className="flex items-center"><Megaphone className="mr-2 h-4 w-4 text-muted-foreground" /> Post Announcement</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button variant="outline" className="w-full justify-between group border-white/10 hover:bg-white/5" onClick={() => setActiveTab('registrations')}>
                                                <span className="flex items-center"><Calendar className="mr-2 h-4 w-4 text-muted-foreground" /> Create Registration</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                            <Button variant="outline" className="w-full justify-between group border-white/10 hover:bg-white/5" onClick={() => setActiveTab('settings')}>
                                                <span className="flex items-center"><Settings className="mr-2 h-4 w-4 text-muted-foreground" /> Edit Club Details</span>
                                                <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:translate-x-1 transition-transform" />
                                            </Button>
                                        </CardContent>
                                    </Card>

                                    <Card className="border-white/10 bg-card/50">
                                        <CardHeader>
                                            <CardTitle>Recent Activity</CardTitle>
                                            <CardDescription>Latest updates from your club</CardDescription>
                                        </CardHeader>
                                        <CardContent>
                                            <div className="text-center py-8 text-muted-foreground text-sm">
                                                Activity feed coming soon...
                                            </div>
                                        </CardContent>
                                    </Card>
                                </div>
                            </motion.div>
                        )}

                        {activeTab === 'announcements' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <Card className="border-white/10 bg-card/50">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Announcements</CardTitle>
                                            <CardDescription>Post updates for your club members</CardDescription>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="bg-primary hover:bg-primary/90">
                                                    <Plus className="mr-2 h-4 w-4" /> New Post
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>New Announcement</DialogTitle>
                                                    <DialogDescription>Post an update for your club members</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handlePostAnnouncement} className="space-y-4 mt-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Title</label>
                                                        <Input name="title" required placeholder="Announcement Title" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Content</label>
                                                        <Textarea
                                                            name="content"
                                                            required
                                                            placeholder="Write your announcement here..."
                                                            className="min-h-[150px]"
                                                        />
                                                    </div>
                                                    <Button type="submit" className="w-full" disabled={loading}>
                                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Post Announcement'}
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Megaphone className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p>No announcements yet. Create your first post!</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 'registrations' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <Card className="border-white/10 bg-card/50">
                                    <CardHeader className="flex flex-row items-center justify-between">
                                        <div>
                                            <CardTitle>Registrations</CardTitle>
                                            <CardDescription>Manage recruitment drives and event signups</CardDescription>
                                        </div>
                                        <Dialog>
                                            <DialogTrigger asChild>
                                                <Button className="bg-primary hover:bg-primary/90">
                                                    <Plus className="mr-2 h-4 w-4" /> Add Link
                                                </Button>
                                            </DialogTrigger>
                                            <DialogContent>
                                                <DialogHeader>
                                                    <DialogTitle>Add Registration Link</DialogTitle>
                                                    <DialogDescription>Create a new registration event</DialogDescription>
                                                </DialogHeader>
                                                <form onSubmit={handleAddRegistration} className="space-y-4 mt-4">
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Event Title</label>
                                                        <Input name="title" required placeholder="e.g. Winter Recruitment 2024" />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Registration Link</label>
                                                        <Input name="link" type="url" required placeholder="https://forms.google.com/..." />
                                                    </div>
                                                    <div>
                                                        <label className="text-sm font-medium mb-1.5 block">Deadline (Optional)</label>
                                                        <Input name="deadline" type="datetime-local" />
                                                    </div>
                                                    <Button type="submit" className="w-full" disabled={loading}>
                                                        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Create Registration'}
                                                    </Button>
                                                </form>
                                            </DialogContent>
                                        </Dialog>
                                    </CardHeader>
                                    <CardContent>
                                        <div className="text-center py-12 text-muted-foreground">
                                            <Calendar className="h-12 w-12 mx-auto mb-4 opacity-20" />
                                            <p>No active registrations. Add a link to get started!</p>
                                        </div>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}

                        {activeTab === 'settings' && (
                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="space-y-6">
                                <Card className="border-white/10 bg-card/50">
                                    <CardHeader>
                                        <CardTitle>Club Settings</CardTitle>
                                        <CardDescription>Update your club's public profile</CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <form onSubmit={handleUpdateDetails} className="space-y-6 max-w-2xl">
                                            <div className="space-y-2">
                                                <label className="text-sm font-medium text-gray-300">Description</label>
                                                <Textarea
                                                    name="description"
                                                    placeholder="About your club..."
                                                    className="min-h-[100px] bg-white/5 border-white/10"
                                                    defaultValue={adminData?.description}
                                                />
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Email</label>
                                                    <Input name="email" type="email" defaultValue={adminData?.email} className="bg-white/5 border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Phone</label>
                                                    <Input name="phone" type="tel" defaultValue={adminData?.phone} className="bg-white/5 border-white/10" />
                                                </div>
                                            </div>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Website</label>
                                                    <Input name="website" type="url" placeholder="https://" defaultValue={adminData?.website} className="bg-white/5 border-white/10" />
                                                </div>
                                                <div className="space-y-2">
                                                    <label className="text-sm font-medium text-gray-300">Instagram</label>
                                                    <Input name="instagram" placeholder="@username" defaultValue={adminData?.instagram} className="bg-white/5 border-white/10" />
                                                </div>
                                            </div>
                                            <Button type="submit" disabled={loading}>
                                                {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Changes'}
                                            </Button>
                                        </form>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        )}
                    </div>
                </main>
            </div>
        </div>
    );
}
