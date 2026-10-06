import React, { createContext, useContext } from 'react';
import { usePendingInvitations } from '@/hooks/queries/useInvitations';

interface InvitationContextType {
  pendingInvitationsCount: number;
}

const InvitationContext = createContext<InvitationContextType | undefined>(undefined);

export const useInvitations = () => {
  const context = useContext(InvitationContext);
  if (!context) {
    throw new Error('useInvitations must be used within an InvitationProvider');
  }
  return context;
};

export const InvitationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { data } = usePendingInvitations();
  const pendingInvitationsCount = data?.invitations?.length ?? 0;

  return (
    <InvitationContext.Provider value={{ pendingInvitationsCount }}>
      {children}
    </InvitationContext.Provider>
  );
};
