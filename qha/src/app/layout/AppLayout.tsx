import { Link, NavLink, Outlet, ScrollRestoration, useLocation } from 'react-router-dom';
import { ErrorBoundary, cx } from '../../modules/ui';
import { APP_NAME } from '../config';
import styles from './AppLayout.module.css';

function navLinkClass({ isActive }: { isActive: boolean }) {
  return cx(styles.navLink, isActive && styles.active);
}

export function AppLayout() {
  const { pathname } = useLocation();

  return (
    <div className={styles.shell}>
      <a className={styles.skipLink} href="#conteudo">
        Saltar para o conteúdo
      </a>

      <header className={styles.header}>
        <div className={styles.inner}>
          <Link to="/eventos" className={styles.brand}>
            {APP_NAME}
          </Link>
          <nav aria-label="Principal" className={styles.nav}>
            <NavLink to="/eventos" className={navLinkClass}>
              Eventos
            </NavLink>
            <NavLink to="/sobre" className={navLinkClass}>
              Sobre
            </NavLink>
          </nav>
        </div>
      </header>

      <main id="conteudo" className={styles.main}>
        {/* key = pathname: ao navegar, o boundary recomeça limpo, e o cabeçalho continua visível se uma página falhar */}
        <ErrorBoundary key={pathname}>
          <Outlet />
        </ErrorBoundary>
      </main>

      <footer className={styles.footer}>
        <div className={styles.inner}>
          Dados de{' '}
          <a href="https://www.nocartaz.pt" target="_blank" rel="noopener noreferrer">
            nocartaz.pt
          </a>{' '}
          · Projeto académico TDW/MCTW
        </div>
      </footer>

      {/* Ao voltar atrás repõe o scroll onde estava; ao navegar para a frente sobe ao topo. */}
      <ScrollRestoration />
    </div>
  );
}
