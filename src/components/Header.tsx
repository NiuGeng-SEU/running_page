import { useLocale } from '../hooks/useLocale';

type Page = 'home' | 'tracks';

interface HeaderProps {
  dark: boolean;
  toggleTheme: () => void;
  page: Page;
  onNavigate: (p: Page) => void;
}

export function Header({ dark, toggleTheme, page, onNavigate }: HeaderProps) {
  const { t } = useLocale();

  const navItems: { label: string; page: Page }[] = [
    { label: t('home'), page: 'home' },
    { label: t('tracks'), page: 'tracks' },
  ];

  return (
    <header className="sticky top-0 z-50 border-b border-[var(--color-border)] bg-[var(--color-bg)]/70 backdrop-blur-md">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-4">
        <a
          href="https://gengniu.org/"
          className="text-xl font-bold text-[var(--color-text)] transition-opacity hover:opacity-70"
          aria-label="Geng Niu homepage"
        >
          gengniu.org
        </a>

        {/* Right nav */}
        <div className="flex items-center gap-6">
          {navItems.map((item) => (
            <button
              type="button"
              key={item.page}
              onClick={() => onNavigate(item.page)}
              className={`cursor-pointer border-0 bg-transparent p-0 text-sm transition-colors ${
                item.page === page
                  ? 'font-medium text-[var(--color-accent)]'
                  : 'text-[var(--color-muted)] hover:text-[var(--color-text)]'
              }`}
            >
              {item.label}
            </button>
          ))}
          <button
            onClick={toggleTheme}
            className="flex h-8 w-8 items-center justify-center rounded-lg transition-colors hover:bg-[var(--color-card)]"
          >
            {dark ? (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
                />
              </svg>
            ) : (
              <svg
                className="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth={2}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
                />
              </svg>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
