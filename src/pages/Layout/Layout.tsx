import React, { memo } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  FaMapMarkedAlt,
  FaFilter,
  FaUserAlt,
  FaWhmcs,
  FaRegBookmark,
} from 'react-icons/fa';
import style from './layout.module.scss';
import IsLoading from '../../containers/IsLoading';

const Home = () => {
  return (
    <div className="h-screen w-screen flex-col">
      <div className="h-[90%]">
        <IsLoading>
          <Outlet />
        </IsLoading>
      </div>
      <div className={style.root}>
        <div className="flex h-full items-center justify-evenly rounded-t-lg border-2 bg-light">
          <NavLink to="map">
            <FaMapMarkedAlt className="icon h-8 w-8 text-[#bae6fd] transition delay-150  duration-300 hover:-translate-y-3 hover:text-primary" />
          </NavLink>
          <NavLink to="parkingList">
            <FaFilter className="icon h-8 w-8 text-[#bae6fd] transition delay-150 duration-300 hover:-translate-y-3 hover:text-primary" />
          </NavLink>
          <NavLink to="keeps">
            <FaRegBookmark className="icon h-8 w-8 text-[#bae6fd] transition delay-150 duration-300 hover:-translate-y-3 hover:text-primary" />
          </NavLink>
          <NavLink to="user">
            <FaUserAlt className="icon h-8 w-8 text-[#bae6fd] transition delay-150 duration-300 hover:-translate-y-3 hover:text-primary" />
          </NavLink>
          <NavLink to="setting">
            <FaWhmcs className="icon h-8 w-8 text-[#bae6fd] transition delay-150 duration-300 hover:-translate-y-3 hover:text-primary" />
          </NavLink>
        </div>
      </div>
    </div>
  );
};
export default memo(Home);
