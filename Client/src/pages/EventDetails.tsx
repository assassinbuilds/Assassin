import { useCallback, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { eventsService, registrationsService } from '@/services';
import { useAuth } from '@clerk/react';
import { ApiError } from '@/lib/api-client';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { Loader2, Calendar, MapPin, Users, Trophy, Tag, ArrowLeft } from 'lucide-react';
import type { EventWithParticipants } from '@/types/api';
import Navbar from '@/components/Navbar';

export default function EventDetails() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [event, setEvent] = useState<EventWithParticipants | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showRegistrationForm, setShowRegistrationForm] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [formData, setFormData] = useState({
    team_name: '',
    project_idea: '',
  });
  const { userId } = useAuth();

  const fetchEvent = useCallback(async () => {
    if (!id) return;
    
    setIsLoading(true);
    try {
      const data = await eventsService.getById(id);
      setEvent(data);
    } catch (error) {
      if (error instanceof ApiError) {
        toast({
          title: 'Error',
          description: 'Failed to load event details',
          variant: 'destructive',
        });
        navigate('/events');
      }
    } finally {
      setIsLoading(false);
    }
  }, [id, navigate]);

  useEffect(() => {
    void fetchEvent();
  }, [fetchEvent]);

  const handleRegisterClick = () => {
    if (!userId) {
      toast({
        title: 'Authentication Required',
        description: 'Please sign in to register for events',
        variant: 'destructive',
      });
      navigate('/signin');
      return;
    }

    if (!event?.registration_open) {
      toast({
        title: 'Registration Closed',
        description: 'Registration is not open for this event',
        variant: 'destructive',
      });
      return;
    }

    setShowRegistrationForm(true);
  };

  const handleSubmitRegistration = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!id) return;

    // Validation
    if (!formData.team_name.trim() || !formData.project_idea.trim()) {
      toast({
        title: 'Validation Error',
        description: 'Please fill in all fields',
        variant: 'destructive',
      });
      return;
    }

    if (formData.project_idea.length < 10) {
      toast({
        title: 'Validation Error',
        description: 'Project idea must be at least 10 characters',
        variant: 'destructive',
      });
      return;
    }

    setIsSubmitting(true);

    try {
      const registration = await registrationsService.create({
        event_id: id,
        team_name: formData.team_name,
        project_idea: formData.project_idea,
      });

      toast({
        title: 'Registration Successful! 🎉',
        description: `Your registration status is: ${registration.status.toUpperCase()}`,
      });

      setShowRegistrationForm(false);
      setFormData({ team_name: '', project_idea: '' });
      
      // Refresh event to update participant count
      void fetchEvent();
    } catch (error) {
      if (error instanceof ApiError) {
        if (error.status === 409) {
          toast({
            title: 'Already Registered',
            description: 'You have already registered for this event',
            variant: 'destructive',
          });
        } else {
          toast({
            title: 'Registration Failed',
            description: error.message,
            variant: 'destructive',
          });
        }
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusBadge = (status: string) => {
    const variants: Record<string, 'default' | 'secondary' | 'destructive'> = {
      live: 'default',
      upcoming: 'secondary',
      past: 'destructive',
    };
    return (
      <Badge variant={variants[status] || 'default'} className="text-lg px-4 py-1">
        {status.toUpperCase()}
      </Badge>
    );
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!event) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>Event not found</p>
      </div>
    );
  }

  const isFull = event.participant_count >= event.max_participants;

  return (
    <div className="min-h-screen bg-white text-slate-950">
      <Navbar dark={false} />
      
      <div className="container mx-auto px-4 py-24">
        <Button
          variant="ghost"
          onClick={() => navigate('/events')}
          className="mb-6 text-slate-500 hover:text-slate-950 hover:bg-slate-100"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Events
        </Button>

        <div className="grid gap-6 lg:grid-cols-3">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Event Header */}
            <Card className="bg-white border-slate-200 overflow-hidden rounded-3xl shadow-sm">
              {event.image_urls && event.image_urls.length > 0 && (
                <div className="h-80 overflow-hidden relative">
                  <img
                    src={event.image_urls[0]}
                    alt={event.title}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-white via-transparent to-transparent opacity-80" />
                </div>
              )}
              <CardHeader className="relative -mt-20 z-10 px-8 pb-8">
                <div className="flex flex-wrap justify-between items-end gap-4 mb-4">
                  <CardTitle className="text-4xl md:text-5xl font-black italic uppercase tracking-tighter text-slate-950 drop-shadow-sm">
                    {event.title}
                  </CardTitle>
                  {getStatusBadge(event.status)}
                </div>
                <CardDescription className="text-lg text-slate-600 font-medium leading-relaxed italic max-w-3xl">
                  {event.description}
                </CardDescription>
              </CardHeader>
            </Card>

            {/* Event Details */}
            <Card className="bg-white border-slate-200 rounded-3xl p-4 shadow-sm">
              <CardHeader>
                <CardTitle className="text-xl font-black italic uppercase tracking-widest text-slate-950">Event Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-start">
                  <Calendar className="mr-4 h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Start Date</p>
                    <p className="text-slate-950 font-bold">{formatDate(event.start_date)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Calendar className="mr-4 h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">End Date</p>
                    <p className="text-slate-950 font-bold">{formatDate(event.end_date)}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <MapPin className="mr-4 h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Location</p>
                    <p className="text-slate-950 font-bold">{event.location}</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <Users className="mr-4 h-5 w-5 text-red-600 mt-1" />
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Builder Spots</p>
                    <p className="text-slate-950 font-bold">
                      {event.participant_count} / {event.max_participants} Registered
                      {isFull && <span className="text-red-600 ml-2 font-black italic tracking-tighter">MAX CAPACITY</span>}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Themes */}
            {event.themes && event.themes.length > 0 && (
              <Card className="bg-white border-slate-200 rounded-3xl p-4 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-black italic uppercase tracking-widest text-slate-950">
                    <Tag className="mr-3 h-5 w-5 text-red-600" />
                    Event Tags
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {event.themes.map((theme, index) => (
                      <Badge key={index} variant="secondary" className="bg-slate-100 text-slate-700 border-slate-200 px-4 py-1 uppercase font-black text-[10px] tracking-widest">
                        {theme}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Prizes */}
            {event.prizes && (
              <Card className="bg-white border-slate-200 rounded-3xl p-4 shadow-sm">
                <CardHeader>
                  <CardTitle className="flex items-center text-xl font-black italic uppercase tracking-widest text-slate-950">
                    <Trophy className="mr-3 h-5 w-5 text-red-600" />
                    Event Prizes
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-4">
                    {Object.entries(event.prizes).map(([rank, prize]) => (
                      <div key={rank} className="flex justify-between items-center bg-slate-50 p-4 rounded-xl border border-slate-200">
                        <span className="text-slate-500 font-black uppercase tracking-widest text-xs">{rank} Place</span>
                        <span className="text-red-500 font-bold italic">{String(prize)}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-white border-slate-200 rounded-3xl p-4 overflow-hidden relative shadow-sm">
              <div className="absolute top-0 right-0 p-1 opacity-20">
                <div className="w-12 h-12 border-t-2 border-r-2 border-red-600 rounded-tr-2xl" />
              </div>
              <CardHeader>
                <CardTitle className="text-lg font-black italic uppercase tracking-widest text-slate-950">Registration</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {event.status === 'past' ? (
                  <p className="text-slate-400 font-bold italic uppercase tracking-widest">EVENT COMPLETED</p>
                ) : !event.registration_open ? (
                  <p className="text-slate-400 font-bold italic uppercase tracking-widest">REGISTRATION CLOSED</p>
                ) : isFull ? (
                  <>
                    <p className="text-red-500 font-black italic uppercase tracking-widest">MAX CAPACITY REACHED</p>
                    <p className="text-sm text-slate-500 font-medium">
                      Join the secondary squad (waitlist).
                    </p>
                    <Button onClick={handleRegisterClick} className="w-full bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-950 font-black uppercase tracking-widest rounded-2xl py-6">
                      Join Waitlist
                    </Button>
                  </>
                ) : (
                  <>
                    <div className="flex justify-between items-end">
                      <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Available Slots</p>
                      <p className="text-2xl font-black italic text-slate-950 leading-none">{event.max_participants - event.participant_count}</p>
                    </div>
                    <Button onClick={handleRegisterClick} className="w-full bg-red-600 hover:bg-red-700 text-white font-black uppercase tracking-widest rounded-2xl py-8 shadow-xl shadow-red-600/20" size="lg">
                      Register Now
                    </Button>
                  </>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>

      {/* Registration Form Dialog */}
      <Dialog open={showRegistrationForm} onOpenChange={setShowRegistrationForm}>
        <DialogContent className="bg-white border-slate-200 text-slate-950 p-8 rounded-[2.5rem] shadow-2xl">
          <DialogHeader>
            <DialogTitle className="text-3xl font-black italic uppercase tracking-tighter mb-2">Register for {event.title}</DialogTitle>
            <DialogDescription className="text-slate-500 font-medium italic">
              Submit your team details to register for the event.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleSubmitRegistration} className="space-y-6 pt-6">
            <div className="space-y-2">
              <Label htmlFor="team_name" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Team Name *</Label>
              <Input
                id="team_name"
                placeholder="Enter squad name"
                value={formData.team_name}
                onChange={(e) => setFormData({ ...formData, team_name: e.target.value })}
                disabled={isSubmitting}
                className="bg-slate-50 border-slate-200 focus:ring-red-600/50 rounded-xl py-6"
                required
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="project_idea" className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-500">Project Idea / Description *</Label>
              <Textarea
                id="project_idea"
                placeholder="Briefly describe what you plan to build..."
                value={formData.project_idea}
                onChange={(e) => setFormData({ ...formData, project_idea: e.target.value })}
                disabled={isSubmitting}
                className="bg-slate-50 border-slate-200 focus:ring-red-600/50 rounded-xl min-h-[150px]"
                required
              />
            </div>
            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowRegistrationForm(false)}
                disabled={isSubmitting}
                className="flex-1 bg-white border-slate-200 text-slate-950 rounded-xl py-6 hover:bg-slate-50"
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isSubmitting} className="flex-1 bg-red-600 hover:bg-red-700 text-white rounded-xl py-6 font-black uppercase tracking-widest shadow-lg shadow-red-600/20">
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Syncing...
                  </>
                ) : (
                  'Confirm Registration'
                )}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
