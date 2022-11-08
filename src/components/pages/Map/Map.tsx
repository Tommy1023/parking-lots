/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import { GiAbstract103 } from 'react-icons/gi';
import shallow from 'zustand/shallow';
import useStore from '../../../store';
import CustomMarker from './components/CustomMarker';
import ParkingInfo from './components/ParkingInfo';
import { latlngToTwd97 } from '../../../helpers/coordTransHelper';
import { Park, AvailablePark } from '../../../types';

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
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  const [activeMarkerParkingLotInfo, setActiveMarkerParkingLotInfo] = useState<
    | (Park & {
        parkingAvailable?: AvailablePark | undefined;
      })
    | null
  >(null);

  // 使用 useRef 綁定 DOM 設定地圖存放位置
  const mapRef = useRef<google.maps.Map | null>(null);

  // 點擊地圖取得點擊地點座標，並使用 panTo 將地圖移動至點擊地點。
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setActiveMarker(null);
      setMapCenter({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  // infoWindow 開關，判斷被點擊的 marker
  const handleActiveMarker = (
    marker: string | null,
    ParkingLot: Park & {
      parkingAvailable?: AvailablePark | undefined;
    },
  ) => {
    if (marker !== activeMarker) {
      setActiveMarker(marker);
      setActiveMarkerParkingLotInfo(ParkingLot);
    }
  };

  // 取得點擊地點坐標附近停車場資料
  const aroundParkingLots: Array<Park> | undefined = parkingLots?.filter((parkingLot) => {
    const twd97MapCenter = latlngToTwd97(mapCenter.lat, mapCenter.lng);
    const top = twd97MapCenter.twd97x + 1000;
    const bottom = twd97MapCenter.twd97x - 1000;
    const left = twd97MapCenter.twd97y - 1000;
    const right = twd97MapCenter.twd97y + 1000;
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
    return <div className="h-full w-full text-2xl flex-center">Map Loading...</div>;
  }

  return (
    <div className="relative h-full w-full">
      {/* Location Icon */}
      <button
        className="absolute top-4 right-4 z-[1] rounded-full border-2 border-primary bg-light p-1 shadow-md shadow-slate-400"
        onClick={() => mapRef.current?.panTo(userCenter!)}
      >
        <GiAbstract103 size="1.6rem" color="blue" />
      </button>

      {/* google map */}
      <div className="h-full w-full">
        <GoogleMap
          center={userCenter!} // 地圖中央座標
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
        >
          <MarkerF position={userCenter!} />
          {aroundParkingLotWithAvailable?.map((parkingLot) => {
            return (
              <CustomMarker
                key={parkingLot.id}
                parkingLot={parkingLot}
                onSetActiveMarKer={setActiveMarker}
                onHandleActiveMarker={handleActiveMarker}
                onSetMapCenter={setMapCenter}
              />
            );
          })}
          {activeMarker && activeMarkerParkingLotInfo && (
            <div className=" absolute bottom-0 left-1/2 max-h-[40%] w-full -translate-x-1/2 overflow-y-scroll rounded-t-2xl p-1 md:top-0 md:left-0 md:max-h-full md:w-[30%] md:-translate-x-0">
              <ParkingInfo origin={userCenter!} parkingLot={activeMarkerParkingLotInfo} />
            </div>
          )}
        </GoogleMap>
      </div>
    </div>
  );
});

export default Map;
