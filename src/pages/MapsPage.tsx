import block from 'bem-cn';
import { MouseEvent, FormEvent, useState, useRef } from 'react';
import { Listbox } from '@headlessui/react';
import './MapsPage.scss';
import { getBaseByName, getBaseNames, getDistance } from '../utils/api';
import { BUTTON_TEXT_NORMAL, daDataApiKey } from '../utils/constants';

import ChevronIcon from '../images/icons/chevron/chevron.svg';
import ClearIcon from '../images/icons/clear/clear.svg';

import {
  AddressSuggestions,
  DaDataSuggestion,
  DaDataAddress,
} from 'react-dadata';
import { renderLoading } from '../utils/utils';
import { IButtonProps } from '../utils/types';

const cnStyles = block('page-container');

const baseNames = getBaseNames();

const MapsPage = () => {
  const [distance, setDistance] = useState(Number);

  const [selectedBase, setSelectedBase] = useState(baseNames[0]);

  const [buttonState, setButtonState] = useState<IButtonProps>({
    text: BUTTON_TEXT_NORMAL,
    disabled: false,
  });

  const [value, setValue] = useState<
    DaDataSuggestion<DaDataAddress> | undefined
  >();

  const suggestionsRef = useRef<AddressSuggestions>(null);

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const base = getBaseByName(selectedBase);
    const fromCoords = base?.coords.lng + ', ' + base?.coords.lat;
    const toCoords = value?.data.geo_lon + ', ' + value?.data.geo_lat;

    setButtonState(renderLoading(true));

    getDistance(fromCoords, toCoords)
      .then((data) => {
        const dist = Math.round(Number(data.routes[0].distance / 1000));
        setDistance(dist);
      })
      .catch((err) => console.log(err))
      .finally(() => {
        setButtonState(renderLoading(false));
      });
  };

  const clearInput = (event: MouseEvent<HTMLElement>) => {
    setValue(undefined);
    if (suggestionsRef.current) {
      suggestionsRef.current?.focus();
    }
  };

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
            ref={suggestionsRef}
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
        <p className={cnStyles('gps')}>
          Координаты:{' '}
          {value && `${value?.data.geo_lat}, ${value?.data.geo_lon}`}
        </p>
        <button
          type='submit'
          disabled={buttonState.disabled}
          className={cnStyles('submit-button')}
        >
          {buttonState.text}
        </button>
      </form>

      <p className={cnStyles('distance')}>
        Расстояние: <b>{distance}</b> км
      </p>
    </div>
  );
};

export default MapsPage;
