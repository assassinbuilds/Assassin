import { FormEvent, useEffect, useState, KeyboardEvent } from "react";
import { useUser } from "@clerk/react";
import {
  Clock3,
  Loader2,
  Send,
  ArrowRight,
  ArrowLeft,
  Check
} from "lucide-react";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import { api, ApiError } from "@/lib/api-client";
import { toast } from "@/hooks/use-toast";
import type {
  CollaborationInterest,
  CollaborationOrganizationType,
  CollaborationRequest,
  CollaborationRequestCreateRequest,
} from "@/types/api";

type FormState = {
  organization_name: string;
  organization_type: CollaborationOrganizationType;
  contact_name: string;
  role_title: string;
  work_email: string;
  phone: string;
  website_url: string;
  collaboration_interests: CollaborationInterest[];
  budget_range: string;
  timeline: string;
  student_audience: string;
  message: string;
};

const initialFormState: FormState = {
  organization_name: "",
  organization_type: "company",
  contact_name: "",
  role_title: "",
  work_email: "",
  phone: "",
  website_url: "",
  collaboration_interests: ["workshops", "hackathons"],
  budget_range: "",
  timeline: "",
  student_audience: "",
  message: "",
};

const organizationTypes: Array<{ value: CollaborationOrganizationType; label: string }> = [
  { value: "company", label: "Company" },
  { value: "startup", label: "Startup" },
  { value: "sponsor", label: "Sponsor" },
  { value: "mentor", label: "Mentor" },
  { value: "tech_organization", label: "Tech organization" },
  { value: "university", label: "University" },
  { value: "community", label: "Community" },
  { value: "other", label: "Other" },
];

const interestOptions: Array<{ value: CollaborationInterest; label: string }> = [
  { value: "workshops", label: "Workshops" },
  { value: "hackathons", label: "Hackathons" },
  { value: "sponsorships", label: "Sponsorships" },
  { value: "hiring_talent", label: "Hiring Talent" },
  { value: "product_feedback", label: "Product Feedback" },
  { value: "mentorship", label: "Mentorship" },
  { value: "brand_presence", label: "Brand Presence" },
  { value: "campus_events", label: "Campus Events" },
  { value: "internship_connect", stroke: "currentColor", label: "Internship Connect" },
  { value: "startup_collaboration", label: "Startup Collaboration" },
  { value: "community_growth", label: "Community Growth" },
  { value: "student_innovation", label: "Student Innovation" },
];

const optional = (value: string) => {
  const trimmed = value.trim();
  return trimmed ? trimmed : undefined;
};

const normalizeUrl = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return undefined;
  return /^https?:\/\//i.test(trimmed) ? trimmed : `https://${trimmed}`;
};

export default function Collaborate() {
  const { user } = useUser();
  const [formData, setFormData] = useState<FormState>(initialFormState);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submittedRequest, setSubmittedRequest] = useState<CollaborationRequest | null>(null);
  const [errorPopup, setErrorPopup] = useState<{ title: string; message: string } | null>(null);
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 10;

  useEffect(() => {
    if (!user) return;

    setFormData((current) => ({
      ...current,
      contact_name: current.contact_name || user.fullName || user.username || "",
      work_email: current.work_email || user.primaryEmailAddress?.emailAddress || "",
    }));
  }, [user]);

  const updateField = <K extends keyof FormState>(field: K, value: FormState[K]) => {
    setFormData((current) => ({ ...current, [field]: value }));
  };

  const toggleInterest = (interest: CollaborationInterest) => {
    setFormData((current) => {
      const hasInterest = current.collaboration_interests.includes(interest);
      return {
        ...current,
        collaboration_interests: hasInterest
          ? current.collaboration_interests.filter((item) => item !== interest)
          : [...current.collaboration_interests, interest],
      };
    });
  };

  const validateStep = (step: number): boolean => {
    switch (step) {
      case 1:
        if (!formData.contact_name.trim()) {
          setErrorPopup({
            title: "Contact Name Missing !",
            message: "Your name is required. Please fill it in and then you can continue using the desk.",
          });
          return false;
        }
        return true;
      case 2:
        if (!formData.organization_name.trim()) {
          setErrorPopup({
            title: "Organization Name Missing !",
            message: "Organization name is required. Please fill it in and then you can continue using the desk.",
          });
          return false;
        }
        return true;
      case 5:
        if (!formData.work_email.trim() || !formData.work_email.includes("@")) {
          setErrorPopup({
            title: "Work Email Missing !",
            message: "A valid work email is required. Please fill it in and then you can continue using the desk.",
          });
          return false;
        }
        return true;
      case 8:
        if (formData.collaboration_interests.length === 0) {
          setErrorPopup({
            title: "Focus Areas Unselected !",
            message: "Please select at least one collaboration focus and then you can continue.",
          });
          return false;
        }
        return true;
      case 10:
        if (!formData.message.trim()) {
          setErrorPopup({
            title: "Partnership Brief Empty !",
            message: "Partnership brief is required. Please fill it in and then you can continue using the desk.",
          });
          return false;
        }
        return true;
      default:
        return true; // Optional fields
    }
  };

  const goNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < totalSteps) {
        setCurrentStep((prev) => prev + 1);
      } else {
        submitForm();
      }
    }
  };

  const goBack = () => {
    if (currentStep > 1) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  const handleKeyPress = (e: KeyboardEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    if (e.key === "Enter" && currentStep !== 10) {
      e.preventDefault();
      goNext();
    }
  };

  const submitForm = async () => {
    setIsSubmitting(true);
    try {
      const payload: CollaborationRequestCreateRequest = {
        organization_name: formData.organization_name.trim(),
        organization_type: formData.organization_type,
        contact_name: formData.contact_name.trim(),
        role_title: optional(formData.role_title),
        work_email: formData.work_email.trim(),
        phone: optional(formData.phone),
        website_url: normalizeUrl(formData.website_url),
        collaboration_interests: formData.collaboration_interests,
        budget_range: optional(formData.budget_range),
        timeline: optional(formData.timeline),
        student_audience: optional(formData.student_audience),
        message: formData.message.trim(),
        source_page: "collaborate",
      };

      const request = await api.post<CollaborationRequest>("/collaboration-requests", payload);
      setSubmittedRequest(request);
    } catch (error) {
      const description = error instanceof ApiError ? error.message : "Submission failed. Please check your network and try again.";
      setErrorPopup({
        title: "Submission Failed !",
        message: description,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-white text-slate-950 selection:bg-red-500 selection:text-white font-body">
      <Navbar dark={false} />

      <main className="flex min-h-[calc(100vh-80px)] items-center justify-center pt-20 pb-16">
        <div className="container mx-auto max-w-3xl px-6">
          
          {submittedRequest ? (
            /* Custom Success Card (Daily UI Style) */
            <div className="mx-auto max-w-sm rounded-3xl border border-slate-100 bg-white shadow-[0_20px_50px_rgba(15,23,42,0.08)] overflow-hidden flex flex-col items-center text-center pb-8 animate-fade-in-up">
              <div className="w-full h-36 bg-[#2ecc71] rounded-b-[45%] flex items-center justify-center relative">
                {/* Loop-de-loop Ascending Paper Airplane SVG */}
                <svg viewBox="0 0 200 100" className="w-40 h-20 text-white fill-none stroke-white" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M 30 80 C 15 50, 45 40, 50 65 C 55 90, 95 90, 110 60 C 125 30, 140 10, 170 20" strokeDasharray="4 4" />
                  <g transform="translate(170, 20) rotate(-25)">
                    {/* Keel fold */}
                    <path d="M -20 0 L 10 0" />
                    {/* Right Wing fold */}
                    <path d="M 10 0 L -20 12 L -5 3 Z" />
                    {/* Left Wing fold */}
                    <path d="M 10 0 L -20 -12 L -5 -3 Z" />
                  </g>
                </svg>
              </div>
              <h3 className="mt-8 text-xl font-heading font-black tracking-widest text-slate-900">SUCCESS!</h3>
              <p className="mt-4 px-8 text-sm font-medium text-slate-500 leading-relaxed font-body">
                Your request for <span className="font-bold text-slate-800">{submittedRequest.organization_name}</span> is received. We will get back to you soon.
              </p>
              <button
                type="button"
                onClick={() => {
                  setSubmittedRequest(null);
                  setFormData(initialFormState);
                  setCurrentStep(1);
                }}
                className="mt-8 w-[80%] py-3.5 rounded-full bg-[#2ecc71] hover:bg-[#27ae60] text-white font-heading font-bold text-sm tracking-widest shadow-lg shadow-emerald-500/20 transition-all"
              >
                Thanks!
              </button>
            </div>
          ) : (
            <div className="relative rounded-2xl border border-slate-200 bg-white p-8 md:p-12 shadow-[0_34px_90px_-56px_rgba(15,23,42,0.95)]">
              {/* Top Progress bar and desk header */}
              <div className="mb-10 flex items-center justify-between">
                <div>
                  <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-black text-red-600 font-heading">
                    <Clock3 className="h-3 w-3" />
                    Partner Desk
                  </span>
                </div>
                <div className="text-right">
                  <span className="text-sm font-bold text-red-600 font-heading">
                    Step {String(currentStep).padStart(2, "0")} / {String(totalSteps).padStart(2, "0")}
                  </span>
                </div>
              </div>

              {/* Progress bar line */}
              <div className="mb-12 h-1.5 w-full rounded-full bg-slate-100">
                <div
                  className="h-1.5 rounded-full bg-gradient-to-r from-red-600 to-red-500 transition-all duration-300"
                  style={{ width: `${(currentStep / totalSteps) * 100}%` }}
                />
              </div>

              {/* Step Forms */}
              <div className="min-h-[220px]">
                {/* Step 1: Contact Name */}
                {currentStep === 1 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">1 →</span> First, what is your full name? <span className="text-red-600 font-bold">*</span>
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">Let's get acquainted before diving into details.</p>
                    <input
                      autoFocus
                      type="text"
                      value={formData.contact_name}
                      onChange={(e) => updateField("contact_name", e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your answer here..."
                      className="mt-6 w-full border-b border-slate-200 bg-transparent py-3 text-xl font-medium text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                    />
                  </div>
                )}

                {/* Step 2: Organization Name */}
                {currentStep === 2 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">2 →</span> What is the name of your organization? <span className="text-red-600 font-bold">*</span>
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">Company, university, startup, or community name.</p>
                    <input
                      autoFocus
                      type="text"
                      value={formData.organization_name}
                      onChange={(e) => updateField("organization_name", e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your answer here..."
                      className="mt-6 w-full border-b border-slate-200 bg-transparent py-3 text-xl font-medium text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                    />
                  </div>
                )}

                {/* Step 3: Organization Type */}
                {currentStep === 3 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">3 →</span> What type of organization is this? <span className="text-red-600 font-bold">*</span>
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">Select the option that matches best.</p>
                    <select
                      autoFocus
                      value={formData.organization_type}
                      onChange={(e) => updateField("organization_type", e.target.value as CollaborationOrganizationType)}
                      onKeyDown={handleKeyPress}
                      className="mt-6 h-14 w-full rounded-lg border border-slate-200 bg-white px-4 text-lg font-medium text-slate-900 outline-none focus:border-red-500 transition-colors font-heading"
                    >
                      {organizationTypes.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  </div>
                )}

                {/* Step 4: Role Title */}
                {currentStep === 4 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">4 →</span> What is your role or title?
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">E.g., Founder, HR, Developer Relations, Student Lead (Optional).</p>
                    <input
                      autoFocus
                      type="text"
                      value={formData.role_title}
                      onChange={(e) => updateField("role_title", e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="Type your answer here..."
                      className="mt-6 w-full border-b border-slate-200 bg-transparent py-3 text-xl font-medium text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                    />
                  </div>
                )}

                {/* Step 5: Work Email */}
                {currentStep === 5 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">5 →</span> What is your email address? <span className="text-red-600 font-bold">*</span>
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">We'll use this for all professional correspondence.</p>
                    <input
                      autoFocus
                      type="email"
                      value={formData.work_email}
                      onChange={(e) => updateField("work_email", e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="name@company.com"
                      className="mt-6 w-full border-b border-slate-200 bg-transparent py-3 text-xl font-medium text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                    />
                  </div>
                )}

                {/* Step 6: Phone */}
                {currentStep === 6 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">6 →</span> What is your contact phone number?
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">Optional, but helpful for urgent calls.</p>
                    <input
                      autoFocus
                      type="text"
                      value={formData.phone}
                      onChange={(e) => updateField("phone", e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="+91 98765 43210"
                      className="mt-6 w-full border-b border-slate-200 bg-transparent py-3 text-xl font-medium text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                    />
                  </div>
                )}

                {/* Step 7: Website URL */}
                {currentStep === 7 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">7 →</span> Do you have a website or profile URL?
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">Provide a link to your company website or profile page (Optional).</p>
                    <input
                      autoFocus
                      type="text"
                      value={formData.website_url}
                      onChange={(e) => updateField("website_url", e.target.value)}
                      onKeyDown={handleKeyPress}
                      placeholder="https://company.com"
                      className="mt-6 w-full border-b border-slate-200 bg-transparent py-3 text-xl font-medium text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                    />
                  </div>
                )}

                {/* Step 8: Collaboration Focus */}
                {currentStep === 8 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">8 →</span> Select your collaboration focus areas <span className="text-red-600 font-bold">*</span>
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">Choose all areas you are interested in exploring.</p>
                    <div className="mt-6 grid grid-cols-1 gap-3 sm:grid-cols-2 max-h-[300px] overflow-y-auto pr-2 font-heading">
                      {interestOptions.map((option) => {
                        const checked = formData.collaboration_interests.includes(option.value);
                        return (
                          <button
                            key={option.value}
                            type="button"
                            onClick={() => toggleInterest(option.value)}
                            className={`flex items-center justify-between rounded-xl border p-4 text-left font-bold transition-all ${
                              checked
                                ? "border-red-200 bg-red-50 text-red-600"
                                : "border-slate-200 bg-white text-slate-700 hover:border-slate-300 hover:text-slate-950"
                            }`}
                          >
                            <span>{option.label}</span>
                            <span className={`flex h-5 w-5 items-center justify-center rounded border ${
                              checked ? "border-red-600 bg-red-600 text-white" : "border-slate-300"
                            }`}>
                              {checked && <Check className="h-3.5 w-3.5" />}
                            </span>
                          </button>
                        );
                      })}
                    </div>
                  </div>
                )}

                {/* Step 9: Timeline, Budget & Audience */}
                {currentStep === 9 && (
                  <div className="animate-fade-in space-y-6 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">9 →</span> Tell us about your logistics
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">All fields are optional.</p>
                    <div className="grid gap-5 sm:grid-cols-3 mt-6">
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">Timeline</span>
                        <input
                          autoFocus
                          type="text"
                          value={formData.timeline}
                          onChange={(e) => updateField("timeline", e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="This month, Q3"
                          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">Budget Range</span>
                        <input
                          type="text"
                          value={formData.budget_range}
                          onChange={(e) => updateField("budget_range", e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="Optional"
                          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                        />
                      </label>
                      <label className="block space-y-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-slate-500 font-heading">Audience size</span>
                        <input
                          type="text"
                          value={formData.student_audience}
                          onChange={(e) => updateField("student_audience", e.target.value)}
                          onKeyDown={handleKeyPress}
                          placeholder="50, 200, all"
                          className="h-12 w-full rounded-lg border border-slate-200 bg-white px-4 text-sm font-semibold text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 font-heading"
                        />
                      </label>
                    </div>
                  </div>
                )}

                {/* Step 10: Message Brief */}
                {currentStep === 10 && (
                  <div className="animate-fade-in space-y-4 font-heading">
                    <label className="block text-2xl md:text-3xl font-medium tracking-tight text-slate-950">
                      <span className="text-red-500 mr-2 font-bold">10 →</span> Briefly describe your partnership goals <span className="text-red-600 font-bold">*</span>
                    </label>
                    <p className="text-sm font-normal text-slate-500 font-body">Target students, preferred format, and what success looks like.</p>
                    <textarea
                      autoFocus
                      required
                      rows={5}
                      value={formData.message}
                      onChange={(e) => updateField("message", e.target.value)}
                      placeholder="Tell us what you would like to build together..."
                      className="mt-6 w-full resize-none border-b border-slate-200 bg-transparent py-2 text-lg font-medium text-slate-950 outline-none focus:border-red-500 transition-colors placeholder:text-slate-400 leading-relaxed font-heading"
                    />
                  </div>
                )}
              </div>

              {/* Navigation panel */}
              <div className="mt-12 flex items-center justify-between border-t border-slate-100 pt-6">
                <div>
                  {currentStep > 1 ? (
                    <button
                      type="button"
                      onClick={goBack}
                      className="inline-flex items-center gap-2 text-sm font-bold text-slate-500 transition-colors hover:text-slate-950 font-heading"
                    >
                      <ArrowLeft className="h-4 w-4" /> Back
                    </button>
                  ) : (
                    <span className="text-xs text-slate-400 font-heading">Press Enter ↵ to advance</span>
                  )}
                </div>
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={goNext}
                    disabled={isSubmitting}
                    className="inline-flex h-12 items-center justify-center gap-2 rounded-lg bg-slate-950 px-6 font-bold text-white transition-all hover:bg-red-600 disabled:cursor-not-allowed disabled:opacity-50 font-heading"
                  >
                    {currentStep === totalSteps ? (
                      isSubmitting ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Submitting
                        </>
                      ) : (
                        <>
                          Submit <Send className="h-4 w-4" />
                        </>
                      )
                    ) : (
                      <>
                        Next <ArrowRight className="h-4 w-4" />
                      </>
                    )}
                  </button>
                </div>
              </div>
            </div>
          )}

        </div>
      </main>

      {/* Custom Error Popup (Daily UI Style Modal Overlay with Disconnected Plug) */}
      {errorPopup && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4 animate-fade-in">
          <div className="w-full max-w-sm rounded-3xl border border-slate-100 bg-white shadow-2xl overflow-hidden flex flex-col items-center text-center pb-8 pt-6 animate-fade-in-up">
            {/* Disconnected Plug SVG Illustration */}
            <div className="w-full flex justify-center mb-4">
              <svg viewBox="0 0 200 120" className="w-48 h-32 text-slate-300 fill-none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
                {/* Wall Plate (3D perspective tilt) */}
                <path d="M 60 20 L 90 15 L 90 85 L 60 90 Z" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="2" />
                {/* Circular Socket */}
                <ellipse cx="75" cy="52" rx="9" ry="14" fill="#cbd5e1" stroke="#94a3b8" />
                {/* Outlets (two holes) */}
                <circle cx="72" cy="52" r="2" fill="#475569" />
                <circle cx="78" cy="52" r="2" fill="#475569" />

                {/* Plug (unplugged and pulled to the right) */}
                <g transform="translate(115, 58)">
                  {/* Plug body (red/orange) */}
                  <path d="M 0 -12 L 15 -12 A 12 12 0 0 1 27 0 L 27 12 A 12 12 0 0 1 15 24 L 0 24 Z" fill="#ef4444" stroke="#dc2626" strokeWidth="1.5" />
                  {/* Plug pins (silver/gray, pointing left to the socket) */}
                  <line x1="0" y1="2" x2="-10" y2="2" stroke="#94a3b8" strokeWidth="3" />
                  <line x1="0" y1="14" x2="-10" y2="14" stroke="#94a3b8" strokeWidth="3" />
                  {/* Cable wire trailing off to the right */}
                  <path d="M 27 6 C 50 6, 55 30, 95 24" stroke="#ef4444" strokeWidth="3.5" fill="none" />
                </g>
              </svg>
            </div>
            
            <h3 className="text-xl font-heading font-black tracking-widest text-[#ef4444]">OOPS!</h3>
            <h4 className="mt-2 text-md font-heading font-bold text-slate-900">{errorPopup.title || "Detail Missing!"}</h4>
            <p className="mt-3 px-8 text-xs font-medium text-slate-500 leading-relaxed font-body max-w-[280px]">
              {errorPopup.message}
            </p>
            <button
              type="button"
              onClick={() => setErrorPopup(null)}
              className="mt-6 w-[80%] py-3 rounded-full bg-[#ef4444] hover:bg-[#e03b3b] text-white font-heading font-bold text-sm tracking-widest shadow-lg shadow-red-600/20 transition-all"
            >
              Try Again
            </button>
          </div>
        </div>
      )}

      <Footer />
    </div>
  );
}
