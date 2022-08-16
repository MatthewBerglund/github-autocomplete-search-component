import React, { useState, useEffect, useRef } from "react";

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
    if (e.code === 'Escape') {
      if (inputRef.current !== null) inputRef.current.blur();
      clearSearch();
      return;
    }

    if (['ArrowUp', 'ArrowDown', 'Enter'].includes(e.code)) {
      navigateSuggestions(e.code);
      return;
    }
  }

  function handleBlur(e: React.FocusEvent) {
    if (e.relatedTarget?.classList.contains('github-suggestion-anchor')) {
      const relatedTarget = e.relatedTarget as HTMLAnchorElement;
      window.open(relatedTarget.href, '_blank');
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
      className="w-full h-10 focus:bg-slate-50 focus-visible:outline-0 block px-4 sm:text-sm rounded-t-md"
      placeholder="Search GitHub..."
    />
  );
};

export default Input;
