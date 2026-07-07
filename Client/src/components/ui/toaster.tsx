import { useToast } from "@/hooks/use-toast";
import { Toast, ToastClose, ToastDescription, ToastProvider, ToastTitle, ToastViewport } from "@/components/ui/toast";
import { CheckCircle2, AlertTriangle, Info, Terminal, Sparkles } from "lucide-react";

export function Toaster() {
  const { toasts } = useToast();

  return (
    <ToastProvider>
      {toasts.map(function ({ id, title, description, action, variant, ...props }) {
        // Resolve a simple icon depending on the variant and content
        let Icon = Info;
        let isSuccess = false;
        
        if (variant === "destructive") {
          Icon = AlertTriangle;
        } else {
          const text = ((typeof title === "string" ? title : "") + " " + (typeof description === "string" ? description : "")).toLowerCase();
          if (text.includes("success") || text.includes("successfully") || text.includes("complete")) {
            Icon = CheckCircle2;
            isSuccess = true;
          } else if (text.includes("warning") || text.includes("alert")) {
            Icon = AlertTriangle;
          } else if (text.includes("challenge") || text.includes("event") || text.includes("builder") || text.includes("sync")) {
            Icon = Terminal;
          } else if (text.includes("achievement") || text.includes("unlock") || text.includes("aura") || text.includes("reward")) {
            Icon = Sparkles;
          }
        }

        const borderClass = variant === "destructive" 
          ? "border-l-4 border-l-red-500 border-red-100 bg-red-50/40" 
          : isSuccess 
          ? "border-l-4 border-l-emerald-500 border-emerald-100 bg-emerald-50/40" 
          : "border-l-4 border-l-slate-500 border-slate-200 bg-slate-50/30";

        const iconContainerClass = variant === "destructive"
          ? "bg-red-100 text-red-600"
          : isSuccess
          ? "bg-emerald-100 text-emerald-600"
          : "bg-slate-100 text-slate-600";

        return (
          <Toast 
            key={id} 
            variant={variant} 
            {...props} 
            className={`group relative pl-4 pr-10 py-3.5 flex items-center gap-3 min-h-[56px] rounded-xl shadow-lg transition-all duration-300 font-heading ${borderClass}`}
          >
            {/* Status Icon */}
            <div className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-lg ${iconContainerClass}`}>
              <Icon className="h-4.5 w-4.5" />
            </div>
            
            <div className="flex flex-col justify-center flex-1 min-w-0">
              <div className="flex items-baseline gap-2 flex-wrap sm:flex-nowrap">
                {title && (
                  <ToastTitle className={`text-sm font-bold uppercase tracking-wider ${variant === "destructive" ? "text-red-700" : isSuccess ? "text-emerald-700" : "text-slate-800"}`}>
                    {title}
                  </ToastTitle>
                )}
                {title && description && <span className="text-slate-300 text-xs hidden sm:inline select-none">|</span>}
                {description && (
                  <ToastDescription className={`text-xs font-semibold ${variant === "destructive" ? "text-red-600" : isSuccess ? "text-emerald-600" : "text-slate-600"} font-body max-w-full truncate`}>
                    {description}
                  </ToastDescription>
                )}
              </div>
            </div>
            {action}
            <ToastClose className="text-slate-400 hover:text-slate-600 hover:bg-slate-100/80 rounded-lg p-1" />
          </Toast>
        );
      })}
      <ToastViewport />
    </ToastProvider>
  );
}
