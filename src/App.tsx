import { Suspense, lazy } from 'react';
import { LocaleProvider } from './hooks/useLocale';
import { ErrorBoundary } from './components/ErrorBoundary';

const Dashboard = lazy(() => import('./themes/dashboard'));

export default function App() {
  return (
    <LocaleProvider>
      <ErrorBoundary>
        <Suspense
          fallback={
            <div
              className="flex min-h-screen items-center justify-center"
              style={{ backgroundColor: 'var(--color-bg, #0d1117)' }}
            >
              <div
                style={{
                  color: 'var(--color-muted, #8b949e)',
                  fontSize: '0.875rem',
                }}
              >
                Loading...
              </div>
            </div>
          }
        >
          <Dashboard />
        </Suspense>
      </ErrorBoundary>
    </LocaleProvider>
  );
}
