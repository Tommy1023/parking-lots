/* eslint-disable camelcase */
import React, { memo, useState, useEffect } from 'react';
import { FaWheelchair, FaBabyCarriage } from 'react-icons/fa';
import InfoItem from '../InfoItem';
import { ParkingLotsWithAvailable } from '../../types';
import { prepServiceTime } from '../../helpers/prepServiceTime';

const InfoBar = memo(({ parkingLot }: { parkingLot: ParkingLotsWithAvailable }) => {
  const { summary, Handicap_First, Pregnancy_First, serviceTime } = parkingLot;

  const [parkingLotTypes, setParkingLotTypes] = useState<Array<string>>([]);

  useEffect(() => {
    const typeArray = [];
    if (summary.includes('立體')) {
      typeArray.push('立');
    }
    if (summary.includes('塔式')) {
      typeArray.push('塔');
    }
    if (summary.includes('機械')) {
      typeArray.push('機');
    }
    if (summary.includes('平面') || summary.includes('廣場')) {
      typeArray.push('平');
    }
    if (summary.includes('地下')) {
      typeArray.push('地');
    }
    setParkingLotTypes(typeArray);
  }, [summary]);

  return (
    <div className="mb-1 flex">
      {prepServiceTime(serviceTime) === '24小時' && (
        <InfoItem
          data={{ color: 'text-warning', type: '24' }}
          haveDescribe={false}
          showInfoBox
        />
      )}
      {Handicap_First && (
        <InfoItem data={{ color: 'text-primary' }} haveDescribe={false} showInfoBox>
          <FaWheelchair />
        </InfoItem>
      )}
      {Pregnancy_First && (
        <InfoItem data={{ color: 'text-pink-500' }} haveDescribe={false} showInfoBox>
          <FaBabyCarriage />
        </InfoItem>
      )}
      {parkingLotTypes &&
        parkingLotTypes.map((parkingLotType) => {
          return (
            <InfoItem
              key={parkingLotType}
              data={{ type: parkingLotType, color: 'text-info' }}
              haveDescribe={false}
              showInfoBox
            />
          );
        })}
    </div>
  );
});

export default InfoBar;
