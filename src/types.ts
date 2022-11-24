/* eslint-disable @typescript-eslint/no-explicit-any */
export type State = {
  isAppInitializedComplete: boolean;
  isLoading: boolean;
  isGetPosition: boolean;
  parkingLots: Array<Park> | null;
  allAvailable: Array<AvailablePark> | null;
  userCenter: google.maps.LatLngLiteral | null;
  mapCenter: google.maps.LatLngLiteral | null;
  clickCoord: google.maps.LatLngLiteral | null;
  filterMarker: google.maps.LatLngLiteral | null;
  searchMarker: google.maps.LatLngLiteral | null;
};

export type ParkingLotsWithAvailable = Park & {
  parkingAvailable?: AvailablePark;
};

export type Action = {
  init: () => void;
  getGeolocation: () => void;
  updateAllAvailable: () => void;
  goToMap: (tw97x: string, tw97y: string) => void;
  setClickCoord: (latlng: google.maps.LatLngLiteral | null) => void;
  setFilterMarker: (latlng: google.maps.LatLngLiteral | null) => void;
  setMapCenter: (latlng: google.maps.LatLngLiteral | null) => void;
  setSearchMarker: (latlng: google.maps.LatLngLiteral | null) => void;
};

export type Park = {
  id: string;
  area: string;
  name: string;
  type: string;
  type2: string;
  summary: string;
  address: string;
  tel: string;
  payex: string;
  serviceTime: string;
  tw97x: string;
  tw97y: string;
  totalcar: number;
  totalmotor: number;
  totalbike: number;
  totalbus: number;
  Pregnancy_First: string;
  Handicap_First: string;
  Taxi_OneHR_Free: string;
  AED_Equipment: string;
  CellSignal_Enhancement: string;
  Accessibility_Elevator: string;
  Phone_Charge: string;
  Child_Pickup_Area: string;
  FareInfo: {
    WorkingDay: [
      {
        Period: string;
        Fare: string;
      },
    ];
    Holiday: [
      {
        Period: string;
        Fare: string;
      },
    ];
  };
  EntranceCoord: {
    EntrancecoordInfo: [
      {
        Xcod: string;
        Ycod: string;
        Address: string;
      },
    ];
  };
};

export type AvailablePark = {
  id: string;
  availablecar: number;
  availablemotor: number;
  availablebus: number;
  ChargeStation: ChargeStation;
};
export type ChargeStation = {
  scoketStatusList: Array<ScoketStatusList>;
};
export type ScoketStatusList = {
  spot_abrv: string;
  spot_status: string;
};
