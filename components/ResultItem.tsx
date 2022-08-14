import React from 'react';

interface Props {
  content: string,
  isActive: boolean,
}

const ResultItem: React.FC<Props> = ({ content, isActive }) => {
  return (
    <li className={`${isActive ? 'bg-blue-600 text-white' : ''} px-4 py-4 border-t`}>
      <span>{content}</span>
    </li>
  );;
};

export default ResultItem;
