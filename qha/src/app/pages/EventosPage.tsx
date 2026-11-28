import { useCallback, useMemo, type ReactNode } from 'react';
import { useSearchParams } from 'react-router-dom';
import {
  applyFilterPatch,
  computeFacets,
  DEFAULT_FILTERS,
  describeEventsError,
  EventList,
  EventListSkeleton,
  FiltersBar,
  filterEvents,
  hasActiveFilters,
  Pagination,
  paginate,
  parseFilters,
  serializeFilters,
  sortEvents,
  todayInLisbon,
  useEventsFeed,
  type Event,
  type EventFilters,
} from '../../modules/events';
import { Button, EmptyState, ErrorState } from '../../modules/ui';
import { RouterLink } from '../components/RouterLink';
import { useDocumentTitle } from '../hooks/useDocumentTitle';
import styles from './EventosPage.module.css';

const PAGE_SIZE = 24;

function getEventHref(event: Event): string {
  return `/eventos/${encodeURIComponent(event.id)}`;
}

/**
 * Listagem. O URL é a fonte de verdade dos filtros, da ordenação e da página:
 *   URL → parseFilters → filtrar/ordenar/paginar → ecrã
 *   ecrã → updateFilters → serializeFilters → URL
 * Os dados vêm do TanStack Query; nada disto é guardado em useState.
 */
export function EventosPage() {
  useDocumentTitle('Eventos');
  const [searchParams, setSearchParams] = useSearchParams();
  const filters = useMemo(() => parseFilters(searchParams), [searchParams]);
  const today = useMemo(() => todayInLisbon(), []);
  const { data, error, isPending, isError, refetch } = useEventsFeed();

  // ~5700 eventos: filtrar + ordenar + facetas demora alguns milissegundos. Se algum dia pesar,
  // separar o que depende da página (só paginate) do resto, ou mover para um Web Worker.
  const view = useMemo(() => {
    if (!data) return null;
    const matches = sortEvents(filterEvents(data.events, filters, today), filters.sort, today);
    return {
      facets: computeFacets(data.events, filters, today),
      page: paginate(matches, filters.page, PAGE_SIZE),
    };
  }, [data, filters, today]);

  const updateFilters = useCallback(
    (patch: Partial<EventFilters>) => {
      const keys = Object.keys(patch);
      // Escrever na pesquisa substitui a entrada do histórico (senão "voltar" passaria letra a letra).
      const onlyQuery = keys.length === 1 && keys[0] === 'q';
      setSearchParams(serializeFilters(applyFilterPatch(filters, patch)), { replace: onlyQuery });
    },
    [filters, setSearchParams],
  );

  // Limpar filtros mantém a ordenação escolhida: ordenar não é filtrar.
  const resetFilters = useCallback(() => {
    setSearchParams(serializeFilters({ ...DEFAULT_FILTERS, sort: filters.sort }));
  }, [filters.sort, setSearchParams]);

  let content: ReactNode;
  if (isPending) {
    content = <EventListSkeleton />;
  } else if (isError) {
    const message = describeEventsError(error);
    content = (
      <ErrorState title={message.title} description={message.description} onRetry={() => void refetch()} />
    );
  } else if (view && view.page.total === 0) {
    content = (
      <EmptyState
        title="Nenhum evento encontrado"
        description="Experimenta alargar as datas ou remover algum filtro."
        action={
          hasActiveFilters(filters) ? (
            <Button variant="secondary" onClick={resetFilters}>
              Limpar filtros
            </Button>
          ) : undefined
        }
      />
    );
  } else if (view) {
    content = (
      <>
        <EventList events={view.page.items} getHref={getEventHref} linkComponent={RouterLink} />
        <Pagination
          page={view.page.page}
          pageCount={view.page.pageCount}
          onPageChange={(page) => updateFilters({ page })}
        />
      </>
    );
  }

  return (
    <section aria-labelledby="eventos-titulo">
      <h1 id="eventos-titulo" className={styles.heading}>
        Eventos
      </h1>

      {view && (
        <FiltersBar filters={filters} facets={view.facets} onChange={updateFilters} onReset={resetFilters} />
      )}
      {view && (
        <p role="status" className={styles.summary}>
          {view.page.total} {view.page.total === 1 ? 'resultado' : 'resultados'}
        </p>
      )}

      {content}
    </section>
  );
}
