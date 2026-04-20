import React from "react";
import FormField from "layouts/applications/wizard/components/FormField";
import { useEffect } from "react";
import { Autocomplete } from "@mui/material";

export const Component_IdentificationDic = (props) => {

    useEffect(() => {
    }, []);

    return (
        <Autocomplete
            value={props.value}
            id="IdTipoIdentificacion"
            options={props.identificationType}
            onChange={props.onChange}
            renderInput={(params) => (
                <FormField {...params}
                    required
                    error={props.error}
                    helperText={props.helperText}
                    label="Identificación"
                    InputLabelProps={{ shrink: true }}
                    disabled={props.cumplimiento}
                />
            )}
        />
    )
}

