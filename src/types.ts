/* eslint-disable @typescript-eslint/no-explicit-any */
export type State = {
  parkingLots: any;
  allAvailable: any;
  markers: Array<Markers>;
};

export type Action = {
  getParkingLots: () => void;
  getAllAvailable: () => void;
};

export type Markers = {
  id: number;
  name: string;
  position: google.maps.LatLngLiteral;
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
