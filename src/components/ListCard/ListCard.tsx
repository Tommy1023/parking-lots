/* eslint-disable camelcase */
import React, { memo } from 'react';
import {
  FaBusAlt,
  FaMotorcycle,
  FaBiking,
  FaCarSide,
  FaMapMarkerAlt,
  FaChargingStation,
} from 'react-icons/fa';
import { Link } from 'react-router-dom';
import shallow from 'zustand/shallow';
import { ParkingLotsWithAvailable } from '../../types';
import useMapStore from '../../store/useMapStore';
import InfoBar from '../InfoBar';
import { prepServiceTime } from '../../helpers/prepServiceTime';

const ListCard = memo(({ parkingLot }: { parkingLot: ParkingLotsWithAvailable }) => {
  const {
    name,
    address,
    summary,
    tel,
    payex,
    totalbike,
    totalbus,
    totalcar,
    totalmotor,
    serviceTime,
    tw97x,
    tw97y,
    parkingAvailable,
  } = parkingLot;
  const chargeStationList = parkingAvailable?.ChargeStation?.scoketStatusList;
  const standbyChargeStationCount = chargeStationList?.filter((scoketStatus) => {
    return scoketStatus.spot_status === '待機中';
  });
  const { goToMap } = useMapStore((state) => {
    return {
      goToMap: state.goToMap,
    };
  }, shallow);

  return (
    <div className="mt-3 h-1/3 w-full overflow-y-scroll rounded-md border-2 border-slate-400 bg-light p-2 shadow-lg">
      <div className="flex justify-between">
        {/* -------------------- Name -------------------- */}
        <p className="mb-2 text-lg font-medium">{name}</p>
        {/* -------------------- Icons -------------------- */}
        <InfoBar parkingLot={parkingLot} />
      </div>
      {/* -------------------- Parking Lots -------------------- */}
      <div className="flex justify-between">
        <div className="flex items-center">
          {totalcar !== 0 && (
            <div className="mr-3 flex items-center">
              <FaCarSide />
              <div className="ml-1">
                {parkingAvailable && parkingAvailable.availablecar > 0
                  ? `${parkingAvailable.availablecar} / ${totalcar}`
                  : ` 離線中 / ${totalcar}`}
              </div>
            </div>
          )}
          {chargeStationList && (
            <div className="mr-3 flex items-center">
              <FaChargingStation />
              <div className="ml-1">
                {standbyChargeStationCount?.length} / {chargeStationList?.length}
              </div>
            </div>
          )}
          {totalmotor !== 0 && (
            <div className="mr-3 flex items-center">
              <FaMotorcycle />
              <div className="ml-1">
                {parkingAvailable && parkingAvailable.availablemotor > 0
                  ? `${parkingAvailable.availablemotor} / ${totalmotor}`
                  : ` 離線中 / ${totalmotor}`}
              </div>
            </div>
          )}
          {totalbus !== 0 && (
            <div className="mr-3 flex items-center">
              <FaBusAlt />
              <div className="ml-1">
                {parkingAvailable && parkingAvailable.availablebus > 0
                  ? `${parkingAvailable.availablebus} / ${totalbus}`
                  : ` 離線中 / ${totalbus}`}
              </div>
            </div>
          )}
          {totalbike !== 0 && (
            <div className="mr-3 flex items-center">
              <FaBiking />
              <div className="ml-1">{totalbike}</div>
            </div>
          )}
        </div>
      </div>
      <div
        className="flex items-center data-active:flex-col data-active:items-start"
        data-active={address.length > 20}
      >
        地址：
        {address ? (
          <Link
            className="flex cursor-pointer items-center"
            to="/map"
            onClick={() => {
              goToMap(tw97x, tw97y);
            }}
          >
            <FaMapMarkerAlt color="#911d1d" />
            <p className="ml-1">{address}</p>
          </Link>
        ) : (
          '無提供資料'
        )}
      </div>
      <div>電話：{tel || '無提供資料'}</div>
      {prepServiceTime(serviceTime) !== '24小時' && (
        <div>營業時間：{prepServiceTime(serviceTime)}</div>
      )}
      <div>
        <p>收費資訊：</p>
        <p>{payex && payex !== '' ? payex : '無提供資料'}</p>
      </div>
      <div>
        <p>介紹：</p>
        <p>{summary && summary !== '' ? summary : '無提供資料'}</p>
      </div>
    </div>
  );
});

export default ListCard;
