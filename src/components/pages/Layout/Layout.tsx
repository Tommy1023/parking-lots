import React, { memo } from 'react';
import { Outlet, NavLink } from 'react-router-dom';
import {
  FaMapMarkedAlt,
  FaThList,
  FaUserAlt,
  FaWhmcs,
  FaRegBookmark,
} from 'react-icons/fa';
import style from './layout.module.scss';

const Home = () => {
  return (
    <div className="h-screen w-screen flex-col">
      <div className="h-[90%]">
        <Outlet />
      </div>
      <div className={style.root}>
        <NavLink to="map">
          <FaMapMarkedAlt className={style.icon} />
        </NavLink>
        <NavLink to="parkingList">
          <FaThList className={style.icon} />
        </NavLink>
        <NavLink to="keeps">
          <FaRegBookmark className={style.icon} />
        </NavLink>
        <NavLink to="user">
          <FaUserAlt className={style.icon} />
        </NavLink>
        <NavLink to="setting">
          <FaWhmcs className={style.icon} />
        </NavLink>
      </div>
    </div>
  );
};
export default memo(Home);
