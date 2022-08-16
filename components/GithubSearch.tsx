import React, { useRef } from 'react';
import { useState } from "react";

import Input from './Input';
import Suggestion from './Suggestion';
import Feedback from './Feedback';

import fetchUsersAndRepos from "./fetchUsersAndRepos";

interface Props {
  token?: string,
}

const GithubSearch: React.FC<Props> = ({ token }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [didErrorOccur, setDidErrorOccur] = useState(false);

  const timeoutId = useRef<NodeJS.Timeout>();

  function initiateSearch(query: string) {
    // Fetching is indicated to user as they type
    // whether or not data is actually being fetched
    // as a means to improve user experience
    setIsFetching(true);
    setDidErrorOccur(false);
    clearTimeout(timeoutId.current);

    timeoutId.current = setTimeout(async () => {
      try {
        const data = await fetchUsersAndRepos(query, token);
        if (data) {
          setSuggestions(data);
          setSelectedIndex(0);
        };
      } catch (err) {
        console.error(err);
        setDidErrorOccur(true);
      }
      setIsFetching(false);
    }, 500);
  }

  function clearSearch() {
    clearTimeout(timeoutId.current);
    setSuggestions(null);
    setIsFetching(false);
    setSelectedIndex(0);
    setDidErrorOccur(false);
  }

  function navigateSuggestions(keyboardEventCode: string) {
    if (suggestions) {
      switch (keyboardEventCode) {
        case 'ArrowDown':
          if (suggestions.length - 1 > selectedIndex) {
            setSelectedIndex(i => i + 1);
          }
          break;
        case 'ArrowUp':
          if (selectedIndex > 0) {
            setSelectedIndex(i => i - 1);
          }
          break;
        case 'Enter':
          const selectedSuggestion = suggestions[selectedIndex];
          window.open(selectedSuggestion.html_url, '_blank');
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
      {isFetching ? (
        <Feedback type="info" msg="Searching..." />
      ) : didErrorOccur ? (
        <Feedback type="error" msg="Unable to retrieve data. Please try again later." />
      ) : suggestions && suggestions.length === 0 ? (
        <Feedback type="info" msg="0 results found." />
      ) : null}
      {suggestions && suggestions.length > 0 ? (
        <ul>
          {suggestions.map((item, index) => {
            return (
              <Suggestion
                key={index}
                index={index}
                content={item.login || item.full_name}
                url={item.html_url}
                isSelected={selectedIndex === index}
                setSelectedIndex={setSelectedIndex}
              />
            );
          })}
        </ul>
      ) : null}
    </div>
  );
};

export default GithubSearch;
