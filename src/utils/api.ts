import { bases } from './localData';
import { accessToken } from './constants';

// export const checkResponse = <T>(res: Response): Promise<T> => {
export const checkResponse = (res: Response): Promise<any> => {
  if (res.ok) {
    return res.json();
  } else {
    const error = res.json();
    throw new Error(`${error}`);
  }
};

export const getBaseNames = () => {
  const baseNames = bases.map((base) => base.name);
  return baseNames;
}

export const getBaseByName = (name: string) => {
  const base = bases.find((base) => base.name === name);
  return base;
}

export const getDistance = async (from: string, to: string) => {
  const res = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${from};${to}?access_token=${accessToken}`
  );
  return checkResponse(res);
};

export const convertCoordsToPlace = async (coord: string) => {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${coord}.json?access_token=${accessToken}`
  );
  return checkResponse(res);
};

export const convertPlaceToCoords = async (searchText: string) => {
  const res = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?country=RU&access_token=${accessToken}`
  );
  return checkResponse(res);
};

export const getSuggestedResult = async (searchText: string) => {
  const res = await fetch(
    `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${accessToken}`
  );
  return checkResponse(res);
};