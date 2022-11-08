/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import shallow from 'zustand/shallow';
import { FaInfoCircle, FaCrosshairs, FaParking, FaSpinner } from 'react-icons/fa';
import useStore from '../../../store';
import CustomMarker from './components/CustomMarker';
import ParkingInfo from './components/ParkingInfo';
import { latlngToTwd97 } from '../../../helpers/coordTransHelper';
import { Park, AvailablePark } from '../../../types';
import IconBtn from './components/IconBtn';

const Map = memo(() => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
  });
  const { parkingLots, userCenter, allAvailable } = useStore((state) => {
    return {
      parkingLots: state.parkingLots,
      userCenter: state.userCenter,
      allAvailable: state.allAvailable,
    };
  }, shallow);

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(userCenter!);
  const [clickCoord, setClickCoord] = useState<google.maps.LatLngLiteral>(userCenter!);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [showParkingLotInfo, setShowParkingLotInfo] = useState<
    | (Park & {
        parkingAvailable?: AvailablePark | undefined;
      })
    | null
  >(null);
  const [showInfoBox, setShowInfoBox] = useState<boolean>(false);
  // 使用 useRef 綁定 DOM 設定地圖存放位置
  const mapRef = useRef<google.maps.Map | null>(null);

  const infoArray = [
    { name: '即時更新', color: 'blue' },
    { name: '無即時資料', color: '#9fc6f5' },
    { name: '車位小於5', color: '#FF6600' },
    { name: '無車位', color: '#666666' },
  ];
  // 點擊地圖取得點擊地點座標。
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setActiveMarker(null);
      setClickCoord({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  // Parking InfoWindow 開關，判斷被點擊的 marker
  const handleActiveMarker = (
    marker: string | null,
    ParkingLot: Park & {
      parkingAvailable?: AvailablePark | undefined;
    },
  ) => {
    if (marker !== activeMarker) {
      setActiveMarker(marker);
      setShowParkingLotInfo(ParkingLot);
    }
  };

  // 取得點擊地點坐標附近停車場資料
  const aroundParkingLots: Array<Park> | undefined = parkingLots?.filter((parkingLot) => {
    const twd97ClickCoord = latlngToTwd97(clickCoord.lat, clickCoord.lng);
    const top = twd97ClickCoord.twd97x + 1000;
    const bottom = twd97ClickCoord.twd97x - 1000;
    const left = twd97ClickCoord.twd97y - 1000;
    const right = twd97ClickCoord.twd97y + 1000;
    return (
      parseFloat(parkingLot.tw97x) < top &&
      parseFloat(parkingLot.tw97x) > bottom &&
      parseFloat(parkingLot.tw97y) > left &&
      parseFloat(parkingLot.tw97y) < right
    );
  });
  const aroundParkingLotWithAvailable: Array<Park> & {
    parkingAvailable?: AvailablePark | undefined;
  } = aroundParkingLots!.map((parkingLot) => {
    const parkingAvailable = allAvailable?.filter((available) => {
      return available.id === parkingLot.id;
    });
    return { ...parkingLot, parkingAvailable: parkingAvailable?.[0] };
  });

  if (!isLoaded) {
    return (
      <div className="h-full w-full bg-light text-2xl flex-center">
        <div className="animate-spin p-2 text-primary">
          <FaSpinner />
        </div>
        <p className="text-primary">Map Loading...</p>
      </div>
    );
  }

  return (
    <div className="relative h-full w-full">
      {/* ----------Location Icon---------- */}
      <div className="absolute top-4 right-4 z-[1] transition delay-150 duration-300 hover:-translate-y-1">
        <IconBtn
          onClick={() => {
            mapRef.current?.panTo(userCenter!);
            setClickCoord(userCenter!);
          }}
        >
          <FaCrosshairs size="1.6rem" color="blue" />
        </IconBtn>
      </div>
      {/* ----------InfoBox Icon---------- */}
      <div className="absolute top-16 right-4 z-[1] transition delay-150 duration-300 hover:-translate-y-1">
        <IconBtn onClick={() => setShowInfoBox((pre) => !pre)}>
          <FaInfoCircle size="1.6rem" color="blue" />
        </IconBtn>
      </div>
      {/* ----------InfoBox---------- */}
      <div
        className=" absolute top-28 right-4 z-[1] origin-top scale-y-0 rounded-md border-2 border-slate-400 bg-light p-2 shadow-md shadow-slate-400 transition-transform data-active:scale-100"
        data-active={showInfoBox}
      >
        {infoArray.map((info) => {
          return (
            <div
              key={info.name}
              className="flex items-center opacity-0 transition-opacity delay-150 data-active:opacity-100"
              data-active={showInfoBox}
            >
              <FaParking size="1.5rem" color={info.color} />
              <div className="ml-1">{info.name}</div>
            </div>
          );
        })}
      </div>
      {/* ----------google map---------- */}
      <div className="h-full w-full">
        <GoogleMap
          center={mapCenter!} // 地圖中央座標
          zoom={16} // 地圖縮放大小，數字越大越近
          mapContainerStyle={{ width: '100%', height: '100%' }} // 地圖大小
          options={{
            // 預設為true
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
          }}
          onLoad={(map: google.maps.Map): void => {
            mapRef.current = map;
          }}
          onUnmount={(): void => {
            mapRef.current = null;
          }}
          onClick={onMapClick}
          onDragEnd={() => {
            const latlng: google.maps.LatLng | undefined = mapRef.current?.getCenter();
            if (latlng) {
              setMapCenter({ lat: latlng?.lat(), lng: latlng.lng() });
              setClickCoord({ lat: latlng?.lat(), lng: latlng.lng() });
            }
          }}
        >
          {/* ----------Markers---------- */}
          <MarkerF position={userCenter!} />
          {aroundParkingLotWithAvailable?.map((parkingLot) => {
            return (
              <CustomMarker
                key={parkingLot.id}
                parkingLot={parkingLot}
                onSetActiveMarKer={setActiveMarker}
                onHandleActiveMarker={handleActiveMarker}
                onSetClickCoord={setClickCoord}
              />
            );
          })}
          {/* ----------ParkingInfo---------- */}
          {activeMarker && showParkingLotInfo && (
            <div className=" absolute bottom-0 left-1/2 max-h-[40%] w-full -translate-x-1/2 overflow-y-scroll rounded-t-2xl p-1 md:top-0 md:left-0 md:max-h-full md:w-[30%] md:-translate-x-0">
              <ParkingInfo origin={userCenter!} parkingLot={showParkingLotInfo} />
            </div>
          )}
        </GoogleMap>
      </div>
    </div>
  );
});

export default Map;
