import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import ScrollToTop from "@/components/ScrollToTop";
import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";
import Index from "./pages/Index";
import CandidatesPage from "./pages/CandidatesPage";
import CandidateDetailPage from "./pages/CandidateDetailPage";
import ProgramPage from "./pages/ProgramPage";
import NewsPage from "./pages/NewsPage";
import NewsDetailPage from "./pages/NewsDetailPage";
import GalleryPage from "./pages/GalleryPage";
import PollPage from "./pages/PollPage";
import SuggestionsPage from "./pages/SuggestionsPage";
import NotFound from "./pages/NotFound";
import SupportCardPage from "./pages/SupportCardPage";
import { AdminAuthProvider } from "@/contexts/AdminAuthContext";
import AdminLogin from "./pages/admin/AdminLogin";
import AdminLayout from "./pages/admin/AdminLayout";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminCandidates from "./pages/admin/AdminCandidates";
import AdminNews from "./pages/admin/AdminNews";
import AdminProgram from "./pages/admin/AdminProgram";
import AdminHomepage from "./pages/admin/AdminHomepage";
import AdminMedia from "./pages/admin/AdminMedia";
import AdminVideos from "./pages/admin/AdminVideos";
import AdminPolls from "./pages/admin/AdminPolls";
import AdminMessages from "./pages/admin/AdminMessages";
import AdminStats from "./pages/admin/AdminStats";
import AdminSettings from "./pages/admin/AdminSettings";
import AdminEvents from "./pages/admin/AdminEvents";
import AdminUsers from "./pages/admin/AdminUsers";
import AdminAuditLog from "./pages/admin/AdminAuditLog";
import AdminChatAnalytics from "./pages/admin/AdminChatAnalytics";
import AdminCandidateAnalytics from "./pages/admin/AdminCandidateAnalytics";
import { usePageTracking } from "@/hooks/usePageTracking";
import CampaignChat from "@/components/CampaignChat";
import WelcomePopup from "@/components/WelcomePopup";


const queryClient = new QueryClient();

function AppContent() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith('/admin');
  usePageTracking();

  return (
    <>
      <ScrollToTop />
      {!isAdmin && <Navbar />}
      <main>
        <Routes>
          {/* Public routes */}
           <Route path="/" element={<Index />} />
           <Route path="/candidates" element={<CandidatesPage />} />
           <Route path="/candidates/:id" element={<CandidateDetailPage />} />
           <Route path="/program" element={<ProgramPage />} />
           <Route path="/news" element={<NewsPage />} />
           <Route path="/news/:id" element={<NewsDetailPage />} />
           <Route path="/gallery" element={<GalleryPage />} />
           <Route path="/poll" element={<PollPage />} />
           <Route path="/suggestions" element={<SuggestionsPage />} />
           <Route path="/support-card" element={<SupportCardPage />} />

          {/* Admin routes */}
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="candidates" element={<AdminCandidates />} />
            <Route path="news" element={<AdminNews />} />
            <Route path="program" element={<AdminProgram />} />
            <Route path="homepage" element={<AdminHomepage />} />
            <Route path="media" element={<AdminMedia />} />
            <Route path="videos" element={<AdminVideos />} />
            <Route path="polls" element={<AdminPolls />} />
            <Route path="messages" element={<AdminMessages />} />
            <Route path="stats" element={<AdminStats />} />
            <Route path="events" element={<AdminEvents />} />
            <Route path="users" element={<AdminUsers />} />
            <Route path="audit" element={<AdminAuditLog />} />
            <Route path="chat-analytics" element={<AdminChatAnalytics />} />
            <Route path="settings" element={<AdminSettings />} />
          </Route>

          <Route path="*" element={<NotFound />} />
        </Routes>
      </main>
      {!isAdmin && <Footer />}
      {!isAdmin && <CampaignChat />}
      {!isAdmin && <WelcomePopup />}
      
    </>
  );
}

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AdminAuthProvider>
        <BrowserRouter>
          <AppContent />
        </BrowserRouter>
      </AdminAuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
