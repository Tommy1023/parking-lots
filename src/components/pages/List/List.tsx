import React, { memo, useState } from 'react';
import useStore from '../../../store';
import ListCard from './components/ListCard';
import TAIPEIAREAS from './taipeiArea.json';

const List = () => {
  const { parkingLots, allAvailable } = useStore((state) => {
    return {
      parkingLots: state.parkingLots,
      allAvailable: state.allAvailable,
    };
  });
  const [select, setSelect] = useState<string>('');
  const atSelectChange = (e: { target: { value: React.SetStateAction<string> } }) => {
    setSelect(e.target.value);
  };

  return (
    <div className="h-full w-full overflow-y-scroll bg-light p-4">
      <select
        value={select}
        onChange={atSelectChange}
        className=" h-[42px] w-[40%] rounded-md  border-2 border-slate-400"
      >
        <option value="" disabled>
          請選擇地區
        </option>
        {TAIPEIAREAS.map((area) => {
          return (
            <option key={area.name} value={area.name}>
              {area.name}
            </option>
          );
        })}
      </select>
      <ListCard />
      <ListCard />
      <ListCard />
      <pre className="max-h-[50%] w-full overflow-y-scroll text-start">
        {JSON.stringify(parkingLots?.[0], null, 2)}
        {JSON.stringify(allAvailable?.[0], null, 2)}
      </pre>
    </div>
  );
};

export default memo(List);
