import React from 'react';

interface Props {
  index: number,
  content: string,
  url: string,
  isSelected: boolean,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
}

const Suggestion: React.FC<Props> = ({ index, content, url, isSelected, setSelectedIndex }) => {
  return (
    <li className="min-h-14 border-t">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className="github-suggestion-anchor flex align-middle"
        onMouseOver={() => setSelectedIndex(index)}
      >
        <span className={`${isSelected ? 'bg-blue-600 text-white' : ''} p-4 w-full break-words`}>{content}</span>
      </a>
    </li>
  );;
};

export default Suggestion;
