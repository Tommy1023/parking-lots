/* eslint-disable @typescript-eslint/no-explicit-any */
import create from 'zustand';
import { fetchAllAvailable, fetchParkingLots } from '../service/parkingLotsApi';
import { State, Action } from '../types';

const initialize: State = {
  parkingLots: {},
  allAvailable: {},
  markers: [
    {
      id: 1,
      name: 'Chicago, Illinois',
      position: { lat: 25.02237162306461, lng: 121.56473224322148 },
    },
    {
      id: 2,
      name: 'Denver, Colorado',
      position: { lat: 25.027245076659042, lng: 121.56311988830566 },
    },
    {
      id: 3,
      name: 'Los Angeles, California',
      position: { lat: 25.02859361948257, lng: 121.57063879072666 },
    },
    {
      id: 4,
      name: 'New York, New York',
      position: { lat: 25.034653524901923, lng: 121.57235607504845 },
    },
  ],
};

const useStore = create<State & Action>((set) => {
  return {
    // initialize state
    ...initialize,
    // actions
    getParkingLots() {
      fetchParkingLots()
        .then((res) => {
          if (res.statusText === 'OK') set({ parkingLots: res.data.data.park });
        })
        .catch((err) => {
          console.log('getParkingLots error:', err);
        });
    },
    getAllAvailable() {
      fetchAllAvailable()
        .then((res) => {
          console.log('allAvailable res:', res);

          if (res.statusText === 'OK') set({ allAvailable: res.data.data.park });
        })
        .catch((err) => {
          console.log('getAllAvailable error:', err);
        });
    },
  };
});

export default useStore;
