/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { memo, useState, useEffect, useCallback, useRef } from 'react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';
import shallow from 'zustand/shallow';
import {
  FaInfoCircle,
  FaCrosshairs,
  FaSpinner,
  FaWheelchair,
  FaBabyCarriage,
} from 'react-icons/fa';
import useStore from '../../store/useMapStore';
import CustomMarker from '../../components/CustomMarker';
import ParkingInfo from '../../components/ParkingInfo';
import { Park, AvailablePark, ParkingLotsWithAvailable } from '../../types';
import IconBtn from '../../components/IconBtn';
import InfoItem from '../../components/InfoItem/InfoItem';
import parkingType from './parkingType.json';
import SearchBar from '../../components/SearchBar/SearchBar';
import { latlngToTwd97 } from '../../helpers/coordTransHelper';

type Libraries = ('drawing' | 'geometry' | 'localContext' | 'places')[];
const libraries: Libraries = ['places'];

const Map = memo(() => {
  // -------------------------- States --------------------------
  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_API_KEY!,
    libraries,
  });
  const {
    parkingLots,
    allAvailable,
    isGetPosition,
    getGeolocation,
    userCenter,
    mapCenter,
    setMapCenter,
    clickCoord,
    setClickCoord,
    searchMarker,
    filterMarker,
  } = useStore((state) => {
    return {
      parkingLots: state.parkingLots,
      allAvailable: state.allAvailable,
      isGetPosition: state.isGetPosition,
      getGeolocation: state.getGeolocation,
      userCenter: state.userCenter,
      mapCenter: state.mapCenter,
      setMapCenter: state.setMapCenter,
      clickCoord: state.clickCoord,
      setClickCoord: state.setClickCoord,
      searchMarker: state.searchMarker,
      filterMarker: state.filterMarker,
    };
  }, shallow);

  const [googleMap, setGoogleMap] = useState<google.maps.Map | null>(null);
  const defaultCenter = useRef<{ lat: number; lng: number }>({
    lat: 25.03369,
    lng: 121.564128,
  });
  const [aroundParkingLotWithAvailable, setAroundParkingLotWithAvailable] = useState<
    ParkingLotsWithAvailable[] | null
  >(null);
  const [showParkingLotInfo, setShowParkingLotInfo] = useState<
    | (Park & {
        parkingAvailable?: AvailablePark | undefined;
      })
    | null
  >(null);
  const [showInfoBox, setShowInfoBox] = useState<boolean>(false);

  // -------------------------- Actions --------------------------
  const getAroundParkingLotsWithAvailable = useCallback(
    (
      ParkingLots: Park[] | null,
      ClickCoord: google.maps.LatLngLiteral,
      AllAvailable: AvailablePark[] | null,
    ) => {
      if (!ParkingLots || !ClickCoord) return;
      // ????????????????????????
      const aroundParkingLots: Array<Park> = ParkingLots.filter((parkingLot) => {
        const twd97ClickCoord = latlngToTwd97(ClickCoord.lat, ClickCoord.lng);
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
      if (!aroundParkingLots) return;
      // ????????????????????????????????????
      const result: Array<Park> & {
        parkingAvailable?: AvailablePark;
      } = aroundParkingLots.map((parkingLot) => {
        const parkingAvailable = AllAvailable?.filter((available) => {
          return available.id === parkingLot.id;
        });
        if (parkingAvailable)
          return { ...parkingLot, parkingAvailable: parkingAvailable?.[0] };
        return parkingLot;
      });
      setAroundParkingLotWithAvailable(result);
    },
    [],
  );

  // ???????????????????????????????????????
  const onMapClick = (e: google.maps.MapMouseEvent) => {
    if (e.latLng) {
      setShowParkingLotInfo(null);
      setClickCoord({ lat: e.latLng.lat(), lng: e.latLng.lng() });
    }
  };

  // Parking InfoWindow ??????????????????????????? marker
  const handleActiveMarker = useCallback(
    (
      markerId: string | null,
      parkingLot: Park & {
        parkingAvailable?: AvailablePark | undefined;
      },
    ) => {
      if (markerId !== showParkingLotInfo?.id) {
        setShowParkingLotInfo(parkingLot);
      } else {
        setShowParkingLotInfo(null);
      }
    },
    [showParkingLotInfo?.id],
  );

  // ------------------------- useEffect -------------------------
  useEffect(() => {
    // ?????????????????????????????????????????????
    if (parkingLots && clickCoord && allAvailable) {
      getAroundParkingLotsWithAvailable(parkingLots, clickCoord, allAvailable);
    }
  }, [parkingLots, clickCoord, allAvailable, getAroundParkingLotsWithAvailable]);

  useEffect(() => {
    if (userCenter === null) getGeolocation();
  }, [getGeolocation, userCenter]);

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
      <div className="absolute top-4 right-4 z-[1] flex flex-row-reverse">
        <div className="ml-2">
          {/* ----------Location Icon---------- */}
          <div className="mt-2 transition delay-150 duration-300 hover:-translate-y-1">
            <IconBtn
              onClick={() => {
                if (userCenter) {
                  googleMap?.panTo(userCenter);
                } else {
                  googleMap?.panTo(defaultCenter.current);
                }
              }}
            >
              <FaCrosshairs size="1.6rem" color="blue" />
            </IconBtn>
          </div>
          {/* ----------InfoBox Icon---------- */}
          <div className="relative">
            <div className=" mt-2 transition delay-150 duration-300 hover:-translate-y-1">
              <IconBtn onClick={() => setShowInfoBox((pre) => !pre)}>
                <FaInfoCircle size="1.6rem" color="blue" />
              </IconBtn>
            </div>
            {/* ----------InfoBox---------- */}
            <div
              className=" absolute right-0 top-10 hidden h-60 w-36 origin-top scale-y-0 flex-col rounded-md border-2 border-slate-400 bg-light px-3 py-2 shadow-md shadow-slate-400  transition-transform data-active:flex data-active:scale-100 data-active:delay-150"
              data-active={showInfoBox}
            >
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
                data={{ name: '????????????', color: 'text-primary' }}
                haveDescribe
                showInfoBox={showInfoBox}
              >
                <FaWheelchair />
              </InfoItem>
              <InfoItem
                data={{ name: '????????????', color: 'text-pink-500' }}
                haveDescribe
                showInfoBox={showInfoBox}
              >
                <FaBabyCarriage />
              </InfoItem>
            </div>
          </div>
        </div>
      </div>
      {/* ----------Position Loading---------- */}
      {isGetPosition && (
        <div className=" absolute bottom-3 left-1/2 z-[1] -translate-x-1/2 text-2xl flex-center">
          <div className="animate-spin p-2 text-primary">
            <FaSpinner />
          </div>
          <p className=" animate-bounce text-primary">?????????...</p>
        </div>
      )}
      {/* ----------google map---------- */}
      <div className="h-full w-full">
        <GoogleMap
          center={mapCenter || defaultCenter.current} // ??????????????????
          zoom={15} // ???????????????????????????????????????
          mapContainerStyle={{ width: '100%', height: '100%' }} // ????????????
          options={{
            // ?????????true
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
            zoomControl: false,
          }}
          onLoad={(map: google.maps.Map): void => {
            setGoogleMap(map);
          }}
          onUnmount={(): void => {
            setGoogleMap(null);
          }}
          onClick={onMapClick}
          onDragEnd={() => {
            const latlng: google.maps.LatLng | undefined = googleMap?.getCenter();
            if (latlng) {
              // ?????? rerender ???????????????????????????
              setMapCenter({ lat: latlng?.lat(), lng: latlng.lng() });
              // drag ???????????????????????????
              setClickCoord({ lat: latlng?.lat(), lng: latlng.lng() });
            }
          }}
        >
          {/* ----------SearchBar---------- */}
          <div
            className="absolute top-3 left-[50%] w-[70%] -translate-x-[50%] md:w-[50%] md:data-active:left-[60%]"
            data-active={!!showParkingLotInfo}
          >
            <SearchBar map={googleMap} />
          </div>
          {/* ----------Markers---------- */}
          {userCenter && <MarkerF position={userCenter} />}
          {filterMarker && <MarkerF position={filterMarker} />}
          {searchMarker && <MarkerF position={searchMarker} />}
          {aroundParkingLotWithAvailable?.map((parkingLot) => {
            if (
              parkingLot.parkingAvailable &&
              parkingLot.parkingAvailable.availablecar > 0
            ) {
              return (
                <CustomMarker
                  key={parkingLot.id}
                  parkingLot={parkingLot}
                  onHandleActiveMarker={handleActiveMarker}
                />
              );
            }
            return null;
          })}
          {/* ----------ParkingInfo---------- */}
          {showParkingLotInfo !== null && (
            <div className=" absolute bottom-0 left-1/2 max-h-[40%] w-full -translate-x-1/2 overflow-y-scroll rounded-t-2xl p-1 md:top-0 md:left-0 md:max-h-full md:w-[30%] md:-translate-x-0 md:overflow-auto">
              <ParkingInfo origin={userCenter} parkingLot={showParkingLotInfo} />
            </div>
          )}
        </GoogleMap>
      </div>
    </div>
  );
});

export default Map;
