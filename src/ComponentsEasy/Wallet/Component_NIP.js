import React, { useEffect, useRef, useState } from 'react';
import MDTypography from 'components/MDTypography';
import { Grid } from '@mui/material';

/*Componente para ingresar el NIP*/
export const Component_NIP = ({ keyDetect, enter, login, autofocus }) => {
    const refPin1 = useRef(null)
    const refPin2 = useRef(null)
    const refPin3 = useRef(null)
    const refPin4 = useRef(null)
    const [pinValue, setPinValue] = useState({ Pin1: "", Pin2: "", Pin3: "", Pin4: "" })

    useEffect(() => {
        if (autofocus === true) {
            refPin1.current?.focus();
        }
    }, [autofocus]);

    const handleKeyDetect = (event) => {
        const key = event.key
        const { name } = event.target
        if (key === "0" || key === "1" || key === "2" || key === "3" || key === "4" || key === "5" || key === "6" || key === "7" || key === "8" || key === "9") {

            const nextValue = {
                ...pinValue,
                [name]: key
            };
            setPinValue(nextValue);
            keyDetect(nextValue);


            switch (name) {
                case "Pin1":
                    refPin2.current.focus()
                    break;
                case "Pin2":
                    refPin3.current.focus()
                    break;
                case "Pin3":
                    refPin4.current.focus()
                    break;
            }
        } else {
            if (key === "Backspace") {
                switch (name) {
                    case "Pin2":
                        if (pinValue.Pin2 === "")
                            refPin1.current.focus()
                        break;
                    case "Pin3":
                        if (pinValue.Pin3 === "")
                            refPin2.current.focus()
                        break;
                    case "Pin4":
                        if (pinValue.Pin4 === "")
                            refPin3.current.focus()
                        break;
                }
                setPinValue({
                    ...pinValue,
                    [name]: ""
                })
            } else {
                if (key === "Enter" && login)
                    enter()
            }
        }
    }

    return (
        <>
            <Grid container spacing={3} p={2}>
                <Grid item xs={12} sm={12} style={{ textAlign: "center" }} mt={-1}>
                    <MDTypography variant="h5">Ingresa el NIP</MDTypography>
                </Grid>
                <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
                    <Grid container>
                        <Grid item xs={3} sm={3}>
                            <input
                                autoFocus={autofocus}
                                ref={refPin1}
                                value={pinValue.Pin1}
                                name="Pin1"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{ width: "40px", height: "45px", borderRadius: "5px", border: "1.5px solid lightGray", textAlign: "center", fontSize: "20px" }}
                                size='small'
                                inputProps={{ maxLength: 1 }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                        </Grid>
                        <Grid item xs={3} sm={3}>
                            <input
                                ref={refPin2}
                                value={pinValue.Pin2}
                                name="Pin2"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{ width: "40px", height: "45px", borderRadius: "5px", border: "1.5px solid lightGray", textAlign: "center", fontSize: "20px" }}
                                size='small'
                                inputProps={{ maxLength: 1 }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                        </Grid>
                        <Grid item xs={3} sm={3}>
                            <input
                                ref={refPin3}
                                value={pinValue.Pin3}
                                name="Pin3"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{ width: "40px", height: "45px", borderRadius: "5px", border: "1.5px solid lightGray", textAlign: "center", fontSize: "20px" }}
                                size='small'
                                inputProps={{ maxLength: 1 }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                        </Grid>
                        <Grid item xs={3} sm={3}>
                            <input
                                ref={refPin4}
                                value={pinValue.Pin4}
                                name="Pin4"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{ width: "40px", height: "45px", borderRadius: "5px", border: "1.5px solid lightGray", textAlign: "center", fontSize: "20px" }}
                                size='small'
                                inputProps={{ maxLength: 1 }}
                                type="text"
                                inputMode="numeric"
                                pattern="[0-9]*"
                                autoComplete="one-time-code"
                                autoCorrect="off"
                                spellCheck="false"
                            />
                        </Grid>
                    </Grid>
                </Grid>
            </Grid>
        </>
    );
};