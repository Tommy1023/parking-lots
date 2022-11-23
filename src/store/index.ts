/* eslint-disable no-alert */
import create from 'zustand';
import { fetchAllAvailable, fetchParkingLots } from '../service/parkingLotsApi';
import { State, Action, Park, AvailablePark } from '../types';
import { latlngToTwd97, twd97ToLatlng } from '../helpers/coordTransHelper';

const initialize: State = {
  isAppInitializedComplete: false,
  isLoading: false,
  isGetPosition: false,
  googleMap: null,
  parkingLots: [],
  allAvailable: [],
  userCenter: null,
  mapCenter: null,
  clickCoord: { lat: 25.03369, lng: 121.564128 },
  filterMarker: null,
  aroundParkingLotWithAvailable: [],
  parkingLotsWithAvailable: [],
  area: '',
  keywords: '',
  searchMarker: null,
};

const useStore = create<State & Action>((set) => {
  return {
    // initialize state
    ...initialize,

    // actions
    async init() {
      console.log('App Initialized Start');
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
      set({ isAppInitializedComplete: true });
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
    updateParkingLots() {
      fetchParkingLots()
        .then((res) => {
          if (res.statusText === 'OK') set({ parkingLots: res.data.data.park });
        })
        .catch((err) => {
          console.log('updateParkingLots error:', err);
        });
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
    getAroundParkingLotsWithAvailable(parkingLots, clickCoord, allAvailable) {
      if (!parkingLots || !clickCoord) return;
      // 篩選範圍內停車場
      const aroundParkingLots: Array<Park> = parkingLots.filter((parkingLot) => {
        const twd97ClickCoord = latlngToTwd97(clickCoord.lat, clickCoord.lng);
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
      // 合併停車場及剩餘車位資料
      const aroundParkingLotWithAvailable: Array<Park> & {
        parkingAvailable?: AvailablePark;
      } = aroundParkingLots.map((parkingLot) => {
        const parkingAvailable = allAvailable?.filter((available) => {
          return available.id === parkingLot.id;
        });
        if (parkingAvailable)
          return { ...parkingLot, parkingAvailable: parkingAvailable?.[0] };
        return parkingLot;
      });
      set({ aroundParkingLotWithAvailable });
    },
    getParkingLotsWithAvailable(parkingLots, allAvailable) {
      if (!parkingLots || !allAvailable) return;
      const result = parkingLots.map((parkingLot) => {
        const parkingAvailable = allAvailable?.filter((available) => {
          return available.id === parkingLot.id;
        });
        return { ...parkingLot, parkingAvailable: parkingAvailable?.[0] };
      });
      // eslint-disable-next-line consistent-return
      set({ parkingLotsWithAvailable: result });
    },
    goToMap(tw97x, tw97y, parkingAvailable) {
      const latlng = twd97ToLatlng(parseFloat(tw97x), parseFloat(tw97y));
      set({
        mapCenter: latlng,
        filterMarker: latlng,
        clickCoord: latlng,
        aroundParkingLotWithAvailable: parkingAvailable,
      });
    },
    setGoogleMap(map) {
      set({ googleMap: map });
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
    setArea(area) {
      set({ area });
    },
    setKeywords(keywords) {
      set({ keywords });
    },
    setSearchMarker(latlng) {
      set({ searchMarker: latlng, clickCoord: latlng });
    },
  };
});

export default useStore;
