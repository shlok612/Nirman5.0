'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, Loader2, CheckCircle2, Users, Building2, Mail, Lock, User, Tag, FileText } from 'lucide-react';
import { motion } from 'framer-motion';

interface Category {
    id: number;
    name: string;
    slug: string;
}

export default function ClubRegistrationPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [formData, setFormData] = useState({
        name: '',
        collegeId: '',
        email: '',
        categoryId: '',
        adminName: '',
        adminEmail: '',
        adminPassword: '',
        description: '',
    });

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const response = await fetch('/api/categories');
            const data = await response.json();
            if (data.success) {
                setCategories(data.data);
            }
        } catch (err) {
            console.error('Error fetching categories:', err);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        setError('');

        try {
            const response = await fetch('/api/auth/club/register', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                    ...formData,
                    categoryId: parseInt(formData.categoryId),
                }),
            });

            const data = await response.json();

            if (data.success) {
                setSuccess(true);
            } else {
                setError(data.error || 'Registration failed');
            }
        } catch (err) {
            setError('Network error. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4 bg-background">
                <motion.div
                    initial={{ scale: 0.9, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="max-w-md w-full"
                >
                    <Card className="border-white/10 bg-white/5 backdrop-blur-xl">
                        <CardContent className="pt-12 pb-12 text-center space-y-6">
                            <div className="flex justify-center">
                                <div className="w-20 h-20 rounded-full bg-green-500/20 flex items-center justify-center animate-bounce">
                                    <CheckCircle2 className="h-10 w-10 text-green-500" />
                                </div>
                            </div>
                            <div>
                                <h2 className="text-3xl font-bold mb-2 text-white">Registration Submitted!</h2>
                                <p className="text-muted-foreground mb-4">
                                    Your club registration has been submitted successfully.
                                </p>
                                <div className="bg-black/40 p-6 rounded-2xl border border-white/10 mb-6">
                                    <p className="text-sm text-gray-300">
                                        Your registration is pending approval from the college admin.
                                        You'll be able to access your dashboard once approved.
                                    </p>
                                </div>
                            </div>
                            <div className="flex flex-col sm:flex-row gap-3 justify-center">
                                <Link href="/admin/club" className="w-full">
                                    <Button size="lg" className="w-full bg-primary hover:bg-primary/90">Try Login</Button>
                                </Link>
                                <Link href="/" className="w-full">
                                    <Button size="lg" variant="outline" className="w-full border-white/10 hover:bg-white/5">Back to Home</Button>
                                </Link>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col lg:flex-row">
            {/* Left Side - Visual */}
            <div className="hidden lg:flex lg:w-1/2 relative bg-black items-center justify-center overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-bl from-purple-900/20 via-primary/20 to-black z-0" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20 z-0" />

                <div className="relative z-10 p-12 text-center space-y-6 max-w-lg">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.2 }}
                    >
                        <h1 className="text-5xl font-bold text-white mb-4">Start a Community</h1>
                        <p className="text-xl text-gray-400">
                            Create a space for students to connect, learn, and grow together.
                        </p>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ delay: 0.6 }}
                        className="grid grid-cols-2 gap-4 mt-12"
                    >
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white">Connect</h3>
                            <p className="text-sm text-gray-400">With Peers</p>
                        </div>
                        <div className="p-4 rounded-2xl bg-white/5 border border-white/10 backdrop-blur-sm">
                            <h3 className="text-2xl font-bold text-white">Lead</h3>
                            <p className="text-sm text-gray-400">Events</p>
                        </div>
                    </motion.div>
                </div>
            </div>

            {/* Right Side - Form */}
            <div className="flex-1 bg-background flex flex-col">
                <div className="p-6">
                    <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-white transition-colors">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Home
                    </Link>
                </div>

                <div className="flex-1 flex items-center justify-center p-6 md:p-12">
                    <div className="w-full max-w-md space-y-8">
                        <div className="text-center lg:text-left">
                            <h2 className="text-3xl font-bold text-white">Register Club</h2>
                            <p className="text-muted-foreground mt-2">Enter your club details to get started.</p>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            {error && (
                                <motion.div
                                    initial={{ opacity: 0, height: 0 }}
                                    animate={{ opacity: 1, height: 'auto' }}
                                    className="p-4 bg-destructive/10 border border-destructive/20 rounded-xl text-destructive text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Club Name</label>
                                    <div className="relative">
                                        <Users className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            value={formData.name}
                                            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                            placeholder="e.g., Google Developer Group"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">College ID or Name</label>
                                    <div className="relative">
                                        <Building2 className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            value={formData.collegeId}
                                            onChange={(e) => setFormData({ ...formData, collegeId: e.target.value })}
                                            placeholder="CLG-XXXXXX or College Name"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground">
                                        Enter your college's ID (e.g., CLG-100001) or search by name
                                    </p>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Club Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Input
                                            required
                                            type="email"
                                            value={formData.email}
                                            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                            placeholder="club@college.edu"
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                        />
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Category</label>
                                    <div className="relative">
                                        <Tag className="absolute left-3 top-3 h-5 w-5 text-muted-foreground pointer-events-none" />
                                        <select
                                            required
                                            value={formData.categoryId}
                                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                                            className="flex h-10 w-full rounded-md border border-white/10 bg-white/5 px-3 py-2 pl-10 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                        >
                                            <option value="" className="bg-background">Select a category</option>
                                            {categories.map((cat) => (
                                                <option key={cat.id} value={cat.id} className="bg-background">
                                                    {cat.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="space-y-2">
                                    <label className="text-sm font-medium text-gray-300">Description</label>
                                    <div className="relative">
                                        <FileText className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                        <Textarea
                                            required
                                            value={formData.description}
                                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                            placeholder="Describe your club in at least 50 characters..."
                                            rows={4}
                                            minLength={50}
                                            className="pl-10 bg-white/5 border-white/10 focus:border-primary min-h-[100px]"
                                        />
                                    </div>
                                    <p className="text-xs text-muted-foreground text-right">
                                        {formData.description.length} / 50 minimum characters
                                    </p>
                                </div>

                                <div className="pt-4 border-t border-white/10">
                                    <h3 className="font-semibold mb-4 text-white">Admin Account</h3>
                                    <div className="space-y-4">
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Admin Name</label>
                                            <div className="relative">
                                                <User className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    required
                                                    value={formData.adminName}
                                                    onChange={(e) => setFormData({ ...formData, adminName: e.target.value })}
                                                    placeholder="Your full name"
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Admin Email</label>
                                            <div className="relative">
                                                <Mail className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    required
                                                    type="email"
                                                    value={formData.adminEmail}
                                                    onChange={(e) => setFormData({ ...formData, adminEmail: e.target.value })}
                                                    placeholder="admin@example.com"
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                        <div className="space-y-2">
                                            <label className="text-sm font-medium text-gray-300">Password</label>
                                            <div className="relative">
                                                <Lock className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
                                                <Input
                                                    required
                                                    type="password"
                                                    value={formData.adminPassword}
                                                    onChange={(e) => setFormData({ ...formData, adminPassword: e.target.value })}
                                                    placeholder="••••••••"
                                                    minLength={8}
                                                    className="pl-10 bg-white/5 border-white/10 focus:border-primary"
                                                />
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <Button type="submit" className="w-full h-12 text-lg bg-primary hover:bg-primary/90" disabled={loading}>
                                {loading ? (
                                    <>
                                        <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    'Register Club'
                                )}
                            </Button>

                            <p className="text-sm text-center text-muted-foreground">
                                Already registered?{' '}
                                <Link href="/admin/club" className="text-primary hover:underline font-medium">
                                    Login to Dashboard
                                </Link>
                            </p>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}
