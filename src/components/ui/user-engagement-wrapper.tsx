import type { ReactNode } from 'react';

export function UserEngagementWrapper({ children }: { children: ReactNode }) {
  return (
    <div className="user-engagement-bubble flex flex-col mt-4 pt-6 pb-8 max-desktop-nav:mt-2 max-desktop-nav:pt-5 max-desktop-nav:pb-1 max-sm:mt-1 max-sm:pt-4">
      {children}
    </div>
  );
}
