/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState, useEffect } from 'react';
import {
  GoogleMap,
  useJsApiLoader,
  MarkerF,
  // DistanceMatrixService,
} from '@react-google-maps/api';
import { GiAbstract103 } from 'react-icons/gi';
import useStore from '../../../store';
import CustomMarker from './components/CustomMarker';

const Map = memo(() => {
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
  });
  const { parkingLots } = useStore((state) => {
    return {
      markers: state.markers,
      parkingLots: state.parkingLots,
    };
  });
  // 地圖要顯示的中心位置
  const [center, setCenter] = useState<google.maps.LatLngLiteral>(
    {} as google.maps.LatLngLiteral,
  );
  const [activeMarker, setActiveMarker] = useState<string | null>(null);
  // 使用 useRef 綁定 DOM 設定地圖存放位置
  const mapRef = useRef<google.maps.Map | null>(null);

  // 點擊地圖取得點擊地點座標，並使用 panTo 將地圖移動至點擊地點。
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setActiveMarker(null);
      mapRef.current?.panTo({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };
  // 取得使用者坐標
  const getLocation = () => {
    if (!navigator.geolocation) {
      // eslint-disable-next-line no-alert
      alert('Geolocation is not supported by your browser');
    } else {
      navigator.geolocation.getCurrentPosition((position) => {
        setCenter({
          lat: position.coords.latitude,
          lng: position.coords.longitude,
        });
      });
    }
  };
  // infoWindow 開關，判斷被點擊的 marker
  const handleActiveMarker = (marker: string) => {
    if (marker !== activeMarker) setActiveMarker(marker);
  };

  // TODO 取得點擊地點坐標後打api取得附近停車場資料
  // TODO 計算附近停車場與使用者距離
  // TODO 動態更新使用者坐標

  useEffect(() => {
    getLocation();
  }, []);

  if (!isLoaded) {
    return <div>Loading...</div>;
  }

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

      {/* google map */}
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
          onLoad={(map: google.maps.Map): void => {
            mapRef.current = map;
          }}
          onUnmount={(): void => {
            mapRef.current = null;
          }}
          onClick={onMapClick}
        >
          <MarkerF position={center} />
          <CustomMarker
            parkingLots={parkingLots}
            activeMarker={activeMarker}
            onSetActiveMarKer={setActiveMarker}
            onHandleActiveMarker={handleActiveMarker}
          />
          {/* TODO 記算所在地與其他地點的距離 */}
          {/* <DistanceMatrixService
            options={{
              destinations: [{ lat: 25.0360887107026, lng: 121.56299732925 }], // 上限25個
              origins: [center],
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
