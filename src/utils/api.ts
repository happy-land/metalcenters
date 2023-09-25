import { bases } from './localData';

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

