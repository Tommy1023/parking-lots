/* eslint-disable @typescript-eslint/no-explicit-any */
export type State = {
  isAppInitializedComplete: boolean;
  isLoading: boolean;
  parkingLots: Array<Park> | null;
  allAvailable: Array<AvailablePark> | null;
  userCenter: google.maps.LatLngLiteral | null;
  mapCenter: google.maps.LatLngLiteral | null;
  watchId: number | null;
};

export type Action = {
  init: () => void;
  updateParkingLots: () => void;
  updateAllAvailable: () => void;
};

export type Park = {
  id: string | null;
  area: string | null;
  name: string | null;
  type: string | null;
  type2: string | null;
  summary: string | null;
  address: string | null;
  tel: string | null;
  payex: string | null;
  serviceTime: string | null;
  tw97x: string | null;
  tw97y: string | null;
  totalcar: number | null;
  totalmotor: number | null;
  totalbike: number | null;
  totalbus: number | null;
  Pregnancy_First: string | null;
  Handicap_First: string | null;
  Taxi_OneHR_Free: string | null;
  AED_Equipment: string | null;
  CellSignal_Enhancement: string | null;
  Accessibility_Elevator: string | null;
  Phone_Charge: string | null;
  Child_Pickup_Area: string | null;
  FareInfo: {
    WorkingDay: [
      {
        Period: string | null;
        Fare: string | null;
      },
    ];
    Holiday: [
      {
        Period: string | null;
        Fare: string | null;
      },
    ];
  };
  EntranceCoord: {
    EntrancecoordInfo: [
      {
        Xcod: string | null;
        Ycod: string | null;
        Address: string | null;
      },
    ];
  };
};

export type AvailablePark = {
  id: number;
  availablecar: number;
  availablemotor: number;
  availablebus: number;
  ChargeStation: object;
};

export type ScoketStatusList = {
  spot_abrv: string;
  spot_status: string;
};
