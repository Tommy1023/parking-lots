/* eslint-disable no-alert */
/* eslint-disable @typescript-eslint/no-explicit-any */
import create from 'zustand';
import { fetchAllAvailable, fetchParkingLots } from '../service/parkingLotsApi';
import { State, Action } from '../types';

const initialize: State = {
  isAppInitializedComplete: false,
  isLoading: false,
  parkingLots: [],
  allAvailable: [],
  userCenter: null,
  mapCenter: null,
  watchId: null,
};

const useStore = create<State & Action>((set) => {
  return {
    // initialize state
    ...initialize,

    // actions
    async init() {
      // 取得使用者定位
      try {
        // 確認 browser 是否有支援
        if (!navigator.geolocation) {
          alert('Geolocation is not supported by your browser');
        } else {
          const watchId = navigator.geolocation.watchPosition((position) => {
            set({
              userCenter: {
                lat: position.coords.latitude,
                lng: position.coords.longitude,
              },
              watchId,
            });
          });
        }
      } catch (error) {
        console.log('getLocation error:', error);
      }

      // 取得停車場資料
      try {
        const parkingLots = await fetchParkingLots();
        if (parkingLots.statusText === 'OK')
          set({ parkingLots: parkingLots.data.data.park });
      } catch (error) {
        console.log('getParkingLots error:', error);
      }

      // 取得剩餘車位資料
      try {
        const allAvailable = await fetchAllAvailable();
        if (allAvailable.statusText === 'OK')
          set({ allAvailable: allAvailable.data.data.park });
      } catch (error) {
        console.log('getAllAvailable error:', error);
      }
      setTimeout(() => {
        set({ isAppInitializedComplete: true });
      }, 5000);
    },
    updateParkingLots() {
      set({ isLoading: true });
      fetchParkingLots()
        .then((res) => {
          if (res.statusText === 'OK') set({ parkingLots: res.data.data.park });
        })
        .catch((err) => {
          console.log('updateParkingLots error:', err);
        })
        .finally(() => {
          set({ isLoading: false });
        });
    },
    updateAllAvailable() {
      set({ isLoading: true });
      fetchAllAvailable()
        .then((res) => {
          if (res.statusText === 'OK') set({ allAvailable: res.data.data.park });
        })
        .catch((err) => {
          console.log('updateAllAvailable error:', err);
        })
        .finally(() => {
          set({ isLoading: false });
        });
    },
  };
});

export default useStore;
