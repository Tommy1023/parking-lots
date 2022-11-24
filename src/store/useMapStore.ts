/* eslint-disable no-alert */
import create from 'zustand';
import { fetchAllAvailable, fetchParkingLots } from '../service/parkingLotsApi';
import { State, Action } from '../types';
import { twd97ToLatlng } from '../helpers/coordTransHelper';

const initialize: State = {
  isAppInitializedComplete: false,
  isLoading: false,
  isGetPosition: false,
  parkingLots: null,
  allAvailable: null,
  userCenter: null,
  mapCenter: null,
  clickCoord: { lat: 25.03369, lng: 121.564128 },
  filterMarker: null,
  searchMarker: null,
};

const useMapStore = create<State & Action>((set) => {
  return {
    // initialize state
    ...initialize,

    // actions
    async init() {
      console.log('App Initialized Start');
      set({ isAppInitializedComplete: false, isLoading: true });
      // 取得停車場資料
      try {
        const parkingLots = await fetchParkingLots();
        if (parkingLots.statusText === 'OK')
          set({ parkingLots: parkingLots.data.data.park });
      } catch (error) {
        console.log('getParkingLots error:', error);
        alert('無法取得停車場資訊，請稍後再試');
      }

      // 取得剩餘車位資料
      try {
        const allAvailable = await fetchAllAvailable();
        if (allAvailable.statusText === 'OK')
          set({ allAvailable: allAvailable.data.data.park });
      } catch (error) {
        console.log('getAllAvailable error:', error);
        alert('無法取得停車場資訊，請稍後再試');
      }
      set({ isAppInitializedComplete: true, isLoading: false });
      console.log('App Initialized Complete');
    },
    async getGeolocation() {
      // 確認 browser 是否有支援
      if (!navigator.geolocation) {
        // eslint-disable-next-line no-alert
        alert('您的瀏覽器不支援定位功能');
      } else {
        const permission = await navigator.permissions.query({ name: 'geolocation' });
        if (permission.state !== 'denied') {
          set({ isGetPosition: true });
          navigator.geolocation.getCurrentPosition(
            (position) => {
              const latlng = {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              };
              set({
                userCenter: latlng,
                mapCenter: latlng,
                clickCoord: latlng,
                isGetPosition: false,
              });
            },
            () => {
              alert('無法取得定位!');
              set({ isGetPosition: false });
            },
          );
        } else {
          alert('請開啟定位功能!');
        }
      }
    },
    updateAllAvailable() {
      fetchAllAvailable()
        .then((res) => {
          if (res.statusText === 'OK') set({ allAvailable: res.data.data.park });
        })
        .catch((err) => {
          console.log('updateAllAvailable error:', err);
        });
    },
    goToMap(tw97x, tw97y) {
      const latlng = twd97ToLatlng(parseFloat(tw97x), parseFloat(tw97y));
      set({
        mapCenter: latlng,
        filterMarker: latlng,
        clickCoord: latlng,
      });
    },
    setClickCoord(latlng) {
      set({ clickCoord: latlng });
    },
    setFilterMarker(latlng) {
      set({ filterMarker: latlng });
    },
    setMapCenter(latlng) {
      set({ mapCenter: latlng });
    },
    setSearchMarker(latlng) {
      set({ searchMarker: latlng, clickCoord: latlng });
    },
  };
});

export default useMapStore;
