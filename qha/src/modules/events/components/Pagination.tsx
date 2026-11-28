import { Button } from '../../ui';
import styles from './Pagination.module.css';

interface PaginationProps {
  page: number;
  pageCount: number;
  onPageChange: (page: number) => void;
}

export function Pagination({ page, pageCount, onPageChange }: PaginationProps) {
  if (pageCount <= 1) return null;

  return (
    <nav aria-label="Paginação" className={styles.nav}>
      <Button variant="secondary" disabled={page <= 1} onClick={() => onPageChange(page - 1)}>
        ← Anterior
      </Button>
      <span className={styles.status}>
        Página {page} de {pageCount}
      </span>
      <Button variant="secondary" disabled={page >= pageCount} onClick={() => onPageChange(page + 1)}>
        Seguinte →
      </Button>
    </nav>
  );
}
