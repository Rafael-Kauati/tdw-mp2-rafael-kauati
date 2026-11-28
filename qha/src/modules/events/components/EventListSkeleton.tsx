import { Skeleton } from '../../ui';
import styles from './EventList.module.css';
import cardStyles from './EventCard.module.css';

const PLACEHOLDER_COUNT = 8;

/** Mesma grelha e proporções dos cartões reais, para a página não saltar quando os dados chegam. */
export function EventListSkeleton() {
  return (
    <ul className={styles.list} aria-busy="true" aria-label="A carregar eventos">
      {Array.from({ length: PLACEHOLDER_COUNT }, (_, index) => (
        <li key={index}>
          <div className={cardStyles.card}>
            <Skeleton height="auto" className={cardStyles.image} />
            <div className={cardStyles.body}>
              <Skeleton width="5rem" height="1.4rem" />
              <Skeleton height="1.4rem" />
              <Skeleton width="70%" />
            </div>
          </div>
        </li>
      ))}
    </ul>
  );
}
