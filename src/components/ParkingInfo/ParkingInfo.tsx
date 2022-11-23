/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { FaLocationArrow } from 'react-icons/fa';
import { Park, AvailablePark } from '../../types';
import InfoBar from '../InfoBar';
import { twd97ToLatlng } from '../../helpers/coordTransHelper';
import { prepServiceTime } from '../../helpers/prepServiceTime';

type ParkingInfoProp = {
  origin: google.maps.LatLngLiteral | null;
  parkingLot:
    | Park & {
        parkingAvailable?: AvailablePark | undefined;
      };
};

const ParkingInfo = ({ origin, parkingLot }: ParkingInfoProp) => {
  const { name, tw97x, tw97y, payex, parkingAvailable, serviceTime } = parkingLot!;
  const chargeStationList = parkingAvailable?.ChargeStation?.scoketStatusList;
  const standbyChargeStationCount = chargeStationList?.filter((scoketStatus) => {
    return scoketStatus.spot_status === '待機中';
  });

  // 記算所在地與目的地的距離與行車時間
  const [distanceAndDuration, setDistanceAndDuration] =
    useState<google.maps.DirectionsResult | null>(null);
  const calculateRoute = useCallback(
    async (
      start: google.maps.LatLngLiteral,
      end: {
        x: string;
        y: string;
      },
    ) => {
      if (start === null || end === null) return;
      const directionsService = new google.maps.DirectionsService();
      const results = await directionsService.route({
        origin: start,
        destination: twd97ToLatlng(parseFloat(end.x), parseFloat(end.y)),
        travelMode: google.maps.TravelMode.DRIVING,
      });
      setDistanceAndDuration(results);
    },
    [],
  );

  useEffect(() => {
    if (origin !== null) calculateRoute(origin, { x: tw97x, y: tw97y });
  }, [origin, tw97x, tw97y, calculateRoute]);

  return (
    <div className="h-full w-full rounded-2xl border-4 bg-light p-4">
      <div className="flex justify-between text-lg font-semibold">
        <p className="mb-2 text-lg font-medium">{name}</p>
        <InfoBar parkingLot={parkingLot} />
      </div>
      <div className="grid grid-cols-2">
        <div className="flex items-center font-normal">
          剩餘車位：
          <p className="ml-2">{parkingAvailable?.availablecar}</p>
        </div>
        {parkingAvailable?.ChargeStation && (
          <div className="flex items-center font-normal">
            充電站：
            <p className="ml-2">
              {`${standbyChargeStationCount?.length} / ${chargeStationList?.length}`}
            </p>
          </div>
        )}
      </div>
      {prepServiceTime(serviceTime) !== '24小時' && (
        <div>
          <div className="my-2 font-medium">營業時間：</div>
          <div className="font-normal">{serviceTime}</div>
        </div>
      )}
      <div>
        <div className="my-2 font-medium">收費：</div>
        <div className="font-normal">{payex}</div>
      </div>
      {origin === null ? (
        <div className="mt-2 rounded-md bg-warning p-2 flex-center">
          請開啟定位功能進行導航
        </div>
      ) : (
        <div className="mt-2 flex items-center py-2">
          <a
            href={`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${name}&travelmode=driving`}
            target="_blank"
            className="w-1/2 cursor-pointer rounded-lg bg-primary py-2 text-light flex-center"
            rel="noreferrer"
          >
            <FaLocationArrow />
            <p className="ml-2">
              開車{distanceAndDuration?.routes[0].legs[0].distance?.text}
            </p>
          </a>
          <div className="mr-0 ml-auto">
            距離{distanceAndDuration?.routes[0].legs[0].duration?.text}
          </div>
        </div>
      )}
    </div>
  );
};

export default memo(ParkingInfo);
