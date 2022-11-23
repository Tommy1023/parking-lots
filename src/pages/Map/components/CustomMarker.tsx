/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useRef, useCallback } from 'react';
import { MarkerF } from '@react-google-maps/api';
import { Park, AvailablePark } from '../../../types';
import { twd97ToLatlng } from '../../../helpers/coordTransHelper';

type CustomMarkerProp = {
  parkingLot: Park & { parkingAvailable?: AvailablePark | undefined };
  onHandleActiveMarker: (
    markerId: string | null,
    parkingLot: Park & {
      parkingAvailable?: AvailablePark | undefined;
    },
  ) => void;
};

const CustomMarker = ({ parkingLot, onHandleActiveMarker }: CustomMarkerProp) => {
  const { id, tw97x, tw97y, parkingAvailable } = parkingLot;
  const transPosition = useRef<google.maps.LatLngLiteral>(
    twd97ToLatlng(parseFloat(tw97x), parseFloat(tw97y)),
  );

  const markerColor = useCallback(() => {
    if (!parkingAvailable) return '';
    if (parkingAvailable.availablecar < 5 && parkingAvailable.availablecar > 0) {
      return '#FF6600'; // 停車格小於5
    }
    return '#bae6fd';
  }, [parkingAvailable]);

  return (
    <MarkerF
      icon={{
        path: 'M312.32,321.79,259.3,512l-59-190C135.87,299.21,89.68,237.87,89.68,165.77,89.68,74.26,164.16,0,256,0S422.32,74.26,422.32,165.77C422.32,237.59,376.46,298.75,312.32,321.79Z',
        fillColor: `${markerColor()}`,
        fillOpacity: 1,
        scale: 0.1,
        strokeColor: '#9CA38F',
        strokeWeight: 2,
        labelOrigin: new google.maps.Point(250, 165),
      }}
      label={`${parkingAvailable?.availablecar}`}
      position={transPosition.current}
      onClick={() => {
        onHandleActiveMarker(id, parkingLot);
      }}
    />
  );
};

export default memo(CustomMarker);
