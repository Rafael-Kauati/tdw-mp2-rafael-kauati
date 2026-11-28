import { Badge } from '../../ui';
import { genreLabel, type Event } from '../domain';
import { formatEventDates, formatPrice } from './format';
import type { EventLinkComponent, EventLinkProps } from './types';
import styles from './EventCard.module.css';

function PlainLink({ href, className, children }: EventLinkProps) {
  return (
    <a href={href} className={className}>
      {children}
    </a>
  );
}

interface EventCardProps {
  event: Event;
  href: string;
  linkComponent?: EventLinkComponent;
}

/** Cartão de um evento. O cartão inteiro é clicável através do link do título (::after estendido no CSS). */
export function EventCard({ event, href, linkComponent: Link = PlainLink }: EventCardProps) {
  const price = formatPrice(event.priceMin);
  const place = event.venueName ?? event.concelho;

  return (
    <article className={styles.card}>
      {event.imageUrl ? (
        <img className={styles.image} src={event.imageUrl} alt="" loading="lazy" />
      ) : (
        // Plano B para eventos sem imagem: bloco com a inicial, para a grelha não ficar com buracos.
        <div className={styles.placeholder} aria-hidden="true">
          {event.title.charAt(0).toUpperCase()}
        </div>
      )}

      <div className={styles.body}>
        <div className={styles.badges}>
          <Badge tone="accent">{genreLabel(event.genre)}</Badge>
          {event.soldOut && <Badge>Esgotado</Badge>}
        </div>

        <h2 className={styles.title}>
          <Link href={href} className={styles.link}>
            {event.title}
          </Link>
        </h2>

        <p className={styles.meta}>{formatEventDates(event.startDate, event.endDate, event.startTime)}</p>
        {place && <p className={styles.meta}>{place}</p>}
        {price && <p className={styles.price}>{price}</p>}
      </div>
    </article>
  );
}
