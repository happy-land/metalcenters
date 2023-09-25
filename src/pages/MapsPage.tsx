import block from 'bem-cn';
import React, { MouseEvent, FormEvent, useEffect, useState } from 'react';
import { Listbox } from '@headlessui/react';
import ReactDOM from 'react-dom';
import './MapsPage.scss';
import { checkResponse, getBaseByName, getBaseNames } from '../utils/api';
import { useForm } from '../hooks/useForm';
import { accessToken, daDataApiKey } from '../utils/constants';

import ChevronIcon from '../images/icons/chevron/chevron.svg';
import ClearIcon from '../images/icons/clear/clear.svg';

import {
  AddressSuggestions,
  DaDataSuggestion,
  DaDataAddress,
} from 'react-dadata';

const cnStyles = block('page-container');

// const coordA = '37.448055,56.028075';
// const coordA = '37.467868,56.015721';
const coordA = '33.048633,68.964319';
// const coordB = '37.165734,56.422240';  // Рогачево
const coordB = '37.517532,56.342905'; // Дмитров

const baseNames = getBaseNames();

const MapsPage = () => {
  const [placeA, setPlaceA] = useState();
  const [placeB, setPlaceB] = useState();
  const [distance, setDistance] = useState(Number);

  const [selectedBase, setSelectedBase] = useState(baseNames[0]);

  const { values, handleChange } = useForm({
    from: '',
    to: '',
  });

  const [value, setValue] = useState<
    DaDataSuggestion<DaDataAddress> | undefined
  >();

  const convertCoordsToPlace = async (coord: string) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${coord}.json?access_token=${accessToken}`
    );
    return checkResponse(res);
  };

  const convertPlaceToCoords = async (searchText: string) => {
    const res = await fetch(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${searchText}.json?country=RU&access_token=${accessToken}`
    );
    return checkResponse(res);
  };

  const getDistance = async (from: string, to: string) => {
    const res = await fetch(
      `https://api.mapbox.com/directions/v5/mapbox/driving/${from};${to}?access_token=${accessToken}`
    );
    return checkResponse(res);
  };

  const getSuggestedResult = async (searchText: string) => {
    const res = await fetch(
      `https://api.mapbox.com/search/searchbox/v1/suggest?q=${searchText}&access_token=${accessToken}`
    );
    return checkResponse(res);
  };

  useEffect(() => {
    main();
  });

  async function main() {
    // convertCoordsToPlace(coordA).then((data) => {
    //   // console.log(data.features[0].place_name);
    //   setPlaceA(data.features[0].place_name);
    // });
    // convertCoordsToPlace(coordB).then((data) => {
    //   // console.log(data.features[0].place_name);
    //   setPlaceB(data.features[0].place_name);
    // });
    // getDistance(coordA, coordB).then((data) => {
    //   const dist = Math.round(Number(data.routes[0].distance / 1000));
    //   setDistance(dist);
    // });
  }
  useEffect(() => {
    const names = getBaseNames();
    console.log(names);
  }, []);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const base = getBaseByName(selectedBase);
    const fromCoords = base?.coords.lng + ', ' + base?.coords.lat;

    // поменяем местами широту и долготу
    // const coordsArr = values.to.split(',');
    // const toCoords = coordsArr[1].trim() + ', ' + coordsArr[0].trim();
    const toCoords = value?.data.geo_lon + ', ' + value?.data.geo_lat;

    // convertCoordsToPlace(toCoords).then((data) => {
    //   setPlaceB(data.features[0].place_name);
    // });

    getDistance(fromCoords, toCoords).then((data) => {
      const dist = Math.round(Number(data.routes[0].distance / 1000));
      setDistance(dist);
    });


    // Place -> Coords
    // const coords = convertPlaceToCoords(values.to);
    // console.log(coords);

    // Coords -> Place  56.422608, 37.166773
    // const place = convertCoordsToPlace(values.to);
    // console.log(place);

    // Get Suggested results
    // const result = getSuggestedResult(values.to);
    // console.log(result);
  };

  const clearInput = (event: MouseEvent<HTMLElement>) => {
    setValue(undefined);
  }

  return (
    <div className={cnStyles()}>
      <form className={cnStyles('form')} onSubmit={handleSubmit}>
        <label className={cnStyles('form-label')}>От металлобазы</label>
        <div className={cnStyles('listbox')}>
          <Listbox value={selectedBase} onChange={setSelectedBase}>
            <Listbox.Button className={cnStyles('listbox-button')}>
              {selectedBase}
              <img
                className={cnStyles('chevron-icon')}
                src={ChevronIcon}
                alt='ChevronIcon'
              />
            </Listbox.Button>
            <Listbox.Options className={cnStyles('listbox-options')}>
              {baseNames.map((name, index) => (
                <Listbox.Option
                  key={index}
                  value={name}
                  className={cnStyles('option prevent-select')}
                >
                  {name}
                </Listbox.Option>
              ))}
            </Listbox.Options>
          </Listbox>
        </div>
        <label className={cnStyles('form-label')}>До пункта назначения</label>
        <div className={cnStyles('input-wrapper')}>
          <AddressSuggestions
            token={daDataApiKey}
            value={value}
            onChange={setValue}
            inputProps={{ className: cnStyles('dadata-input') }}
            containerClassName={cnStyles('dadata-container')}
            suggestionsClassName={cnStyles('dadata-suggestions')}
            suggestionClassName={cnStyles('dadata-suggestion')}
          />
          <img
                className={cnStyles('clear-icon')}
                src={ClearIcon}
                alt='ClearIcon'
                onClick={clearInput}
              />
        </div>
        <p className={cnStyles('gps')}>Координаты: {value && `${value?.data.geo_lat}, ${value?.data.geo_lon}`} </p>
        <button type='submit' className={cnStyles('submit-button')}>
          Рассчитать
        </button>
      </form>

      

      <p className={cnStyles('distance')}>
        Расстояние: <b>{distance}</b> км
      </p>
    </div>
  );
};

export default MapsPage;
