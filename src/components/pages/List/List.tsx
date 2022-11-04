import React, { memo } from 'react';
import useStore from '../../../store';

const List = () => {
  const { parkingLots, allAvailable } = useStore((state) => {
    return {
      parkingLots: state.parkingLots,
      allAvailable: state.allAvailable,
    };
  });

  return (
    <pre className="h-full overflow-y-scroll text-start">
      {JSON.stringify(parkingLots?.[0], null, 2)}
      {JSON.stringify(allAvailable?.[0], null, 2)}
    </pre>
  );
};

export default memo(List);
