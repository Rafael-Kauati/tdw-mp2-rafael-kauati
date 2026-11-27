import { Component, type ErrorInfo, type ReactNode } from 'react';
import { ErrorState } from './ErrorState';

interface ErrorBoundaryProps {
  children: ReactNode;
}

interface ErrorBoundaryState {
  error: Error | null;
}

/**
 * Apanha erros de RENDER nos componentes filhos e mostra um estado de erro em vez
 * de deixar a página em branco. Tem de ser uma classe: os hooks ainda não
 * conseguem implementar getDerivedStateFromError. Não apanha erros de eventos
 * nem de código assíncrono (esses já passam pelo TanStack Query).
 */
export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  state: ErrorBoundaryState = { error: null };

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { error };
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('ErrorBoundary apanhou um erro:', error, info.componentStack);
  }

  private reset = () => {
    this.setState({ error: null });
  };

  render() {
    if (this.state.error) {
      return (
        <ErrorState
          title="Ocorreu um erro inesperado"
          description="Esta secção deixou de funcionar. Podes tentar novamente ou navegar para outra página."
          onRetry={this.reset}
        />
      );
    }
    return this.props.children;
  }
}
