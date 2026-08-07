import { ReactNode } from "react";
import ShootingStars from "../../components/background/ShootingStars";
import AuraBackground from "../../components/background/AuraBackground";
import StarsBackground from "../../components/background/StarsBackground";

interface AuthLayoutProps {
  children: ReactNode;
}

export function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="fixed inset-0 bg-background flex items-center justify-center p-4 overflow-hidden">
      <AuraBackground />
      <StarsBackground />
      <ShootingStars interval={1500} />
      {children}
    </div>
  );
}

export default AuthLayout;
