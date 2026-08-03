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
    <div className="fixed min-h-screen min-w-full bg-background flex items-center justify-center p-4">
      <div className="bg-secondary rounded-2xl p-6 w-full max-w-sm -bg-linear-20 from-background/50 via-secondary/30 to-accent/70">
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
