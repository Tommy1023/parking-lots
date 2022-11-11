import React, { memo } from 'react';

import { FaMapMarkerAlt } from 'react-icons/fa';
import shallow from 'zustand/shallow';
import useStore from '../../store';
import Button from './components/Button';

const Home = memo(() => {
  const { isAppInitializedComplete } = useStore((state) => {
    return {
      isAppInitializedComplete: state.isAppInitializedComplete,
    };
  }, shallow);

  return (
    <div className="h-screen w-screen flex-col bg-[#518ef0] text-2xl flex-center">
      <div className="h-full w-full flex-col flex-center">
        <div>
          <FaMapMarkerAlt size="6rem" color="#F5F8FA" />
        </div>
        <div className=" pt-1 text-3xl text-light">Parking Lot</div>
      </div>
      <Button toggle={isAppInitializedComplete} />
    </div>
  );
});

export default Home;
