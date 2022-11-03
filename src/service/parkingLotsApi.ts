import axios from 'axios';

export const fetchParkingLots = async () => {
  try {
    const res = await axios.get(
      'https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_alldesc.json',
    );
    return res;
  } catch (err) {
    console.log('fetchParkingLots:', err);
    return Promise.reject(err);
  }
};

export const fetchAllAvailable = async () => {
  try {
    const res = await axios.get(
      'https://tcgbusfs.blob.core.windows.net/blobtcmsv/TCMSV_allavailable.json',
    );
    return res;
  } catch (err) {
    console.log('fetchAllAvailable error:', err);
    return Promise.reject(err);
  }
};
