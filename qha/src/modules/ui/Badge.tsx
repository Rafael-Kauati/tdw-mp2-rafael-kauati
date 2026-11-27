import type { ReactNode } from 'react';
import { cx } from './cx';
import styles from './Badge.module.css';

interface BadgeProps {
  tone?: 'neutral' | 'accent';
  children: ReactNode;
}

export function Badge({ tone = 'neutral', children }: BadgeProps) {
  return <span className={cx(styles.badge, styles[tone])}>{children}</span>;
}
