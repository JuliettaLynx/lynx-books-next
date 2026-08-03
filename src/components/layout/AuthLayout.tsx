import { ReactNode, FormEvent } from "react";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";

interface AuthLayoutProps {
  title: string;
  children: ReactNode;
  onSubmit: (e: FormEvent<HTMLFormElement>) => void;
  submitText: string;
  loading: boolean;
  toggleLink: ReactNode;
  error?: string;
}

export function AuthLayout({
  title,
  children,
  onSubmit,
  submitText,
  loading,
  toggleLink,
  error,
}: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 overflow-hidden">
      <div className="absolute inset-0 z-0 auth-background">
        <div className="aurora aurora-1" />
        <div className="aurora aurora-2" />
        <div className="stars" />
      </div>

      <div className="relative z-10 rounded-2xl p-6 w-full max-w-sm bg-secondary/50 -bg-linear-20 from-background/50 via-secondary/30 to-primary/20">
        <h1 className="text-foreground text-2xl tracking-wider font-bold text-center pb-4">
          {title}
        </h1>

        <form onSubmit={onSubmit} className="space-y-4">
          {children}

          <Button
            type="submit"
            disabled={loading}
            className="w-full py-5 bg-primary hover:bg-primary/80 font-medium text-secondary rounded-lg transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin text-secondary" />
                Загрузка…
              </>
            ) : (
              submitText
            )}
          </Button>

          <p className="text-center text-sm text-muted-foreground mt-4">
            {toggleLink}
          </p>
        </form>
      </div>
    </div>
  );
}

export default AuthLayout;
