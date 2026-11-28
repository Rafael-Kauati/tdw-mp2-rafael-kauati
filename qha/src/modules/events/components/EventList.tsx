import type { Event } from '../domain';
import { EventCard } from './EventCard';
import type { EventLinkComponent } from './types';
import styles from './EventList.module.css';

interface EventListProps {
  events: Event[];
  getHref: (event: Event) => string;
  linkComponent?: EventLinkComponent;
}

export function EventList({ events, getHref, linkComponent }: EventListProps) {
  return (
    <ul className={styles.list}>
      {events.map((event) => (
        <li key={event.id}>
          <EventCard event={event} href={getHref(event)} linkComponent={linkComponent} />
        </li>
      ))}
    </ul>
  );
}
