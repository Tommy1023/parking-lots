import React, { memo, useState, useEffect, useCallback } from 'react';
import shallow from 'zustand/shallow';
import { useForm } from 'react-hook-form';
import { FaEraser } from 'react-icons/fa';
import { useMatch } from 'react-router-dom';
import useStore from '../../store/useMapStore';
import ListCard from '../../components/ListCard';
import TAIPEIAREAS from './taipeiArea.json';
import { Park, AvailablePark, ParkingLotsWithAvailable } from '../../types';

type FormValues = {
  area: string;
  keywords: string;
};

const List = () => {
  const {
    parkingLots,
    allAvailable,
    userCenter,
    setMapCenter,
    setClickCoord,
    setFilterMarker,
  } = useStore((state) => {
    return {
      parkingLots: state.parkingLots,
      allAvailable: state.allAvailable,
      userCenter: state.userCenter,
      setMapCenter: state.setMapCenter,
      setClickCoord: state.setClickCoord,
      setFilterMarker: state.setFilterMarker,
    };
  }, shallow);

  const [area, setArea] = useState('');
  const [keywords, setKeywords] = useState('');
  const [parkingLotsWithAvailable, setParkingLotsWithAvailable] = useState<
    ParkingLotsWithAvailable[] | null
  >(null);

  const isMatch = useMatch('/map');

  const { register, handleSubmit, setValue } = useForm<FormValues>({
    defaultValues: {
      area: '',
      keywords: '',
    },
  });

  const [filterParkingLots, setFilterParkingLots] = useState<Array<Park>>([]);

  const areaFilter = (data: Array<Park>, condition: FormValues): void => {
    if (!condition.area) return;
    const areaFilterRes = data.filter((parkingLot) => {
      return parkingLot.area === condition.area;
    });
    setFilterParkingLots(areaFilterRes);
  };

  const keywordsFilter = (data: Array<Park>, condition: FormValues): void => {
    if (!condition.keywords) return;
    const keywordsFilterRes = data.filter((parkingLot) => {
      return (
        parkingLot.address.includes(condition.keywords) ||
        parkingLot.name.includes(condition.keywords)
      );
    });
    setFilterParkingLots(keywordsFilterRes);
  };

  const parkingLotFilter = useCallback(
    (data: Array<Park> | null, condition: FormValues): void => {
      if (!condition || !data) return;
      if (condition.area && condition.keywords) {
        const areaFilterRes = data.filter((parkingLot) => {
          return parkingLot.area === condition.area;
        });
        const keywordsFilterRes = areaFilterRes.filter((parkingLot) => {
          return (
            parkingLot.address.includes(condition.keywords) ||
            parkingLot.name.includes(condition.keywords)
          );
        });
        setFilterParkingLots(keywordsFilterRes);
      }
      if (condition.area && !condition.keywords) {
        areaFilter(data, condition);
      }
      if (!condition.area && condition.keywords) {
        keywordsFilter(data, condition);
      }
    },
    [],
  );

  const atSubmit = (data: FormValues) => {
    setArea(data.area);
    setKeywords(data.keywords);
    setFilterParkingLots([]);
  };

  const atClean = () => {
    setValue('area', '');
    setValue('keywords', '');
    setFilterParkingLots([]);
  };

  const getParkingLotsWithAvailable = useCallback(
    (ParkingLots: Park[] | null, AllAvailable: AvailablePark[] | null) => {
      if (!ParkingLots || !AllAvailable) return;
      const result = ParkingLots.map((parkingLot) => {
        const parkingAvailable = AllAvailable?.filter((available) => {
          return available.id === parkingLot.id;
        });
        return { ...parkingLot, parkingAvailable: parkingAvailable?.[0] };
      });
      setParkingLotsWithAvailable(result);
    },
    [],
  );

  useEffect(() => {
    parkingLotFilter(parkingLots, { area, keywords });
  }, [parkingLots, area, keywords, parkingLotFilter]);

  useEffect(() => {
    getParkingLotsWithAvailable(filterParkingLots, allAvailable);
  }, [filterParkingLots, allAvailable, getParkingLotsWithAvailable]);

  useEffect(() => {
    if (!isMatch) {
      setFilterMarker(null);
      setClickCoord(userCenter);
      setMapCenter(userCenter);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className="relative h-full w-full overflow-y-scroll bg-[#518ef0] p-6">
      <form
        onChange={handleSubmit(atSubmit)}
        className=" fixed top-0 left-0 mb-2 flex w-full items-center rounded-md border-4 border-slate-400 bg-light p-3"
      >
        <select
          className="h-[50px] w-[50%]  rounded-md  border-2 border-slate-400"
          {...register('area')}
        >
          <option value="" disabled>
            請選擇地區
          </option>
          {TAIPEIAREAS.map((item) => {
            return (
              <option key={item.name} value={item.name}>
                {item.name}
              </option>
            );
          })}
        </select>
        <input
          className="ml-2 h-[50px] w-full rounded-md border-2 border-slate-400 p-2"
          type="text"
          placeholder="請輸入路段或停車場名稱"
          {...register('keywords')}
        />
        <div className="flex w-[15%] flex-col">
          <button
            type="submit"
            onClick={() => {
              atClean();
            }}
            className="m-2 flex h-[15px] items-center rounded-md p-1"
          >
            <FaEraser size="1.5rem" color="#518ef0" />
          </button>
        </div>
      </form>
      {keywords || area ? (
        <div className="mt-[70px] h-[90%]">
          {parkingLotsWithAvailable?.map((parkingLot) => {
            return <ListCard key={parkingLot.id} parkingLot={parkingLot} />;
          })}
        </div>
      ) : (
        <div className="mt-[75px] h-[90%] flex-col rounded-lg border-2 bg-light text-slate-500 shadow-sm flex-center">
          <p>請選擇地區</p>
          <p>或</p>
          <p>輸入鍵鍵字進行篩選</p>
        </div>
      )}
    </div>
  );
};

export default memo(List);
