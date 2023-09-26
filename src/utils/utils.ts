import { BUTTON_TEXT_LOADING, BUTTON_TEXT_NORMAL } from './constants';
import { IButtonProps } from './types';

export const renderLoading = (isLoading: boolean): IButtonProps => {
  if (isLoading) {
    return {
        text: BUTTON_TEXT_LOADING,
        disabled: true,
    }
  } else {
    return {
        text: BUTTON_TEXT_NORMAL,
        disabled: false,
    }
  }
};
