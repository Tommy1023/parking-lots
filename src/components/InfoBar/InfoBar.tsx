/* eslint-disable camelcase */
import React, { memo, useState, useEffect } from 'react';
import { FaWheelchair, FaBabyCarriage } from 'react-icons/fa';
import InfoItem from '../InfoItem';
import { ParkingLotsWithAvailable } from '../../types';

const InfoBar = memo(({ parkingLot }: { parkingLot: ParkingLotsWithAvailable }) => {
  const { type2, type, summary, Handicap_First, Pregnancy_First } = parkingLot;

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
      {type2 === '1' ? (
        <InfoItem
          data={{ type: '公', color: 'text-primary' }}
          haveDescribe={false}
          showInfoBox
        />
      ) : (
        <InfoItem
          data={{ type: '民', color: 'text-warning' }}
          haveDescribe={false}
          showInfoBox
        />
      )}
      {type === '1' && (
        <InfoItem
          data={{ type: '即', color: 'text-success' }}
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
