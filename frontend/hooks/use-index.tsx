import React, {ChangeEvent, useState } from 'react'

const useInput = (validateValue: (val: any ) => boolean, initialValue: string | number) => {
  const [enteredValue, setEnteredValue] = useState(initialValue)
  const [isTouched, setIsTouched] = useState(false)

    const valueIsValid = validateValue(enteredValue);
    const hasError = !valueIsValid && isTouched;

    const valueChangeHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setEnteredValue(event.target.value);
    }

    const inputBlurHandler = (event: ChangeEvent<HTMLInputElement>) => {
        setIsTouched(true)
    }

    const reset = () => {
        setEnteredValue('')
        setIsTouched(false)
    }

    return {
        value: enteredValue,
        isValid: valueIsValid,
        hasError,
        valueChangeHandler,
        inputBlurHandler,
        reset,
    }
}

export default useInput