/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  Marker,
  DistanceMatrixService,
} from '@react-google-maps/api';
import { GiAbstract103 } from 'react-icons/gi';

const Map = memo(() => {
  // 地圖要顯示的中心位置   // TODO 動態更新使用者坐標
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(
    {} as google.maps.LatLngLiteral,
  );
  const [clickedPlace, setClickedPlace] = useState<google.maps.LatLngLiteral>(
    {} as google.maps.LatLngLiteral,
  );
  const [getLocationStatus, setGetLocationStatus] = useState<string | null>(null);

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
      setClickedPlace({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  const getLocation = () => {
    if (!navigator.geolocation) {
      setGetLocationStatus('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };

  // TODO 取得點擊地點坐標後打api取得附近停車場資料
  // TODO 計算附近停車場與使用者距離

  useEffect(() => {
    getLocation();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }
  // eslint-disable-next-line no-alert
  if (getLocationStatus) alert(getLocationStatus);

  return (
    <div className="relative h-full w-full">
      {/* Location Icon */}
      <div className=" absolute bottom-5 right-2 z-[1]">
        <button
          className="rounded-full border-2 bg-gray-300 p-1 shadow-md shadow-slate-400"
          onClick={() => mapRef.current?.panTo(center)}
        >
          <GiAbstract103 size="2rem" />
        </button>
      </div>
      <div className="h-full w-full">
        <GoogleMap
          center={center} // 地圖中央座標
          zoom={15} // 地圖縮放大小，數字越大越近
          mapContainerStyle={{ width: '100%', height: '100%' }} // 地圖大小
          options={{
            // 預設為true
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
          }}
          onLoad={onLoad}
          onUnmount={onUnMount}
          onClick={onMapClick}
        >
          <Marker position={center} />
          {clickedPlace && <Marker position={clickedPlace} />}

          {/* 記算所在地與其他地點的距離 */}
          <DistanceMatrixService
            options={{
              destinations: [{ lat: 25.0360887107026, lng: 121.56299732925 }], // 上限25個
              origins: [center],
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={(response) => {
              console.log(response?.rows[0].elements[0].distance);
            }}
          />
        </GoogleMap>
      </div>
    </div>
  );
});

export default Map;
