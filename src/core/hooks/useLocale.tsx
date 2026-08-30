import { createContext, useContext, useCallback } from 'react';
import type { ReactNode } from 'react';
import { messages, type Locale } from '../i18n';

interface LocaleContextValue {
  locale: Locale;
  t: (key: string) => string;
}

const LocaleContext = createContext<LocaleContextValue>({
  locale: 'en',
  t: (key) => key,
});

export function LocaleProvider({ children }: { children: ReactNode }) {
  const locale: Locale = 'en';

  const t = useCallback((key: string) => {
    return messages.en[key] || key;
  }, []);

  return (
    <LocaleContext.Provider value={{ locale, t }}>
      {children}
    </LocaleContext.Provider>
  );
}

export function useLocale() {
  return useContext(LocaleContext);
}
