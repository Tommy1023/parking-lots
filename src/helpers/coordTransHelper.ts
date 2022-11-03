import proj4 from 'proj4';

type Twd97 = {
  twd97x: number;
  twd97y: number;
};
proj4.defs([
  [
    'WGS84', //  EPSG:4326
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
  ],
  [
    'TWD97', // EPSG:3826
    '+proj=tmerc +lat_0=0 +lon_0=121 +k=0.9999 +x_0=250000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  ],
]);

export const twd97ToLatlng = (
  twd97x: number,
  twd97y: number,
): google.maps.LatLngLiteral => {
  const newCoord = proj4('TWD97', 'WGS84').forward([twd97x, twd97y]);
  const coordTrans: google.maps.LatLngLiteral = {
    lat: newCoord[1],
    lng: newCoord[0],
  };
  return coordTrans;
};

export const latlngToTwd97 = (lat: number, lng: number): Twd97 => {
  const newCoord = proj4('WGS84', 'TWD97').forward([lng, lat]);
  const coordTrans: Twd97 = {
    twd97x: newCoord[0],
    twd97y: newCoord[1],
  };
  return coordTrans;
};
