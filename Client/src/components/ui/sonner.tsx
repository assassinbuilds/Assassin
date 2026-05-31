import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}
      className="toaster group"
      position="bottom-right"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-slate-900 group-[.toaster]:border-slate-200/90 group-[.toaster]:shadow-lg group-[.toaster]:rounded-xl group-[.toaster]:p-3.5 group-[.toaster]:pl-4",
          description: "group-[.toast]:text-slate-600",
          actionButton: "group-[.toast]:bg-slate-900 group-[.toast]:text-white",
          cancelButton: "group-[.toast]:bg-slate-100 group-[.toast]:text-slate-600",
        },
      }}
      {...props}
    />
  );
};

export { Toaster, toast };
