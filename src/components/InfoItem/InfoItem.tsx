import React, { memo } from 'react';

const InfoItem = memo(
  ({
    data,
    showInfoBox,
    haveDescribe,
    children,
  }: {
    data: { name?: string; type?: string; color?: string };
    showInfoBox: boolean;
    haveDescribe: boolean;
    children?: JSX.Element;
  }) => {
    return (
      <div
        className="mb-1 flex items-center opacity-0 transition-opacity delay-150 data-active:opacity-100"
        data-active={showInfoBox}
      >
        <p
          className={`mr-1 h-6 w-6 rounded-md border-2 flex-center border-${data.color} text-center text-sm text-${data.color}`}
        >
          {children || data.type}
        </p>
        {haveDescribe && <div>{data.name}</div>}
      </div>
    );
  },
);
export default InfoItem;
