import React, { useState } from 'react';
import { Maaa } from './Maaa';
import { tryConvert, toCelsius, toFahrenheit } from '@components/a/tryConvert';
import { BoilingVerdict } from './BoilingVerdict';




export function MParent() {

    const [temps, setTemp] = useState({ temp: '', scale: '' })

    const handleC = (e) => {
        setTemp({ scale: 'c', temp: e })
    }

    const handleF = (e) => {
        setTemp({ scale: 'f', temp: e })
    }

    const scale = temps.scale
    const temp = temps.temp


    const celsius = scale === 'f' ? tryConvert(temp, toCelsius) : temp;
    const fahrenheit = scale === 'c' ? tryConvert(temp, toFahrenheit) : temp;


    return (
        <div>
            <Maaa scale="c" temp={celsius} onTempChange={handleC} />
            <Maaa scale="f" temp={fahrenheit} onTempChange={handleF} />
            <BoilingVerdict celsius={parseFloat(celsius)} />
        </div>
    )


}