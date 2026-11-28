import { Link, useLocation } from 'react-router-dom';
import type { EventLinkProps } from '../../modules/events';
import type { BackToState } from '../navigation';

/**
 * Adaptador: liga o componente de link que o módulo de eventos espera ao React Router.
 * Guarda de onde se veio (com filtros e página) para o detalhe poder "voltar" ao mesmo sítio.
 */
export function RouterLink({ href, className, children }: EventLinkProps) {
  const location = useLocation();
  const state: BackToState = { backTo: `${location.pathname}${location.search}` };

  return (
    <Link to={href} state={state} className={className}>
      {children}
    </Link>
  );
}
