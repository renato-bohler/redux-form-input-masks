import { ChangeEvent, FocusEvent } from "react";
import { EventHandler, EventWithDataHandler } from "redux-form";

declare namespace reduxFormInputMasks {
  interface numberMaskOptions {
    prefix?: string;
    suffix?: string;
    decimalPlaces?: number;
    multiplier?: number;
    stringValue?: boolean;
    allowEmpty?: boolean;
    allowNegative?: boolean;
    showPlusSign?: boolean;
    spaceAfterSign?: boolean;
    locale?: string;
    onChange?: (value: number | string) => void;
  }

  interface maskDefinition {
    regExp: RegExp;
    transform?: Function;
  }

  interface maskDefinitions {
    [key: string]: maskDefinition;
    [key: number]: maskDefinition;
  }

  interface textMaskOptions {
    pattern: string;
    placeholder?: string;
    maskDefinitions?: maskDefinitions;
    guide?: boolean;
    stripMask?: boolean;
    allowEmpty?: boolean;
    onChange?: (value: string) => void;
    onCompletePattern?: (value: string) => void;
  }

  interface numberMaskReturn {
    format: (storeValue: number | string) => string;
    normalize: (updatedValue: string, previousValue: number | string) => number | string;
    onChange: EventWithDataHandler<ChangeEvent<any>>;
    onFocus: EventHandler<FocusEvent<any>>;
    autoComplete: string,
  }

  interface textMaskReturn {
    format: (storeValue: string) => string;
    normalize: (updatedValue: string, previousValue: string) => string;
    onKeyDown: (event: Event) => void,
    onChange: EventWithDataHandler<ChangeEvent<any>>;
    onFocus: EventHandler<FocusEvent<any>>;
    onClick: (event: Event) => void,
    autoComplete: string,
  }

  function createNumberMask(options?: numberMaskOptions): numberMaskReturn;
  function createTextMask(options?: textMaskOptions): textMaskReturn;
}

export = reduxFormInputMasks;
