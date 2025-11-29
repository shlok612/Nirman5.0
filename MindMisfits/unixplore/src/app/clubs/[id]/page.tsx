'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Mail, ExternalLink, Calendar, Loader2, MapPin, Globe, Instagram, Phone, Building2 } from 'lucide-react';
import { getCategoryColor, formatDate } from '@/lib/utils';
import { motion } from 'framer-motion';

interface Announcement {
    id: number;
    title: string;
    content: string;
    created_at: string;
}

interface Registration {
    id: number;
    title: string;
    description: string;
    registration_link: string;
    start_date: string;
    end_date: string;
    status: string;
    created_at: string;
}

interface Club {
    id: number;
    name: string;
    email: string;
    description: string;
    about: string;
    contact_info: any;
    category_name: string;
    category_slug: string;
    college_id: number;
    college_name: string;
    college_code: string;
    announcements: Announcement[];
    registrations: Registration[];
}

export default function ClubPage() {
    const params = useParams();
    const [club, setClub] = useState<Club | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchClub = async () => {
            setLoading(true);
            try {
                const response = await fetch(`/api/clubs/${params.id}`);
                const data = await response.json();

                if (data.success) {
                    setClub(data.data);
                }
            } catch (error) {
                console.error('Error fetching club:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchClub();
    }, [params.id]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
        );
    }

    if (!club) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-black">
                <div className="text-center">
                    <h1 className="text-2xl font-bold mb-4 text-white">Club not found</h1>
                    <Link href="/colleges">
                        <Button variant="outline" className="border-white/10 text-white hover:bg-white/10">Back to Colleges</Button>
                    </Link>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-black relative overflow-hidden">
            {/* Background Elements */}
            <div className="absolute top-0 left-0 w-full h-[500px] overflow-hidden pointer-events-none z-0">
                <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/20 rounded-full blur-[120px] opacity-40" />
                <div className="absolute top-[10%] left-[-10%] w-[400px] h-[400px] bg-purple-900/20 rounded-full blur-[100px] opacity-40" />
                <div className="absolute inset-0 bg-[url('/grid.svg')] opacity-20" />
                <div className="absolute bottom-0 left-0 w-full h-32 bg-gradient-to-t from-black to-transparent" />
            </div>

            <div className="container-custom relative z-10 py-12">
                {/* Back Button */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    className="mb-8"
                >
                    <Link
                        href={`/colleges/${club.college_id}`}
                        className="inline-flex items-center text-sm text-gray-400 hover:text-white transition-colors"
                    >
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to {club.college_name}
                    </Link>
                </motion.div>

                {/* Club Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-12"
                >
                    <div className="flex flex-col md:flex-row md:items-start justify-between gap-6 mb-6">
                        <div className="flex-1">
                            <div className="flex items-center gap-4 mb-4">
                                <h1 className="text-4xl md:text-6xl font-bold text-white tracking-tight">{club.name}</h1>
                                <Badge className={`${getCategoryColor(club.category_slug)} px-3 py-1 text-sm border-0`}>
                                    {club.category_name}
                                </Badge>
                            </div>
                            <p className="text-xl text-gray-400 max-w-3xl leading-relaxed">{club.description}</p>
                        </div>
                        <div className="flex flex-col gap-3 min-w-[200px]">
                            <Link href={`/colleges/${club.college_id}`} className="flex items-center gap-2 text-sm text-gray-400 hover:text-primary transition-colors p-3 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10">
                                <Building2 className="h-4 w-4" />
                                <div>
                                    <p className="font-medium text-white">{club.college_name}</p>
                                    <p className="text-xs">{club.college_code}</p>
                                </div>
                            </Link>
                        </div>
                    </div>
                </motion.div>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Main Content */}
                    <div className="lg:col-span-2 space-y-12">
                        {/* About Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                <span className="w-1 h-8 bg-primary rounded-full" />
                                About Us
                            </h2>
                            <Card className="bg-white/5 border-white/10 backdrop-blur-sm">
                                <CardContent className="pt-6">
                                    <div className="rich-text prose prose-invert max-w-none text-gray-300">
                                        {club.about ? (
                                            <p className="whitespace-pre-wrap leading-relaxed">{club.about}</p>
                                        ) : (
                                            <p className="text-gray-500 italic">No additional information available.</p>
                                        )}
                                    </div>
                                </CardContent>
                            </Card>
                        </motion.section>

                        {/* Registrations Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                <span className="w-1 h-8 bg-green-500 rounded-full" />
                                Active Registrations
                            </h2>
                            {club.registrations && club.registrations.length > 0 ? (
                                <div className="space-y-4">
                                    {club.registrations.map((reg) => (
                                        <Card key={reg.id} className="bg-gradient-to-r from-white/5 to-transparent border-white/10 hover:border-primary/50 transition-all group">
                                            <CardContent className="p-6">
                                                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-3">
                                                            <h3 className="text-xl font-semibold text-white group-hover:text-primary transition-colors">{reg.title}</h3>
                                                            <Badge variant={reg.status === 'open' ? 'default' : 'secondary'} className="uppercase text-xs">
                                                                {reg.status}
                                                            </Badge>
                                                        </div>
                                                        {reg.description && (
                                                            <p className="text-gray-400 text-sm">{reg.description}</p>
                                                        )}
                                                        {(reg.start_date || reg.end_date) && (
                                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                                <Calendar className="h-4 w-4" />
                                                                {reg.start_date && <span>From {formatDate(reg.start_date)}</span>}
                                                                {reg.end_date && <span>to {formatDate(reg.end_date)}</span>}
                                                            </div>
                                                        )}
                                                    </div>
                                                    {reg.registration_link && (
                                                        <a href={reg.registration_link} target="_blank" rel="noopener noreferrer">
                                                            <Button className="w-full md:w-auto bg-white text-black hover:bg-gray-200 font-semibold">
                                                                Register Now
                                                                <ExternalLink className="ml-2 h-4 w-4" />
                                                            </Button>
                                                        </a>
                                                    )}
                                                </div>
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-white/5 border-white/10 border-dashed">
                                    <CardContent className="pt-6 text-center py-12">
                                        <p className="text-gray-500">No active registrations at the moment.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.section>

                        {/* Announcements Section */}
                        <motion.section
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.3 }}
                        >
                            <h2 className="text-2xl font-bold mb-6 text-white flex items-center gap-2">
                                <span className="w-1 h-8 bg-blue-500 rounded-full" />
                                Announcements
                            </h2>
                            {club.announcements && club.announcements.length > 0 ? (
                                <div className="space-y-4">
                                    {club.announcements.map((announcement) => (
                                        <Card key={announcement.id} className="bg-white/5 border-white/10">
                                            <CardHeader>
                                                <div className="flex items-start justify-between gap-4">
                                                    <CardTitle className="text-lg text-white">{announcement.title}</CardTitle>
                                                    <span className="text-xs text-gray-500 whitespace-nowrap bg-white/5 px-2 py-1 rounded">
                                                        {formatDate(announcement.created_at)}
                                                    </span>
                                                </div>
                                            </CardHeader>
                                            <CardContent>
                                                <div
                                                    className="rich-text prose prose-invert prose-sm max-w-none text-gray-300"
                                                    dangerouslySetInnerHTML={{ __html: announcement.content }}
                                                />
                                            </CardContent>
                                        </Card>
                                    ))}
                                </div>
                            ) : (
                                <Card className="bg-white/5 border-white/10 border-dashed">
                                    <CardContent className="pt-6 text-center py-12">
                                        <p className="text-gray-500">No announcements yet.</p>
                                    </CardContent>
                                </Card>
                            )}
                        </motion.section>
                    </div>

                    {/* Sidebar */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="space-y-6"
                    >
                        <Card className="bg-white/5 border-white/10 sticky top-24">
                            <CardHeader>
                                <CardTitle className="text-white">Contact Info</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-6">
                                <div className="flex items-center gap-3 group">
                                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                                        <Mail className="h-5 w-5 text-primary" />
                                    </div>
                                    <div className="overflow-hidden">
                                        <p className="text-xs text-gray-500 uppercase font-semibold">Email</p>
                                        <a href={`mailto:${club.email}`} className="text-sm text-white hover:text-primary truncate block transition-colors">
                                            {club.email}
                                        </a>
                                    </div>
                                </div>

                                {club.contact_info && club.contact_info.phone && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center group-hover:bg-green-500/20 transition-colors">
                                            <Phone className="h-5 w-5 text-green-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Phone</p>
                                            <p className="text-sm text-white">{club.contact_info.phone}</p>
                                        </div>
                                    </div>
                                )}

                                {club.contact_info && club.contact_info.website && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                                            <Globe className="h-5 w-5 text-blue-500" />
                                        </div>
                                        <div className="overflow-hidden">
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Website</p>
                                            <a href={club.contact_info.website} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-blue-500 truncate block transition-colors">
                                                Visit Website
                                            </a>
                                        </div>
                                    </div>
                                )}

                                {club.contact_info && club.contact_info.instagram && (
                                    <div className="flex items-center gap-3 group">
                                        <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center group-hover:bg-pink-500/20 transition-colors">
                                            <Instagram className="h-5 w-5 text-pink-500" />
                                        </div>
                                        <div>
                                            <p className="text-xs text-gray-500 uppercase font-semibold">Instagram</p>
                                            <a href={`https://instagram.com/${club.contact_info.instagram.replace('@', '')}`} target="_blank" rel="noopener noreferrer" className="text-sm text-white hover:text-pink-500 transition-colors">
                                                {club.contact_info.instagram}
                                            </a>
                                        </div>
                                    </div>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>
            </div>
        </div>
    );
}
