import type { ComponentType, ReactNode } from 'react';

export interface EventLinkProps {
  href: string;
  className?: string;
  children: ReactNode;
}

/**
 * Os componentes do módulo não conhecem o router: quem os usa pode injetar o seu
 * componente de link (React Router, Next.js…). Por defeito usam um <a> normal.
 */
export type EventLinkComponent = ComponentType<EventLinkProps>;
