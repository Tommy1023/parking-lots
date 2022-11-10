import React, { memo } from 'react';
import { Link } from 'react-router-dom';
import { FaMapMarkerAlt } from 'react-icons/fa';
import shallow from 'zustand/shallow';
import useStore from '../../store';

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
      {isAppInitializedComplete ? (
        <Link
          to="map"
          className="mb-4 mt-auto flex w-[60%] justify-center rounded-xl bg-primary p-2 text-light"
        >
          開始使用
        </Link>
      ) : (
        <button
          className="mb-4 mt-auto flex w-[60%] justify-center rounded-xl bg-primary p-2 text-light"
          disabled={isAppInitializedComplete}
        >
          應用程式初使化中
        </button>
      )}
    </div>
  );
});

export default Home;
