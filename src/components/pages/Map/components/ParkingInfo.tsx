import React, { memo } from 'react';
import { Park, AvailablePark, DistanceAndDuration } from '../../../../types';

const ParkingInfo = ({
  origin,
  parkingLot,
  distanceAndDuration,
}: {
  origin: google.maps.LatLngLiteral;
  parkingLot: Park & {
    parkingAvailable?: AvailablePark | undefined;
  };
  distanceAndDuration: DistanceAndDuration | null;
}) => {
  const { name, summary, payex, parkingAvailable, totalcar, totalmotor, totalbus } =
    parkingLot;
  const chargeStationList = parkingAvailable?.ChargeStation?.scoketStatusList;
  const standbyChargeStationCount = chargeStationList?.filter((scoketStatus) => {
    return scoketStatus.spot_status === '待機中';
  });

  return (
    <div className="rounded-lg bg-light p-2">
      <div className="text-lg font-semibold">{name}</div>
      <div>
        <div className="mt-1 font-medium">介紹：</div>
        <div className="font-normal">{summary}</div>
      </div>
      <div>
        <div className="mt-1 font-medium">收費：</div>
        <div className="font-normal">{payex}</div>
      </div>
      {parkingAvailable ? (
        <div>
          <div className="mt-1 font-medium">剩餘車位：</div>
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
        <div className="w-1/2 cursor-pointer rounded-lg bg-primary py-2 text-center text-light">
          開車{distanceAndDuration?.duration.text}
        </div>
        <a
          href={`https://www.google.com/maps/dir/?api=1&origin=${origin.lat},${origin.lng}&destination=${name}&travelmode=driving`}
          target="_blank"
          className="hover:underline-offset- mx-2 text-lg font-normal text-blue-700 hover:underline"
          rel="noreferrer"
        >
          導航
        </a>
        <div className="mr-0 ml-auto">距離{distanceAndDuration?.distance.text}</div>
      </div>
    </div>
  );
};

export default memo(ParkingInfo);
