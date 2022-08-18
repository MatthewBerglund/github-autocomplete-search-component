import React, { useCallback, useRef, useState } from 'react';

import Input from './Input';
import Feedback from './Feedback';
import SuggestionList from './SuggestionList';

import fetchUsersAndRepos from "./fetchUsersAndRepos";

interface Props {
  token?: string,
  numSuggestionsToDisplay?: number,
  onShowAllClick: (suggestions: any[]) => void,
}

const GithubSearch: React.FC<Props> = ({ token, numSuggestionsToDisplay = 5, onShowAllClick }) => {
  const [isFetching, setIsFetching] = useState(false);
  const [suggestions, setSuggestions] = useState<any[] | null>(null);
  const [selectedIndex, setSelectedIndex] = useState<number>(0);
  const [didErrorOccur, setDidErrorOccur] = useState(false);

  const timeoutId = useRef<NodeJS.Timeout>();

  const displayAllSuggestions = () => {
    if (suggestions) onShowAllClick(suggestions);
  };

  const initiateSearch = useCallback((query: string) => {
    // Fetching is indicated to user as they type,
    // whether or not data is actually being fetched,
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
  }, [token]);

  const clearSearch = useCallback(() => {
    clearTimeout(timeoutId.current);
    setSuggestions(null);
    setIsFetching(false);
    setSelectedIndex(0);
    setDidErrorOccur(false);
  }, []);

  const navigateSuggestions = (keyboardEventKey: string) => {
    if (suggestions) {
      switch (keyboardEventKey) {
        case 'ArrowDown':
          if (suggestions.length > selectedIndex) {
            setSelectedIndex(i => i + 1);
          }
          break;
        case 'ArrowUp':
          if (selectedIndex > 0) {
            setSelectedIndex(i => i - 1);
          }
          break;
        case 'Enter':
          if (selectedIndex === numSuggestionsToDisplay) {
            displayAllSuggestions();
            clearSearch();
          } else {
            const selectedSuggestion = suggestions[selectedIndex];
            window.open(selectedSuggestion.html_url, '_blank');
            break;
          }
      }
    }
  };

  return (
    <div className="w-full max-w-full h-fit border border-grey-400 bg-white relative z-10">
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
        <SuggestionList
          suggestions={suggestions}
          numSuggestionsToDisplay={numSuggestionsToDisplay}
          selectedIndex={selectedIndex}
          setSelectedIndex={setSelectedIndex}
          displayAllSuggestions={displayAllSuggestions}
          clearSearch={clearSearch}
        />
      ) : null}
    </div>
  );
};

export default GithubSearch;
