"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { useState } from "react"
import { NotificationDrawerProvider } from "@/lib/context/notification-drawer-context"
import NotificationDrawer from "@/components/notification/NotificationDrawer"

type ProvidersProps = {
  children: React.ReactNode
}

export function Providers({ children }: ProvidersProps) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            retry: 1,
            refetchOnWindowFocus: false,
          },
        },
      }),
  )

  return (
    <QueryClientProvider client={queryClient}>
      <NotificationDrawerProvider>
        {children}
        <NotificationDrawer />
      </NotificationDrawerProvider>
    </QueryClientProvider>
  )
}
