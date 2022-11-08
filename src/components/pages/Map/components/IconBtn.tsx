import React, { memo } from 'react';

const IconBtn = memo(
  ({ onClick, children }: { onClick: () => void; children: React.ReactElement }) => {
    return (
      <button
        className="rounded-full border-2 border-primary bg-light p-1 shadow-md shadow-slate-400"
        onClick={() => onClick()}
      >
        {children}
      </button>
    );
  },
);

export default IconBtn;
