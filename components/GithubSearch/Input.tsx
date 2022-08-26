import React, { useState, useEffect, useRef } from 'react';

interface Props {
  clearSearch: () => void,
  initiateSearch: (query: string) => void,
  navigateSuggestions: (keyboardEventCode: string) => void,
}

const Input: React.FC<Props> = ({ clearSearch, initiateSearch, navigateSuggestions }) => {
  const [inputVal, setInputVal] = useState('');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (inputVal.trim().length < 3) {
      clearSearch();
      return;
    }

    initiateSearch(inputVal);
  }, [inputVal, initiateSearch, clearSearch]);

  function handleKeydown(e: React.KeyboardEvent) {
    if (e.key === 'Escape') {
      if (inputRef.current !== null) inputRef.current.blur();
      clearSearch();
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.key)) {
      navigateSuggestions(e.key);
      return;
    }
  }

  function handleBlur(e: React.FocusEvent) {
    let relatedTarget;
    if (e.relatedTarget?.classList.contains('github-suggestion-anchor')) {
      relatedTarget = e.relatedTarget as HTMLAnchorElement;
      window.open(relatedTarget.href, '_blank');
    } else if (e.relatedTarget?.id === 'display-all-button') {
      relatedTarget = e.relatedTarget as HTMLButtonElement;
      relatedTarget.click();
    }

    clearSearch();
  }

  return (
    <input
      ref={inputRef}
      type="search"
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      onFocus={() => {
        if (inputVal.length >= 3) initiateSearch(inputVal);
      }}
      onBlur={handleBlur}
      onKeyDown={handleKeydown}
      className="w-full h-10 focus:bg-slate-50 focus-visible:outline-none block px-4 sm:text-sm"
      placeholder="Search GitHub..."
    />
  );
};

export default Input;
