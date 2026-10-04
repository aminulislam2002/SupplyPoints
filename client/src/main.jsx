import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import router from "./routers/Router/Router.jsx";
import { RouterProvider } from "react-router";
import AuthProvider from "./providers/AuthProvider/AuthProvider.jsx";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import SidebarProvider from "./providers/SidebarProvider/SidebarProvider.jsx";
import ThemeProvider from "./providers/ThemeProvider/ThemeProvider.jsx";
import VariantsProvider from "./providers/VariantsProvider/VariantsProvider.jsx";
import CartProvider from "./providers/CartProvider/CartProvider.jsx";
import AddressProvider from "./providers/AddressProvider/AddressProvider.jsx";
import SubscriptionPaymentProvider from "./providers/SubscriptionPaymentProvider/SubscriptionPaymentProvider.jsx";

// Create a client
const queryClient = new QueryClient();

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <SidebarProvider>
          <AuthProvider>
            <VariantsProvider>
              <CartProvider>
                <AddressProvider>
                  <SubscriptionPaymentProvider>
                    <RouterProvider router={router} />
                  </SubscriptionPaymentProvider>
                </AddressProvider>
              </CartProvider>
            </VariantsProvider>
          </AuthProvider>
        </SidebarProvider>
      </ThemeProvider>
    </QueryClientProvider>
  </StrictMode>,
);
