import React from "react";

interface Props {
  type: string,
  msg: string,
}

const Feedback: React.FC<Props> = ({ type, msg }) => {
  return (
    <p className={`${type === 'error' ? 'text-red-600' : 'text-white'} p-4 border-black bg-black`}>
      {msg}
    </p>
  );
};

export default Feedback;
