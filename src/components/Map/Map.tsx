/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState } from 'react';
import { GoogleMap, useJsApiLoader, Marker } from '@react-google-maps/api';
import { FaLocationArrow } from 'react-icons/fa';

const Map = memo(() => {
  // 地圖要顯示的中心位置   // TODO 動態更新使用者坐標
  const [center] = useState<google.maps.LatLngLiteral>({
    lat: 25.033816614731652,
    lng: 121.56470775604248,
  });
  const [clickedPlace, setClickedPlace] = useState<google.maps.LatLngLiteral>(
    {} as google.maps.LatLngLiteral,
  );
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
  });
  // 使用 useRef 綁定 DOM 設定地圖存放位置
  const mapRef = useRef<google.maps.Map | null>(null);

  const onLoad = (map: google.maps.Map): void => {
    mapRef.current = map;
  };

  const onUnMount = (): void => {
    mapRef.current = null;
  };
  // 點擊地圖取得點擊地點座標
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      console.log(`lat: ${e.latLng.lat()}, lng: ${e.latLng.lng()}`);
      setClickedPlace({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  // TODO 取得點擊地點坐標後打api取得附近停車場資料
  // TODO 計算附近停車場與使用者距離

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

  return (
    <div className="relative h-screen w-screen">
      <div className=" absolute bottom-1/4 right-3 z-[1]">
        <button
          className="rounded-full border-2 bg-gray-300 p-3 shadow-md shadow-slate-400"
          onClick={() => mapRef.current?.panTo(center)}
        >
          <FaLocationArrow />
        </button>
      </div>
      <div className="h-screen w-full">
        <GoogleMap
          center={center} // 地圖中央座標
          zoom={15} // 地圖縮放大小，數字越大越近
          mapContainerStyle={{ width: '100%', height: '100%' }} // 地圖大小
          options={{
            // 預設為true
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            // zoomControl: false,
          }}
          onLoad={onLoad}
          onUnmount={onUnMount}
          onClick={onMapClick}
        >
          <Marker position={center} />
          {clickedPlace && <Marker position={clickedPlace} />}
        </GoogleMap>
      </div>
    </div>
  );
});

export default Map;
