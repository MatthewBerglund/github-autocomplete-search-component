import React from "react";

import Suggestion from './Suggestion';
import DisplayAllButton from './DisplayAllButton';

interface Props {
  suggestions: any[],
  numSuggestionsToDisplay: number,
  selectedIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
  displayAllSuggestions: () => void,
  clearSearch: () => void,
}

const SuggestionList: React.FC<Props> = ({
  suggestions,
  numSuggestionsToDisplay,
  selectedIndex,
  setSelectedIndex,
  displayAllSuggestions,
  clearSearch
}) => {
  const navigateSuggestions = (keyboardEventCode: string) => {
    if (suggestions) {
      switch (keyboardEventCode) {
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
    <ul className="max-h-fit" data-testid="suggestion-list">
      {suggestions.map((item, index) => {
        if (index < numSuggestionsToDisplay) {
          return (
            <li key={index} className="min-h-14 border-t" data-testid="suggestion-li">
              <Suggestion
                index={index}
                type={item.login ? 'user' : 'repo'}
                content={item.login || item.full_name}
                url={item.html_url}
                isSelected={selectedIndex === index}
                setSelectedIndex={setSelectedIndex}
              />
            </li>
          );
        }
      })}
      {suggestions.length > numSuggestionsToDisplay ? (
        <li key={numSuggestionsToDisplay}>
          <DisplayAllButton
            isSelected={selectedIndex === numSuggestionsToDisplay}
            onMouseOver={() => setSelectedIndex(numSuggestionsToDisplay)}
            onClick={() => {
              displayAllSuggestions();
              clearSearch();
            }}
          />
        </li>
      ) : null}
    </ul>
  );
};

export default SuggestionList;
