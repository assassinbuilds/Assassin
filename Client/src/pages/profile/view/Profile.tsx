import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@clerk/react';
import { motion } from 'framer-motion';
import { profileService } from '@/services';
import type { Profile as ProfileType } from '@/types/api';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';
import { 
  Loader2, MapPin, Link as LinkIcon, Github, Linkedin, Twitter, 
  Briefcase, GraduationCap, Calendar, Mail, Phone, ExternalLink, Shield
} from 'lucide-react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

export default function Profile() {
  const { username } = useParams<{ username: string }>();
  const navigate = useNavigate();
  const { isLoaded, userId } = useAuth();
  
  const [profile, setProfile] = useState<ProfileType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // If no username is provided in URL, it's the current user's profile
  const isOwnProfile = !username;

  useEffect(() => {
    if (!isLoaded) return;

    // If viewing own profile but not logged in, redirect
    if (isOwnProfile && !userId) {
      navigate('/signin');
      return;
    }

    const fetchProfile = async () => {
      try {
        setIsLoading(true);
        setError(null);
        let data: ProfileType;
        
        if (username) {
          data = await profileService.getByUsername(username);
        } else {
          data = await profileService.getMyProfile();
        }
        
        setProfile(data);
      } catch (err: any) {
        console.error('Failed to fetch profile:', err);
        setError(err.message || 'Failed to load profile');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [username, isLoaded, userId, isOwnProfile, navigate]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar dark={false} />
        <div className="flex-1 flex items-center justify-center">
          <Loader2 className="h-10 w-10 animate-spin text-red-600" />
        </div>
      </div>
    );
  }

  if (error || !profile) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
        <Navbar dark={false} />
        <div className="flex-1 flex flex-col items-center justify-center p-6 text-center">
          <Shield className="w-16 h-16 text-slate-300 mb-4" />
          <h2 className="text-2xl font-black text-slate-900 mb-2 uppercase tracking-tight">Profile Not Found</h2>
          <p className="text-slate-500 mb-6">{error || "This operative's dossier could not be located."}</p>
          <Button onClick={() => navigate('/')} className="bg-slate-900 text-white rounded-full px-8 hover:bg-slate-800">
            Return to Base
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col">
      <Navbar dark={false} />
      
      <main className="flex-1 max-w-5xl mx-auto w-full px-4 sm:px-6 pt-24 pb-20">
        {/* Banner */}
        <div className="w-full h-48 md:h-64 rounded-3xl overflow-hidden bg-slate-900 relative shadow-sm border border-slate-200/50">
          {profile.banner_url ? (
            <img 
              src={profile.banner_url} 
              alt="Profile Banner" 
              className="w-full h-full object-cover opacity-80"
            />
          ) : (
            <div className="w-full h-full bg-gradient-to-tr from-slate-900 via-slate-800 to-red-900/20" />
          )}
          
          {isOwnProfile && (
            <div className="absolute top-4 right-4">
              <Button 
                onClick={() => navigate('/edit-profile')}
                className="bg-white/10 backdrop-blur-md hover:bg-white/20 text-white border border-white/20 rounded-full text-xs font-bold uppercase tracking-widest"
              >
                Edit Dossier
              </Button>
            </div>
          )}
        </div>

        {/* Profile Header section */}
        <div className="px-4 sm:px-8 -mt-16 sm:-mt-20 relative z-10 mb-8">
          <div className="flex flex-col sm:flex-row gap-6 items-start sm:items-end">
            <Avatar className="w-32 h-32 sm:w-40 sm:h-40 border-4 border-[#F8FAFC] bg-white shadow-xl">
              <AvatarImage src={profile.avatar_url || ''} alt={profile.full_name || profile.username} className="object-cover" />
              <AvatarFallback className="text-4xl bg-slate-100 text-slate-400 font-black">
                {(profile.full_name || profile.username).charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            
            <div className="flex-1 pb-2">
              <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-4 mb-2">
                <h1 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight leading-none">
                  {profile.full_name || profile.username}
                </h1>
                {profile.is_admin && (
                  <Badge className="bg-red-600 hover:bg-red-700 text-white text-[10px] uppercase tracking-widest font-bold rounded-full w-fit">
                    Admin
                  </Badge>
                )}
              </div>
              <p className="text-slate-500 font-medium text-lg flex items-center gap-2">
                @{profile.username}
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Main Info */}
          <div className="lg:col-span-2 space-y-8">
            {/* Bio Card */}
            <Card className="rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden">
              <CardContent className="p-8">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                  <Briefcase className="w-4 h-4" /> About Operative
                </h3>
                {profile.bio ? (
                  <p className="text-slate-700 leading-relaxed text-lg">
                    {profile.bio}
                  </p>
                ) : (
                  <p className="text-slate-400 italic">No biographical data available.</p>
                )}
              </CardContent>
            </Card>

            {/* Readme Card (if exists) */}
            {profile.readme && (
              <Card className="rounded-[2rem] border-slate-200/60 shadow-sm overflow-hidden">
                <CardContent className="p-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4 flex items-center gap-2">
                    <Shield className="w-4 h-4" /> Full Dossier
                  </h3>
                  <div className="prose prose-slate max-w-none">
                    <p className="whitespace-pre-wrap text-slate-700">{profile.readme}</p>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Skills & Roles */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Technical Matrix</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.skills && profile.skills.length > 0 ? (
                      profile.skills.map(skill => (
                        <span key={skill} className="px-3 py-1.5 bg-slate-100 text-slate-700 text-xs font-bold rounded-xl border border-slate-200/50">
                          {skill}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm italic">No skills registered</span>
                    )}
                  </div>
                </CardContent>
              </Card>

              <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
                <CardContent className="p-8">
                  <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-4">Roles</h3>
                  <div className="flex flex-wrap gap-2">
                    {profile.roles && profile.roles.length > 0 ? (
                      profile.roles.map(role => (
                        <span key={role} className="px-3 py-1.5 bg-red-50 text-red-700 text-xs font-bold uppercase tracking-wider rounded-xl border border-red-100/50">
                          {role}
                        </span>
                      ))
                    ) : (
                      <span className="text-slate-400 text-sm italic">No roles registered</span>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Right Column - Meta Info */}
          <div className="space-y-8">
            <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Network Links</h3>
                
                <div className="flex flex-col gap-4">
                  {profile.github_url && (
                    <a href={profile.github_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-slate-900 group transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Github className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-sm">GitHub</span>
                    </a>
                  )}
                  {profile.linkedin_url && (
                    <a href={profile.linkedin_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-[#0A66C2] group transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-blue-50 transition-colors">
                        <Linkedin className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-sm">LinkedIn</span>
                    </a>
                  )}
                  {profile.twitter_url && (
                    <a href={profile.twitter_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-black group transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-slate-200 transition-colors">
                        <Twitter className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-sm">X (Twitter)</span>
                    </a>
                  )}
                  {profile.portfolio_url && (
                    <a href={profile.portfolio_url} target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 text-slate-600 hover:text-red-600 group transition-colors">
                      <div className="w-10 h-10 rounded-xl bg-slate-100 flex items-center justify-center group-hover:bg-red-50 transition-colors">
                        <ExternalLink className="w-5 h-5" />
                      </div>
                      <span className="font-medium text-sm">Portfolio</span>
                    </a>
                  )}
                  
                  {(!profile.github_url && !profile.linkedin_url && !profile.twitter_url && !profile.portfolio_url) && (
                    <span className="text-slate-400 text-sm italic">No network links connected</span>
                  )}
                </div>
              </CardContent>
            </Card>

            <Card className="rounded-[2rem] border-slate-200/60 shadow-sm">
              <CardContent className="p-8 space-y-6">
                <h3 className="text-xs font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Background</h3>
                
                <div className="space-y-4">
                  {profile.university && (
                    <div className="flex items-start gap-3 text-slate-600">
                      <GraduationCap className="w-5 h-5 shrink-0 mt-0.5" />
                      <div>
                        <p className="font-medium text-slate-900">{profile.university}</p>
                        <p className="text-sm">{profile.degree_type}</p>
                        {profile.graduation_year && (
                          <p className="text-xs text-slate-400 mt-1">Class of {profile.graduation_year}</p>
                        )}
                      </div>
                    </div>
                  )}
                  
                  {profile.address && profile.is_address_public && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <MapPin className="w-5 h-5 shrink-0" />
                      <span className="text-sm">{profile.address}</span>
                    </div>
                  )}
                  
                  {profile.email && profile.is_email_public && (
                    <div className="flex items-center gap-3 text-slate-600">
                      <Mail className="w-5 h-5 shrink-0" />
                      <a href={`mailto:${profile.email}`} className="text-sm hover:text-red-600 truncate">{profile.email}</a>
                    </div>
                  )}

                  <div className="flex items-center gap-3 text-slate-600 pt-4 border-t border-slate-100">
                    <Calendar className="w-5 h-5 shrink-0" />
                    <span className="text-xs font-medium uppercase tracking-wider text-slate-400">
                      Joined {new Date(profile.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'long' })}
                    </span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}
