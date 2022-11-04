/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  // DistanceMatrixService,
} from '@react-google-maps/api';
import { GiAbstract103 } from 'react-icons/gi';
import shallow from 'zustand/shallow';
import useStore from '../../../store';
import CustomMarker from './components/CustomMarker';

const Map = memo(() => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
  });
  const { parkingLots, userCenter, watchId } = useStore((state) => {
    return {
      parkingLots: state.parkingLots,
      userCenter: state.userCenter,
      watchId: state.watchId,
    };
  }, shallow);

  const [mapCenter, setMapCenter] = useState<google.maps.LatLngLiteral>(userCenter!);
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
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
  const handleActiveMarker = (marker: string | null) => {
    if (marker !== activeMarker) setActiveMarker(marker);
  };

  // TODO 取得點擊地點坐標後打api取得附近停車場資料
  // TODO 計算附近停車場與使用者距離

  useEffect(() => {
    return () => {
      if (watchId) {
        navigator.geolocation.clearWatch(watchId);
      }
    };
  });
  if (!isLoaded) {
    return <div className="h-full w-full text-2xl flex-center">Map Loading...</div>;
  }

  return (
    <div className="relative h-full w-full">
      {/* Location Icon */}
      <div className=" absolute bottom-5 right-2 z-[1]">
        <button
          className="rounded-full border-2 bg-gray-300 p-1 shadow-md shadow-slate-400"
          onClick={() => mapRef.current?.panTo(userCenter!)}
        >
          <GiAbstract103 size="2rem" />
        </button>
      </div>

      {/* google map */}
      <div className="h-full w-full">
        <GoogleMap
          center={mapCenter} // 地圖中央座標
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
          {parkingLots && (
            <CustomMarker
              parkingLots={parkingLots}
              activeMarker={activeMarker}
              onSetActiveMarKer={setActiveMarker}
              onHandleActiveMarker={handleActiveMarker}
              onSetMapCenter={setMapCenter}
            />
          )}
          {/* TODO 記算所在地與其他地點的距離 */}
          {/* <DistanceMatrixService
            options={{
              destinations: [{ lat: 25.0360887107026, lng: 121.56299732925 }], // 上限25個
              origins: [userCenter],
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={(response) => {
              console.log(response?.rows[0].elements[0].distance);
            }}
          /> */}
        </GoogleMap>
      </div>
    </div>
  );
});

export default Map;
