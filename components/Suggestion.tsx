import React from 'react';

interface Props {
  content: string,
  url: string,
  isSelected: boolean,
}

const Suggestion: React.FC<Props> = ({ content, url, isSelected }) => {
  return (
    <li className="h-14 border-t">
      <a href={url} target="_blank" className="flex align-middle">
        <span className={`${isSelected ? 'bg-blue-600 text-white' : ''} p-4 w-full`}>{content}</span>
      </a>
    </li>
  );;
};

export default Suggestion;
