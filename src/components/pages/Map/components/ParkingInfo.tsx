/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useState } from 'react';
import { DistanceMatrixService } from '@react-google-maps/api';
import { Park, AvailablePark, DistanceAndDuration } from '../../../../types';
import { twd97ToLatlng } from '../../../../helpers/coordTransHelper';

type ParkingInfoProp = {
  origin: google.maps.LatLngLiteral;
  parkingLot:
    | (Park & {
        parkingAvailable?: AvailablePark | undefined;
      })
    | null;
};

const ParkingInfo = ({ origin, parkingLot }: ParkingInfoProp) => {
  const {
    name,
    tw97x,
    tw97y,
    summary,
    payex,
    parkingAvailable,
    totalcar,
    totalmotor,
    totalbus,
  } = parkingLot!;
  const chargeStationList = parkingAvailable?.ChargeStation?.scoketStatusList;
  const standbyChargeStationCount = chargeStationList?.filter((scoketStatus) => {
    return scoketStatus.spot_status === '待機中';
  });
  const [distanceAndDuration, setDistanceAndDuration] =
    useState<DistanceAndDuration | null>(null);
  return (
    <>
      {/* 記算所在地與目的地的距離與行車時間 */}
      <DistanceMatrixService
        options={{
          destinations: [twd97ToLatlng(parseFloat(tw97x), parseFloat(tw97y))], // 上限25個
          origins: [origin],
          travelMode: google.maps.TravelMode.DRIVING,
        }}
        callback={(response) => {
          if (response) setDistanceAndDuration(response?.rows[0].elements[0]);
        }}
      />
      <div className="h-full w-full rounded-2xl border-4 bg-light p-4">
        <div className="text-lg font-semibold">{name}</div>
        <div>
          <div className="my-2 font-medium">介紹：</div>
          <div className="font-normal">{summary}</div>
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
            開車{distanceAndDuration?.duration.text}
          </a>
          <div className="mr-0 ml-auto">距離{distanceAndDuration?.distance.text}</div>
        </div>
      </div>
    </>
  );
};

export default memo(ParkingInfo);
