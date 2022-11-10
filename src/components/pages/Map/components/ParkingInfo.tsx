/* eslint-disable camelcase */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useState, useEffect, useCallback } from 'react';
import { Park, AvailablePark } from '../../../../types';
import InfoBar from '../../../InfoBar';
import { twd97ToLatlng } from '../../../../helpers/coordTransHelper';

type ParkingInfoProp = {
  origin: google.maps.LatLngLiteral;
  parkingLot:
    | Park & {
        parkingAvailable?: AvailablePark | undefined;
      };
};

const ParkingInfo = ({ origin, parkingLot }: ParkingInfoProp) => {
  const { name, tw97x, tw97y, payex, parkingAvailable, totalcar, totalmotor, totalbus } =
    parkingLot!;
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
    calculateRoute(origin, { x: tw97x, y: tw97y });
  }, [origin, tw97x, tw97y, calculateRoute]);

  return (
    <div className="h-full w-full rounded-2xl border-4 bg-light p-4">
      <div className="flex flex-col justify-between text-lg font-semibold">
        <p className="mb-2 text-lg font-medium">{name}</p>
        <InfoBar parkingLot={parkingLot} />
      </div>
      <div>
        <div className="my-2 font-medium">收費：</div>
        <div className="font-normal">{payex}</div>
      </div>
      {parkingAvailable ? (
        <div>
          <div className="my-2 font-medium">剩餘車位：</div>
          <div className="grid grid-cols-2">
            {totalcar !== 0 && (
              <div className="font-normal">
                汽車：
                {parkingAvailable.availablecar < 0
                  ? '離線中'
                  : `${parkingAvailable.availablecar} / ${totalcar}`}
              </div>
            )}
            {totalmotor !== 0 && (
              <div className="font-normal">
                機車：
                {parkingAvailable.availablemotor < 0
                  ? '離線中'
                  : `${parkingAvailable.availablemotor} / ${totalmotor}`}
              </div>
            )}
            {totalbus !== 0 && (
              <div className="font-normal">
                大客車：
                {parkingAvailable.availablebus < 0
                  ? '離線中'
                  : `${parkingAvailable.availablebus} / ${totalbus}`}
              </div>
            )}
            {parkingAvailable.ChargeStation && (
              <div className="font-normal">
                充電站：
                {`${standbyChargeStationCount?.length} / ${chargeStationList?.length}`}
              </div>
            )}
          </div>
        </div>
      ) : null}
      <div className="flex items-center py-2">
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${name}&travelmode=driving`}
          target="_blank"
          className="w-1/2 cursor-pointer rounded-lg bg-primary py-2 text-center text-light"
          rel="noreferrer"
        >
          開車{distanceAndDuration?.routes[0].legs[0].distance?.text}
        </a>
        <div className="mr-0 ml-auto">
          距離{distanceAndDuration?.routes[0].legs[0].duration?.text}
        </div>
      </div>
    </div>
  );
};

export default memo(ParkingInfo);
