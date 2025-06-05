import React, { lazy, Suspense } from 'react';
import { LoadingScreen } from 'shared/ui';
import { FreezerProvider, useFreezerContext } from 'freezers/hooks';

const FreezersCarousel = lazy(() => import('freezers/components/FreezersCarousel'));
const Header = lazy(() => import('shared/ui/Header'));

function DashboardContent() {
  const { loading } = useFreezerContext();

  if (loading) return <LoadingScreen />;

  return (
    <>
      <Header />
      <FreezersCarousel />
    </>
  );
}

function Dashboard() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 dark:from-gray-900 dark:via-blue-950 dark:to-indigo-950">
      {/* Animated background elements */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-blue-300/20 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-purple-300/20 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '2s' }}></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-indigo-200/10 rounded-full blur-3xl animate-pulse" style={{ animationDelay: '4s' }}></div>
      </div>

      {/* Main content */}
      <div className="relative z-10">
        <Suspense fallback={<LoadingScreen />}>
          <FreezerProvider>
            <DashboardContent />
          </FreezerProvider>
        </Suspense>

        {/* Bottom decorative elements */}
        <div className="absolute bottom-0 left-0 right-0 h-20 bg-gradient-to-t from-white/50 to-transparent dark:from-gray-900/50 pointer-events-none"></div>
      </div>
    </div>
  );
}

export default Dashboard;
