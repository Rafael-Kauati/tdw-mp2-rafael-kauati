import { useDocumentTitle } from '../hooks/useDocumentTitle';
import { APP_NAME } from '../config';
import styles from './SobrePage.module.css';

/** Página estática: não obtém dados, por isso não tem estados de loading nem de erro. */
export function SobrePage() {
  useDocumentTitle('Sobre');

  return (
    <article className={styles.article}>
      <h1 className={styles.heading}>Sobre o {APP_NAME}</h1>

      <p>
        O {APP_NAME} é uma aplicação front-end para explorar a agenda cultural portuguesa. Reúne
        milhares de eventos — teatro, música, exposições, cinema, dança e mais — a partir dos dados
        públicos do{' '}
        <a href="https://www.nocartaz.pt" target="_blank" rel="noopener noreferrer">
          nocartaz.pt
        </a>
        .
      </p>

      <h2>Como funciona</h2>
      <p>
        Os eventos são lidos de um único ficheiro JSON, validados e normalizados no browser, e
        guardados em cache. A pesquisa, os filtros e a ordenação acontecem localmente, e o estado
        fica no endereço da página para que qualquer resultado possa ser partilhado como link.
      </p>

      <h2>Sobre os dados</h2>
      <p>
        Os dados vêm de várias fontes e nem sempre estão completos: alguns eventos não têm imagem,
        preço ou localização exata. Mostramos apenas o que existe e remetemos para a página original
        de cada evento para confirmar horários e bilhetes.
      </p>

      <h2>Projeto</h2>
      <p>
        Desenvolvido no âmbito do Miniprojeto M2A (TDW/MCTW), com React, TypeScript, React Router e
        TanStack Query.
      </p>
    </article>
  );
}
