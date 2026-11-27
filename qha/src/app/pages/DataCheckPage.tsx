import { describeEventsError, useEventsFeed } from '../../modules/events';

/** Página TEMPORÁRIA do dia 3: prova loading, sucesso e erro. Substituída pelo router no dia 4. */
export function DataCheckPage() {
  const { data, error, isPending, isError, isFetching, refetch } = useEventsFeed();

  if (isPending) {
    return <p role="status">A carregar eventos…</p>;
  }

  if (isError) {
    const message = describeEventsError(error);
    return (
      <div role="alert">
        <h2>{message.title}</h2>
        <p>{message.description}</p>
        <button type="button" onClick={() => refetch()}>
          Tentar novamente
        </button>
      </div>
    );
  }

  return (
    <section>
      <h1>Verificação da camada de dados</h1>
      <p>
        {data.events.length} eventos ({data.skippedCount} descartados)
      </p>
      <p>Ficheiro gerado em: {data.generatedAt ?? 'desconhecido'}</p>
      <ul>
        {data.events.slice(0, 5).map((event) => (
          <li key={event.id}>
            {event.startDate} — {event.title}
          </li>
        ))}
      </ul>
      {isFetching && <p role="status">A atualizar…</p>}
    </section>
  );
}