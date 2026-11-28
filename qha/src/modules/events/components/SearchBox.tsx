import { useEffect, useId, useState } from 'react';
import styles from './FiltersBar.module.css';

const DEBOUNCE_MS = 300;

interface SearchBoxProps {
  /** Valor atual no URL (fonte de verdade). */
  value: string;
  onSearch: (value: string) => void;
}

/**
 * Campo de pesquisa com debounce: o que se escreve fica logo visível, mas o URL
 * (e a lista) só mudam 300 ms depois da última tecla.
 * `emitted` evita que o "eco" do URL volte a escrever por cima do que o utilizador
 * já digitou entretanto; mudanças externas (voltar atrás, "Limpar filtros") atualizam o campo.
 */
export function SearchBox({ value, onSearch }: SearchBoxProps) {
  const id = useId();
  const [text, setText] = useState(value);
  const [emitted, setEmitted] = useState(value);
  const [seenValue, setSeenValue] = useState(value);

  // Ajuste durante o render (padrão recomendado pela React) quando o valor do URL muda.
  if (value !== seenValue) {
    setSeenValue(value);
    if (value !== emitted) {
      setText(value);
      setEmitted(value);
    }
  }

  useEffect(() => {
    if (text === emitted) return;
    const timer = setTimeout(() => {
      setEmitted(text);
      onSearch(text);
    }, DEBOUNCE_MS);
    return () => clearTimeout(timer);
  }, [text, emitted, onSearch]);

  return (
    <div className={styles.field}>
      <label htmlFor={id} className={styles.label}>
        Pesquisar
      </label>
      <input
        id={id}
        type="search"
        className={styles.control}
        value={text}
        placeholder="Título, local, cidade, género…"
        maxLength={100}
        autoComplete="off"
        onChange={(event) => setText(event.target.value)}
      />
    </div>
  );
}
