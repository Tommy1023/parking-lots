import React, { memo, useRef } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import shallow from 'zustand/shallow';
import useStore from '../../../store';

const SearchBar = memo(() => {
  const { googleMap, setSearchMarker } = useStore((state) => {
    return {
      googleMap: state.googleMap,
      setSearchMarker: state.setSearchMarker,
    };
  }, shallow);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  return (
    <Autocomplete
      fields={['geometry.location']}
      onLoad={(autocomplete) => {
        autocompleteRef.current = autocomplete;
      }}
      onPlaceChanged={() => {
        if (autocompleteRef.current === null) {
          console.log('Autocomplete is not loaded yet!');
        } else {
          const place = autocompleteRef.current.getPlace();
          if (place?.geometry?.viewport && googleMap) {
            googleMap.fitBounds(place.geometry.viewport);
          }
          if (place?.geometry?.location && googleMap) {
            googleMap.setCenter(place.geometry.location);
            googleMap.setZoom(15);
            setSearchMarker({
              lat: place.geometry.location.lat(),
              lng: place.geometry.location.lng(),
            });
          }
        }
      }}
    >
      <input
        type="text"
        placeholder="輸入目的地"
        className="h-[50px] w-full rounded-md border-2 border-slate-400 p-2 shadow-lg"
      />
    </Autocomplete>
  );
});

export default SearchBar;
