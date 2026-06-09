import { useState, type FormEvent } from "react";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";

const applicationSchema = z.object({
  name: z.string().min(2, "Enter your name."),
  college: z.string().min(2, "Enter your college."),
  year: z.string().min(1, "Enter your year or semester."),
  branch: z.string().min(2, "Enter your branch."),
  whatsapp: z.string().min(8, "Enter a valid WhatsApp number."),
  email: z.string().email("Enter a valid email."),
  skillLevel: z.string().min(2, "Enter your skill level."),
  github: z.string().url("Enter a valid GitHub link."),
  linkedin: z.string().url("Enter a valid LinkedIn link."),
  portfolio: z.string().optional(),
  whyJoin: z.string().min(20, "Write at least 20 characters."),
  dailyCommitment: z.string().min(2, "Confirm your daily commitment."),
});

type ApplicationForm = z.infer<typeof applicationSchema>;

const initialForm: ApplicationForm = {
  name: "",
  college: "",
  year: "",
  branch: "",
  whatsapp: "",
  email: "",
  skillLevel: "",
  github: "",
  linkedin: "",
  portfolio: "",
  whyJoin: "",
  dailyCommitment: "",
};

const fields = [
  { name: "name", label: "Name", placeholder: "Your full name" },
  { name: "college", label: "College", placeholder: "College name" },
  { name: "year", label: "Year / Semester", placeholder: "2nd year / Semester 4" },
  { name: "branch", label: "Branch", placeholder: "Computer Engineering" },
  { name: "whatsapp", label: "WhatsApp", placeholder: "+91 00000 00000" },
  { name: "email", label: "Email", placeholder: "you@example.com" },
  { name: "skillLevel", label: "Skill Level", placeholder: "Beginner / Intermediate" },
  { name: "github", label: "GitHub Link", placeholder: "https://github.com/username" },
  { name: "linkedin", label: "LinkedIn Link", placeholder: "https://linkedin.com/in/username" },
  { name: "portfolio", label: "Portfolio Link", placeholder: "https://your-site.com" },
] as const;

const JoinApplicationForm = () => {
  const [form, setForm] = useState<ApplicationForm>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ApplicationForm, string>>>({});
  const [submitted, setSubmitted] = useState(false);

  const updateField = (name: keyof ApplicationForm, value: string) => {
    setForm((current) => ({ ...current, [name]: value }));
    setErrors((current) => ({ ...current, [name]: undefined }));
    setSubmitted(false);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const result = applicationSchema.safeParse(form);

    if (!result.success) {
      const nextErrors: Partial<Record<keyof ApplicationForm, string>> = {};
      result.error.issues.forEach((issue) => {
        const field = issue.path[0] as keyof ApplicationForm;
        nextErrors[field] = issue.message;
      });
      setErrors(nextErrors);
      setSubmitted(false);
      return;
    }

    setSubmitted(true);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="rounded-lg border border-slate-200 bg-white p-6 shadow-[0_30px_90px_-55px_rgba(15,23,42,0.85)] md:p-8">
      <div className="grid gap-5 md:grid-cols-2">
        {fields.map((field) => (
          <div key={field.name} className="space-y-2">
            <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
              {field.label}
            </Label>
            <Input
              value={form[field.name]}
              onChange={(event) => updateField(field.name, event.target.value)}
              placeholder={field.placeholder}
              className="h-12 rounded-lg border-slate-200 bg-slate-50 font-medium focus-visible:ring-red-600/20"
            />
            {errors[field.name] && <p className="text-xs font-bold text-red-600">{errors[field.name]}</p>}
          </div>
        ))}
      </div>

      <div className="mt-5 space-y-2">
        <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          Why do you want to join?
        </Label>
        <Textarea
          value={form.whyJoin}
          onChange={(event) => updateField("whyJoin", event.target.value)}
          placeholder="Tell us what you want to build, learn, or improve through Mission 01."
          className="min-h-32 rounded-lg border-slate-200 bg-slate-50 font-medium focus-visible:ring-red-600/20"
        />
        {errors.whyJoin && <p className="text-xs font-bold text-red-600">{errors.whyJoin}</p>}
      </div>

      <div className="mt-5 space-y-2">
        <Label className="text-xs font-black uppercase tracking-[0.16em] text-slate-500">
          Can you give 30 minutes daily?
        </Label>
        <Input
          value={form.dailyCommitment}
          onChange={(event) => updateField("dailyCommitment", event.target.value)}
          placeholder="Yes, I can commit 30 minutes daily."
          className="h-12 rounded-lg border-slate-200 bg-slate-50 font-medium focus-visible:ring-red-600/20"
        />
        {errors.dailyCommitment && <p className="text-xs font-bold text-red-600">{errors.dailyCommitment}</p>}
      </div>

      {submitted && (
        <div className="mt-6 rounded-lg border border-emerald-200 bg-emerald-50 p-4 text-sm font-bold leading-6 text-emerald-800">
          Application draft validated. Backend submission can be connected when the review workflow is ready.
        </div>
      )}

      <Button className="mt-7 h-14 w-full rounded-lg bg-slate-950 text-sm font-black uppercase tracking-widest text-white hover:bg-red-600">
        Apply for Mission 01
      </Button>
    </form>
  );
};

export default JoinApplicationForm;
