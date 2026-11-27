import { cx } from './cx';
import styles from './Skeleton.module.css';

interface SkeletonProps {
  width?: string;
  height?: string;
  className?: string;
}

/** Bloco cinzento animado que ocupa o lugar do conteúdo enquanto carrega. */
export function Skeleton({ width = '100%', height = '1rem', className }: SkeletonProps) {
  return <span aria-hidden="true" className={cx(styles.skeleton, className)} style={{ width, height }} />;
}
