import { ErrorState } from '../../modules/ui';

/** Último recurso do router: falha no próprio layout ou numa rota. */
export function RouteErrorPage() {
  return (
    <main style={{ padding: 'var(--space-8) var(--space-4)', maxWidth: '40rem', margin: '0 auto' }}>
      <ErrorState
        title="Algo correu mal"
        description="A aplicação encontrou um erro inesperado. Recarregar a página costuma resolver."
        onRetry={() => window.location.reload()}
        retryLabel="Recarregar a página"
      />
    </main>
  );
}
