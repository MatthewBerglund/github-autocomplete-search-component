import React, { useEffect, useRef } from 'react';
import { useState } from "react";

import ResultItem from './ResultItem';

import fetchUsersAndRepos from "./fetchUsersAndRepos";

interface Props {
  token?: string,
}

const GithubSearch: React.FC<Props> = ({ token }) => {
  const [inputVal, setInputVal] = useState('');
  const [isFetching, setIsFetching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [activeSuggestion, setActiveSuggestion] = useState<number | undefined>();

  const timeoutId = useRef<NodeJS.Timeout>();

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setInputVal(e.target.value);
  }

  useEffect(() => {
    clearTimeout(timeoutId.current);

    if (inputVal.trim().length < 3) {
      setSearchResults([]);
      setIsFetching(false);
      return;
    }

    // Provide feedback to the user as they type to improve user experience
    // whether or not data is actually being fetched
    setIsFetching(true);

    timeoutId.current = setTimeout(async () => {
      try {
        const data = await fetchUsersAndRepos(inputVal, token);

        if (data) {
          setSearchResults(data);
        }
      } catch (err) {
        console.log(err);
      }

      setIsFetching(false);
    }, 500);
  }, [inputVal]);

  return (
    <div className="w-full h-fit border border-grey-400 bg-white">
      <input
        type="search"
        value={inputVal}
        onChange={handleChange}
        className="w-full h-10 focus:bg-slate-50 focus-visible:outline-0 block px-5 sm:text-sm rounded-t-md"
        placeholder="Search GitHub..."
      />
      <div>
        {isFetching ? <p className="p-4 border-t bg-black text-white">Searching...</p> : null}
      </div>
      <ul>
        {searchResults ? searchResults.map((item, index) => {
          const content = item.login ? item.login : item.full_name;
          return (
            <ResultItem
              key={index}
              content={content}
              isActive={activeSuggestion === index}
            />
          );
        }) : null}
      </ul>
    </div>
  );
};

export default GithubSearch;
