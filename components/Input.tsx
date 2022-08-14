import React, { useState, useEffect } from "react";

interface Props {
  clearSearch: () => void,
  initiateSearch: (query: string) => void,
  navigateSuggestions: (keyboardEventCode: string) => void,
}

const Input: React.FC<Props> = ({ clearSearch, initiateSearch, navigateSuggestions }) => {
  const [inputVal, setInputVal] = useState('');

  useEffect(() => {
    if (inputVal.trim().length < 3) {
      clearSearch();
      return;
    }

    initiateSearch(inputVal);
  }, [inputVal]);

  return (
    <input
      type="search"
      value={inputVal}
      onChange={(e) => setInputVal(e.target.value)}
      onFocus={() => {
        if (inputVal.length >= 3) initiateSearch(inputVal);
      }}
      onBlur={() => clearSearch()}
      onKeyDown={(e) => navigateSuggestions(e.code)}
      className="w-full h-10 focus:bg-slate-50 focus-visible:outline-0 block px-4 sm:text-sm rounded-t-md"
      placeholder="Search GitHub..."
    />
  );
};

export default Input;
