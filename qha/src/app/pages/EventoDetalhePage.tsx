import type { ReactNode } from 'react';
import { Link, useParams } from 'react-router-dom';
import { describeEventsError, EventDetail, useEvent } from '../../modules/events';
import { EmptyState, ErrorState, Skeleton } from '../../modules/ui';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './EventoDetalhePage.module.css';

function DetalheSkeleton() {
  return (
    <div className={styles.skeleton} aria-busy="true" aria-label="A carregar evento">
      <Skeleton width="6rem" height="1.4rem" />
      <Skeleton height="2.5rem" />
      <Skeleton width="60%" height="1.5rem" />
      <Skeleton height="8rem" />
    </div>
  );
}

export function EventoDetalhePage() {
  const { id } = useParams();
  const { data: event, error, isPending, isError, refetch } = useEvent(id);
  useDocumentTitle(event?.title ?? 'Evento');

  let content: ReactNode;
  if (isPending) {
    content = <DetalheSkeleton />;
  } else if (isError) {
    const message = describeEventsError(error);
    content = (
      <ErrorState title={message.title} description={message.description} onRetry={() => void refetch()} />
    );
  } else if (event === null) {
    content = (
      <EmptyState
        title="Evento não encontrado"
        description="Este evento pode já não existir ou o link estar incorreto."
        action={<Link to="/eventos">Ver todos os eventos</Link>}
      />
    );
  } else {
    content = <EventDetail event={event} />;
  }

  return (
    <div>
      <Link to="/eventos" className={styles.back}>
        ← Todos os eventos
      </Link>
      {content}
    </div>
  );
}
