import React from "react";

import Suggestion from './Suggestion';
import DisplayAllButton from './DisplayAllButton';

interface Props {
  suggestions: any[],
  numSuggestionsToDisplay: number,
  selectedIndex: number,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>,
  displayAllSuggestions: () => void
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
  return (
    <ul className="max-h-fit">
      {suggestions.map((item, index) => {
        if (index < numSuggestionsToDisplay) {
          return (
            <li key={index} className="min-h-14 border-t">
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
