import React from "react";

interface Props {
  isSelected: boolean,
  onClick: () => void,
  onMouseOver: () => void,
}

const DisplayAllButton: React.FC<Props> = ({
  isSelected,
  onClick,
  onMouseOver,
}) => {
  return (
    <button
      type="button"
      id="display-all-button"
      className={`${isSelected ? 'bg-blue-100' : ''} w-full p-4 border-t text-blue-600`}
      onClick={onClick}
      onMouseOver={onMouseOver}
    >
      Show more suggestions
    </button>
  );
}

export default DisplayAllButton;
