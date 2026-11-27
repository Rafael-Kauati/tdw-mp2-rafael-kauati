import { Link } from 'react-router-dom';
import { EmptyState } from '../../modules/ui';
import { useDocumentTitle } from '../hooks/useDocumentTitle';

export function NotFoundPage() {
  useDocumentTitle('Página não encontrada');

  return (
    <EmptyState
      title="Página não encontrada"
      description="O endereço que abriste não existe."
      action={<Link to="/eventos">Ir para os eventos</Link>}
    />
  );
}
