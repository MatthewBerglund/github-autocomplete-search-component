import React from 'react';

import { UserIcon, FolderOpenIcon } from '@heroicons/react/outline';

interface Props {
  index: number,
  type: string,
  content: string,
  url: string,
  isSelected: boolean,
  setSelectedIndex: React.Dispatch<React.SetStateAction<number>>
}

const Suggestion: React.FC<Props> = ({ index, type, content, url, isSelected, setSelectedIndex }) => {
  return (
    <li className="min-h-14 border-t">
      <a
        href={url}
        target="_blank"
        rel="noreferrer"
        className={`${isSelected ? 'bg-blue-600 text-white' : ''} github-suggestion-anchor grid grid-cols-6 items-center justify-items-center`}
        onMouseOver={() => setSelectedIndex(index)}
      >
        <span className="p-4 w-full break-words col-span-5">{content}</span>
        {type === 'user' ? (
          <UserIcon className={`${isSelected ? 'text-white' : 'text-gray-400'} h-5 w-5`} />
        ) : (
          <FolderOpenIcon className={`${isSelected ? 'text-white' : 'text-gray-400'} h-5 w-5`} />
        )}

      </a>
    </li>
  );;
};

export default Suggestion;
