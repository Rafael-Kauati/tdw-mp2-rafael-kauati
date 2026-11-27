import { useEffect } from 'react';
import { APP_NAME } from '../config';

/** Numa SPA o título do separador não muda sozinho ao navegar: acompanha a página atual. */
export function useDocumentTitle(title: string): void {
  useEffect(() => {
    document.title = `${title} · ${APP_NAME}`;
  }, [title]);
}
