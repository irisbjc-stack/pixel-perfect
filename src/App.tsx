import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

// Pages
import Landing from "./pages/Landing";
import Login from "./pages/Login";
import Demo from "./pages/Demo";
import NotFound from "./pages/NotFound";

// App pages
import Dashboard from "./pages/app/Dashboard";
import Tasks from "./pages/app/Tasks";
import Fleet from "./pages/app/Fleet";
import MapViewer from "./pages/app/MapViewer";
import Alerts from "./pages/app/Alerts";
import Settings from "./pages/app/Settings";
import Simulation from "./pages/app/Simulation";

// Layout & Auth
import { AppLayout } from "./components/layout/AppLayout";
import { ProtectedRoute } from "./components/auth/ProtectedRoute";

const queryClient = new QueryClient();

const App = () => (
  <HelmetProvider>
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Landing />} />
            <Route path="/login" element={<Login />} />
            <Route path="/demo" element={<Demo />} />
            
            {/* Protected app routes */}
            <Route path="/app" element={
              <ProtectedRoute>
                <AppLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="map" element={<MapViewer />} />
              <Route path="tasks" element={<Tasks />} />
              <Route path="fleet" element={<Fleet />} />
              <Route path="zones" element={<Dashboard />} />
              <Route path="models" element={<Dashboard />} />
              <Route path="alerts" element={<Alerts />} />
              <Route path="logs" element={<Dashboard />} />
              <Route path="simulation" element={<Simulation />} />
              <Route path="settings" element={<Settings />} />
            </Route>
            
            {/* Catch-all */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </QueryClientProvider>
  </HelmetProvider>
);

export default App;
