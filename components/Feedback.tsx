import React from "react";

interface Props {
  type: string,
  msg: string,
}

const Feedback: React.FC<Props> = ({ type, msg }) => {
  return (
    <p className={`${type === 'error' ? 'bg-red-600 border-red-600' : 'bg-black border-black'} text-white p-4`}>
      {msg}
    </p>
  );
};

export default Feedback;
