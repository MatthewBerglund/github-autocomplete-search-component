import React, { useRef } from 'react';
import { useState } from "react";

import Input from './Input';
import ResultItem from './ResultItem';

import fetchUsersAndRepos from "./fetchUsersAndRepos";

interface Props {
  token?: string,
}

const GithubSearch: React.FC<Props> = ({ token }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [searchResults, setSearchResults] = useState<any[] | null>(null);
  const [activeSuggestion, setActiveSuggestion] = useState<number>(0);

  const timeoutId = useRef<NodeJS.Timeout>();

  function initiateSearch(query: string) {
    // Fetching is indicated to user as they type
    // whether or not data is actually being fetched
    // as a means to improve user experience
    setIsFetching(true);
    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(async () => {
      try {
        const data = await fetchUsersAndRepos(query, token);
        if (data) {
          setSearchResults(data);
          setActiveSuggestion(0);
        };
      } catch (err) {
        console.log(err);
      }
      setIsFetching(false);
    }, 500);
  }

  function clearSearch() {
    clearTimeout(timeoutId.current);
    setSearchResults(null);
    setIsFetching(false);
    setActiveSuggestion(0);
  }

  function navigateSuggestions(keyboardEventCode: string) {
    if (searchResults) {
      switch (keyboardEventCode) {
        case 'ArrowDown':
          if (searchResults.length - 1 > activeSuggestion) {
            setActiveSuggestion(i => i + 1);
          }
          break;
        case 'ArrowUp':
          if (activeSuggestion > 0) {
            setActiveSuggestion(i => i - 1);
          }
          break;
        case 'Enter':
          console.log('Following link...');
          break;
      }
    }
  }

  return (
    <div className="w-full max-w-full h-fit border border-grey-400 bg-white">
      <Input
        clearSearch={clearSearch}
        initiateSearch={initiateSearch}
        navigateSuggestions={navigateSuggestions}
      />
      {isFetching ? <p className="p-4 border-black bg-black text-white">Searching...</p> : null}
      {searchResults && searchResults.length === 0 ? <p className="p-4">0 results found</p> : null}
      {searchResults && searchResults.length > 0 ? (
        <ul>
          {searchResults.map((item, index) => {
            const content = item.login ? item.login : item.full_name;
            return (
              <ResultItem
                key={index}
                content={content}
                isActive={activeSuggestion === index}
              />
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default GithubSearch;
