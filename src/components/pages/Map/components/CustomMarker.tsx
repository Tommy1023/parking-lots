/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useState, useCallback } from 'react';
import { MarkerF, InfoWindowF, DistanceMatrixService } from '@react-google-maps/api';
import { Park, AvailablePark, DistanceAndDuration } from '../../../../types';
import { twd97ToLatlng } from '../../../../helpers/coordTransHelper';
import ParkingInfo from './ParkingInfo';

const CustomMarker = ({
  userCenter,
  parkingLot,
  activeMarker,
  onSetActiveMarKer,
  onHandleActiveMarker,
  onSetMapCenter,
}: {
  userCenter: google.maps.LatLngLiteral | null;
  parkingLot: Park & { parkingAvailable?: AvailablePark | undefined };
  activeMarker: string | null;
  onSetActiveMarKer: (id: string | null) => void;
  onHandleActiveMarker: (id: string | null) => void;
  onSetMapCenter: ({ lat, lng }: { lat: number; lng: number }) => void;
}) => {
  const { id, tw97x, tw97y, parkingAvailable } = parkingLot;
  const numTw97x = useRef<number>(parseFloat(tw97x!));
  const numTw97y = useRef<number>(parseFloat(tw97y!));
  const transPosition = useRef<google.maps.LatLngLiteral>(
    twd97ToLatlng(numTw97x.current, numTw97y.current),
  );
  const [distanceAndDuration, setDistanceAndDuration] =
    useState<DistanceAndDuration | null>(null);

  const markerColor = useCallback(() => {
    if (!parkingAvailable || parkingAvailable.availablecar < 0) return '#9fc6f5'; // 無法提供資料
    if (parkingAvailable.availablecar < 5 && parkingAvailable.availablecar > 0)
      return '#FF6600'; // 停車格小於5
    if (parkingAvailable.availablecar === 0) return '#777777';
    return 'blue';
  }, [parkingAvailable]);

  return (
    <MarkerF
      key={id}
      icon={{
        path: 'M64 32C28.7 32 0 60.7 0 96V416c0 35.3 28.7 64 64 64H384c35.3 0 64-28.7 64-64V96c0-35.3-28.7-64-64-64H64zM192 256h48c17.7 0 32-14.3 32-32s-14.3-32-32-32H192v64zm48 64H192v32c0 17.7-14.3 32-32 32s-32-14.3-32-32V288 168c0-22.1 17.9-40 40-40h72c53 0 96 43 96 96s-43 96-96 96z',
        fillColor: `${markerColor()}`,
        fillOpacity: 0.9,
        scale: 0.07,
        // strokeColor: 'blue',
        strokeWeight: 1,
      }}
      position={transPosition.current}
      onClick={() => {
        onHandleActiveMarker(id);
        onSetMapCenter(transPosition.current);
      }}
    >
      {activeMarker === id && (
        <>
          <InfoWindowF
            position={transPosition.current}
            onCloseClick={() => onSetActiveMarKer(null)}
          >
            <ParkingInfo
              parkingLot={parkingLot}
              origin={userCenter!}
              distanceAndDuration={distanceAndDuration}
            />
          </InfoWindowF>
          {/* 記算所在地與目的地的距離與行車時間 */}
          <DistanceMatrixService
            options={{
              destinations: [transPosition.current], // 上限25個
              origins: [userCenter!],
              travelMode: google.maps.TravelMode.DRIVING,
            }}
            callback={(response) => {
              if (response) setDistanceAndDuration(response?.rows[0].elements[0]);
            }}
          />
        </>
      )}
    </MarkerF>
  );
};

export default memo(CustomMarker);
