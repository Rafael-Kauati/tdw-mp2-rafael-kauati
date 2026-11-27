import { useMemo, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { describeEventsError, formatEventDates, genreLabel, useEventsFeed } from '../../modules/events';
import { Badge, ErrorState, Skeleton } from '../../modules/ui';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './EventosPage.module.css';

const PREVIEW_SIZE = 12;

function EventosSkeleton() {
  return (
    <ul className={styles.list} aria-busy="true" aria-label="A carregar eventos">
      {Array.from({ length: 6 }, (_, index) => (
        <li key={index} className={styles.item}>
          <div className={styles.link}>
            <Skeleton width="5rem" height="1.4rem" />
            <Skeleton height="1.4rem" />
            <Skeleton width="70%" />
          </div>
        </li>
      ))}
    </ul>
  );
}

/**
 * Página PROVISÓRIA: prova o ciclo loading → erro → dados com o router.
 * No dia 5 passa a usar filtros no URL, paginação e os componentes de listagem.
 */
export function EventosPage() {
  useDocumentTitle('Eventos');
  const { data, error, isPending, isError, refetch } = useEventsFeed();

  const preview = useMemo(() => {
    if (!data) return [];
    return [...data.events].sort((a, b) => b.relevanceScore - a.relevanceScore).slice(0, PREVIEW_SIZE);
  }, [data]);

  let content: ReactNode;
  if (isPending) {
    content = <EventosSkeleton />;
  } else if (isError) {
    const message = describeEventsError(error);
    content = (
      <ErrorState title={message.title} description={message.description} onRetry={() => void refetch()} />
    );
  } else {
    content = (
      <>
        <p className={styles.summary}>
          {data.events.length} eventos no total · a mostrar os {PREVIEW_SIZE} mais relevantes
        </p>
        <ul className={styles.list}>
          {preview.map((event) => (
            <li key={event.id} className={styles.item}>
              <Link to={`/eventos/${encodeURIComponent(event.id)}`} className={styles.link}>
                <Badge>{genreLabel(event.genre)}</Badge>
                <span className={styles.title}>{event.title}</span>
                <span className={styles.meta}>
                  {formatEventDates(event.startDate, event.endDate, event.startTime)}
                </span>
                {(event.venueName ?? event.concelho) && (
                  <span className={styles.meta}>{event.venueName ?? event.concelho}</span>
                )}
              </Link>
            </li>
          ))}
        </ul>
      </>
    );
  }

  return (
    <section aria-labelledby="eventos-titulo">
      <h1 id="eventos-titulo" className={styles.heading}>
        Eventos
      </h1>
      {content}
    </section>
  );
}
