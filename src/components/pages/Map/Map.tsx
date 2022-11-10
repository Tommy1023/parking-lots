/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState, useEffect } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import shallow from 'zustand/shallow';
import {
  FaInfoCircle,
  FaCrosshairs,
  FaParking,
  FaSpinner,
  FaWheelchair,
  FaBabyCarriage,
} from 'react-icons/fa';
import useStore from '../../../store';
import CustomMarker from './components/CustomMarker';
import ParkingInfo from './components/ParkingInfo';
import { Park, AvailablePark } from '../../../types';
import IconBtn from './components/IconBtn';
import parkingIconState from './parkingIconState.json';
import InfoItem from '../../InfoItem/InfoItem';
import parkingType from './parkingType.json';

const Map = memo(() => {
  // -------------------------- Hooks --------------------------
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
  });
  const {
    parkingLots,
    userCenter,
    mapCenter,
    clickCoord,
    allAvailable,
    getAroundParkingLotsWithAvailable,
    aroundParkingLotWithAvailable,
    filterMarker,
    setClickCoord,
    setMapCenter,
  } = useStore((state) => {
    return {
      parkingLots: state.parkingLots,
      userCenter: state.userCenter,
      mapCenter: state.mapCenter,
      clickCoord: state.clickCoord,
      allAvailable: state.allAvailable,
      getAroundParkingLotsWithAvailable: state.getAroundParkingLotsWithAvailable,
      aroundParkingLotWithAvailable: state.aroundParkingLotWithAvailable,
      filterMarker: state.filterMarker,
      setClickCoord: state.setClickCoord,
      setMapCenter: state.setMapCenter,
    };
  }, shallow);

  // -------------------------- States --------------------------
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

  // -------------------------- Actions --------------------------
  // 點擊地圖取得點擊地點座標。
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setActiveMarker(null);
      setShowParkingLotInfo(null);
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

  // ------------------------- useEffect -------------------------
  useEffect(() => {
    // 取得點擊地點坐標附近停車場資料
    if (parkingLots && clickCoord && allAvailable) {
      getAroundParkingLotsWithAvailable(parkingLots, clickCoord, allAvailable);
    }
  }, [parkingLots, clickCoord, allAvailable, getAroundParkingLotsWithAvailable]);

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
  // -------------------------- JSX --------------------------
  return (
    <div className="relative h-full w-full">
      {/* ----------Location Icon---------- */}
      <div className="absolute top-4 right-4 z-[1] transition delay-150 duration-300 hover:-translate-y-1">
        <IconBtn
          onClick={() => {
            mapRef.current?.panTo(userCenter!);
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
        {parkingIconState.map((info) => {
          return (
            <div
              key={info.name}
              className="mb-1 flex items-center opacity-0 transition-opacity delay-150 data-active:opacity-100"
              data-active={showInfoBox}
            >
              <FaParking size="1.5rem" color={info.color} />
              <div className="ml-1">{info.name}</div>
            </div>
          );
        })}
        {parkingType.map((item) => {
          return (
            <InfoItem
              key={item.name}
              data={item}
              haveDescribe
              showInfoBox={showInfoBox}
            />
          );
        })}
        <InfoItem
          data={{ name: '身障專用', color: 'text-primary' }}
          haveDescribe
          showInfoBox={showInfoBox}
        >
          <FaWheelchair />
        </InfoItem>
        <InfoItem
          data={{ name: '懷孕優先', color: 'text-pink-500' }}
          haveDescribe
          showInfoBox={showInfoBox}
        >
          <FaBabyCarriage />
        </InfoItem>
      </div>
      {/* ----------google map---------- */}
      <div className="h-full w-full">
        <GoogleMap
          center={mapCenter!} // 地圖中央座標
          zoom={15} // 地圖縮放大小，數字越大越近
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
          {filterMarker && <MarkerF position={filterMarker} />}
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
          {userCenter && showParkingLotInfo && (
            <div className=" absolute bottom-0 left-1/2 max-h-[40%] w-full -translate-x-1/2 overflow-y-scroll rounded-t-2xl p-1 md:top-0 md:left-0 md:max-h-full md:w-[30%] md:-translate-x-0">
              <ParkingInfo origin={userCenter} parkingLot={showParkingLotInfo} />
            </div>
          )}
        </GoogleMap>
      </div>
    </div>
  );
});

export default Map;
