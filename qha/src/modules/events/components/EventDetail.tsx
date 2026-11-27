import { Badge } from '../../ui';
import { genreLabel, type Event } from '../domain';
import { formatEventDates, formatPrice } from './format';
import styles from './EventDetail.module.css';

interface EventDetailProps {
  event: Event;
}

/** Apresentação do detalhe de um evento. Só recebe dados por props: sem router nem fetch. */
export function EventDetail({ event }: EventDetailProps) {
  const price = formatPrice(event.priceMin);
  const place = [event.venueName, event.concelho, event.distrito].filter(Boolean).join(' · ');

  return (
    <article className={styles.article}>
      <div className={styles.badges}>
        <Badge tone="accent">{genreLabel(event.genre)}</Badge>
        {event.soldOut && <Badge>Esgotado</Badge>}
      </div>

      <h1 className={styles.title}>{event.title}</h1>
      {event.pitch && <p className={styles.pitch}>{event.pitch}</p>}

      {event.imageUrl && (
        <img className={styles.image} src={event.imageUrl} alt="" loading="lazy" />
      )}

      <dl className={styles.facts}>
        <div>
          <dt>Quando</dt>
          <dd>{formatEventDates(event.startDate, event.endDate, event.startTime)}</dd>
        </div>
        {place && (
          <div>
            <dt>Onde</dt>
            <dd>
              {place}
              {event.address && <span className={styles.address}>{event.address}</span>}
            </dd>
          </div>
        )}
        {price && (
          <div>
            <dt>Preço</dt>
            <dd>{price}</dd>
          </div>
        )}
      </dl>

      {event.description && <p className={styles.description}>{event.description}</p>}

      {event.sourceUrl && (
        <a className={styles.source} href={event.sourceUrl} target="_blank" rel="noopener noreferrer">
          Ver no site original
        </a>
      )}
    </article>
  );
}
