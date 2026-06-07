import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Circle, X, User, Code2, Github, Calendar, Target } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import type { Profile } from '@/types/api';
import type { Mission } from '@/services/missions.service';

interface OnboardingStep {
  id: string;
  label: string;
  description: string;
  href: string;
  completed: boolean;
  icon: typeof User;
}

interface OnboardingChecklistProps {
  profile: Profile | null;
  missions: Mission[];
  hasEventRegistration: boolean;
  userId: string;
}

const DISMISS_KEY_PREFIX = 'techassassin-onboarding-dismissed';

export default function OnboardingChecklist({ profile, missions, hasEventRegistration, userId }: OnboardingChecklistProps) {
  const dismissKey = `${DISMISS_KEY_PREFIX}-${userId}`;
  const [isDismissed, setIsDismissed] = useState(
    () => typeof window !== 'undefined' && localStorage.getItem(dismissKey) === 'true'
  );

  const steps: OnboardingStep[] = [
    {
      id: 'profile',
      label: 'Complete your dossier',
      description: 'Add a bio and avatar so other operatives can find you.',
      href: '/edit-profile',
      completed: Boolean(profile?.bio?.trim() && profile?.avatar_url),
      icon: User,
    },
    {
      id: 'skills',
      label: 'Declare your skill matrix',
      description: 'List your tech stack to match with the right missions.',
      href: '/edit-profile',
      completed: Boolean(profile?.skills && profile.skills.length > 0),
      icon: Code2,
    },
    {
      id: 'github',
      label: 'Link GitHub telemetry',
      description: 'Connect your GitHub to showcase real project history.',
      href: '/edit-profile',
      completed: Boolean(profile?.github_url?.trim()),
      icon: Github,
    },
    {
      id: 'event',
      label: 'Join a community mission',
      description: 'Browse live hackathons and tactical sprints.',
      href: '/events',
      completed: hasEventRegistration,
      icon: Calendar,
    },
    {
      id: 'mission',
      label: 'Complete your first bounty',
      description: 'Execute a daily mission and earn your first XP.',
      href: '/missions',
      completed: missions.some((m) => m.status === 'completed'),
      icon: Target,
    },
  ];

  const completedCount = steps.filter((s) => s.completed).length;
  const progress = (completedCount / steps.length) * 100;
  const allComplete = completedCount === steps.length;

  if (isDismissed || allComplete) return null;

  const handleDismiss = () => {
    localStorage.setItem(dismissKey, 'true');
    setIsDismissed(true);
  };

  return (
    <div className="mb-12 bg-white rounded-[2.5rem] border border-slate-100 shadow-sm p-8 md:p-10 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-48 h-48 bg-red-50 rounded-full -translate-y-1/2 translate-x-1/2 opacity-60" />

      <div className="relative z-10">
        <div className="flex items-start justify-between gap-4 mb-6">
          <div>
            <p className="text-[10px] font-black uppercase tracking-[0.3em] text-red-600 mb-2">New Operative Briefing</p>
            <h2 className="text-2xl font-black italic uppercase tracking-tight text-slate-900">
              Your first 5 missions
            </h2>
            <p className="text-sm text-slate-500 mt-1 font-medium">
              Complete these steps to get fully operational in the network.
            </p>
          </div>
          <button
            onClick={handleDismiss}
            className="shrink-0 p-2 rounded-xl text-slate-300 hover:text-slate-500 hover:bg-slate-50 transition-colors"
            aria-label="Dismiss onboarding"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">
              Deployment Progress
            </span>
            <span className="text-[10px] font-black uppercase tracking-widest text-red-600">
              {completedCount}/{steps.length} Complete
            </span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <div className="space-y-3">
          {steps.map((step) => {
            const Icon = step.icon;
            return (
              <Link
                key={step.id}
                to={step.href}
                className={`flex items-center gap-4 p-4 rounded-2xl border transition-all group ${
                  step.completed
                    ? 'border-emerald-100 bg-emerald-50/50'
                    : 'border-slate-100 bg-slate-50/50 hover:border-red-200 hover:bg-red-50/30'
                }`}
              >
                {step.completed ? (
                  <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />
                ) : (
                  <Circle className="w-5 h-5 text-slate-300 shrink-0 group-hover:text-red-400 transition-colors" />
                )}
                <div className={`p-2 rounded-xl shrink-0 ${step.completed ? 'bg-emerald-100 text-emerald-600' : 'bg-white text-red-600 border border-slate-100'}`}>
                  <Icon className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-black uppercase tracking-tight ${step.completed ? 'text-emerald-700 line-through decoration-emerald-300' : 'text-slate-900'}`}>
                    {step.label}
                  </p>
                  <p className="text-xs text-slate-500 mt-0.5 truncate">{step.description}</p>
                </div>
                {!step.completed && (
                  <Button size="sm" variant="ghost" className="shrink-0 text-[10px] font-black uppercase tracking-widest text-red-600 hover:text-red-700 hover:bg-red-50">
                    Start
                  </Button>
                )}
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}