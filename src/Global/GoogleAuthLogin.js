import React, { useEffect, useRef, useState } from 'react';
import MDTypography from 'components/MDTypography';
import { Grid } from '@mui/material';

/*Componente para mostrar el modal de confirmación*/
export const GoogleAuthLogin = ({ keyDetect, enter, login, autofocus }) => {
    const refPin1 = useRef(null)
    const refPin2 = useRef(null)
    const refPin3 = useRef(null)
    const refPin4 = useRef(null)
    const refPin5 = useRef(null)
    const refPin6 = useRef(null)
    const [pinValue, setPinValue] = useState({ Pin1: "", Pin2: "", Pin3: "", Pin4: "", Pin5: "", Pin6: "" });
    useEffect(() => {
        if (autofocus === true) {
            refPin1.current?.focus();
        }
    }, [autofocus]);

    const handleKeyDetect = (event) => {
        const key = event.key
        const { name } = event.target
        if (key === "0" || key === "1" || key === "2" || key === "3" || key === "4" || key === "5" || key === "6" || key === "7" || key === "8" || key === "9") {
            setPinValue({
                ...pinValue,
                [name]: key
            })
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
                case "Pin4":
                    refPin5.current.focus()
                    break;
                case "Pin5":
                    refPin6.current.focus()
                    break;
                case "Pin6":
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
                    case "Pin5":
                        if (pinValue.Pin5 === "")
                            refPin4.current.focus()
                        break;
                    case "Pin6":
                        if (pinValue.Pin6 === "")
                            refPin5.current.focus()
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
                    <MDTypography variant="h5">Ingresa el pin</MDTypography>
                </Grid>
                <Grid item xs={12} sm={12} style={{ textAlign: "center" }}>
                    <Grid container>
                        <Grid item xs={2} sm={2}>
                            <input
                                ref={refPin1}
                                value={pinValue.Pin1}
                                name="Pin1"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{
                                    width: "38px",
                                    height: "42px",
                                    borderRadius: "5px",
                                    border: "1.5px solid lightGray",
                                    textAlign: "center",
                                    fontSize: "20px"
                                }}
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
                        <Grid item xs={2} sm={2}>
                            <input
                                ref={refPin2}
                                value={pinValue.Pin2}
                                name="Pin2"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{
                                    width: "38px",
                                    height: "42px",
                                    borderRadius: "5px",
                                    border: "1.5px solid lightGray",
                                    textAlign: "center",
                                    fontSize: "20px"
                                }}
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
                        <Grid item xs={2} sm={2}>
                            <input
                                ref={refPin3}
                                value={pinValue.Pin3}
                                name="Pin3"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{
                                    width: "38px",
                                    height: "42px",
                                    borderRadius: "5px",
                                    border: "1.5px solid lightGray",
                                    textAlign: "center",
                                    fontSize: "20px"
                                }}
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
                        <Grid item xs={2} sm={2}>
                            <input
                                ref={refPin4}
                                value={pinValue.Pin4}
                                name="Pin4"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{
                                    width: "38px",
                                    height: "42px",
                                    borderRadius: "5px",
                                    border: "1.5px solid lightGray",
                                    textAlign: "center",
                                    fontSize: "20px"
                                }}
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
                        <Grid item xs={2} sm={2}>
                            <input
                                ref={refPin5}
                                value={pinValue.Pin5}
                                name="Pin5"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{
                                    width: "38px",
                                    height: "42px",
                                    borderRadius: "5px",
                                    border: "1.5px solid lightGray",
                                    textAlign: "center",
                                    fontSize: "20px"
                                }}
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
                        <Grid item xs={2} sm={2}>
                            <input
                                ref={refPin6}
                                value={pinValue.Pin6}
                                name="Pin6"
                                onKeyUp={() => keyDetect(pinValue)}
                                onKeyDown={handleKeyDetect}
                                style={{
                                    width: "38px",
                                    height: "42px",
                                    borderRadius: "5px",
                                    border: "1.5px solid lightGray",
                                    textAlign: "center",
                                    fontSize: "20px"
                                }}
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