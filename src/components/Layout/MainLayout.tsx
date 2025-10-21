import type { ReactNode } from "react";
import { SpaceComputer } from "./SpaceComputer";
import type { GamePhase } from "../../types";

interface MainLayoutProps {
  children: ReactNode;
  currentPhase: GamePhase;
}

export function MainLayout({ children, currentPhase }: MainLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-blue-900">
      {/* HUD/SpaceComputer */}
      <SpaceComputer currentPhase={currentPhase} />

      {/* Contenido Principal */}
      <main className="min-h-screen w-full pt-16 lg:pl-80">
        <div className="w-full h-full">{children}</div>
      </main>
    </div>
  );
}
