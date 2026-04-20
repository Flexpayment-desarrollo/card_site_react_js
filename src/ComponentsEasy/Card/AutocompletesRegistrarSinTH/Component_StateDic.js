import React from "react";
import FormField from "layouts/applications/wizard/components/FormField";
import { useEffect } from "react";
import { Autocomplete } from "@mui/material";

export const Component_StateDic = (props) => {

    useEffect(() => {
    }, []);

    return (
        <Autocomplete
            id="ddlState"
            value={props.value}
            onChange={props.onChange}
            options={props.stateList}
            renderInput={(params) => (
                <FormField {...params}
                    required
                    error={props.error}
                    helperText={props.helperText}
                    label="Estado"
                    fullWidth
                    InputLabelProps={{ shrink: true }}
                    disabled={props.cumplimiento || props.disabled}
                />
            )}
        />
    )
}