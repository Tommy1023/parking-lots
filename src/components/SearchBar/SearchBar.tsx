import React, { memo, useRef, useState } from 'react';
import { Autocomplete } from '@react-google-maps/api';
import { FaBackspace } from 'react-icons/fa';
import shallow from 'zustand/shallow';
import useStore from '../../store';

const SearchBar = memo(() => {
  const { googleMap, setSearchMarker } = useStore((state) => {
    return {
      googleMap: state.googleMap,
      setSearchMarker: state.setSearchMarker,
    };
  }, shallow);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);
  const [hiddenIcon, setHiddenIcon] = useState<boolean>(true);
  const [inputValue, setInputValue] = useState<string>('');

  return (
    <div className="relative">
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
              setHiddenIcon(false);
            }
          }
        }}
      >
        <input
          type="text"
          value={inputValue}
          onChange={(e) => {
            setInputValue(e.target.value);
          }}
          placeholder="輸入目的地"
          className="h-[50px] w-full rounded-full border-2 border-slate-400 py-2 px-5 shadow-lg"
        />
      </Autocomplete>
      <button
        onClick={() => {
          setHiddenIcon(true);
          setInputValue('');
        }}
        className="absolute top-3 right-8 data-active:hidden"
        data-active={hiddenIcon}
      >
        <FaBackspace size="1.6rem" color="#666666" />
      </button>
    </div>
  );
});

export default SearchBar;
