import React from "react";
import FormField from "layouts/applications/wizard/components/FormField";
import { useEffect } from "react";
import { Autocomplete } from "@mui/material";

export const Component_GenderType = (props) => {

    useEffect(() => {
    }, []);

    return (
        <Autocomplete
            value={props.value}
            id="IdGenero"
            options={props.genderType}
            onChange={props.onChange}
            renderInput={(params) => (
                <FormField {...params}
                    required
                    error={props.error}
                    helperText={props.helperText}
                    label="Genero"
                    InputLabelProps={{ shrink: true }} />
            )}
        />
    )
}