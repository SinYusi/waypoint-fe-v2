"use client";

import { createContext, useContext, useState } from "react";

interface NotificationDrawerContextValue {
  isOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
}

const NotificationDrawerContext =
  createContext<NotificationDrawerContextValue>({
    isOpen: false,
    openDrawer: () => {},
    closeDrawer: () => {},
  });

export function NotificationDrawerProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <NotificationDrawerContext.Provider
      value={{
        isOpen,
        openDrawer: () => setIsOpen(true),
        closeDrawer: () => setIsOpen(false),
      }}
    >
      {children}
    </NotificationDrawerContext.Provider>
  );
}

export const useNotificationDrawer = () =>
  useContext(NotificationDrawerContext);
