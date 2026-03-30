import React from 'react'
import FormField from "layouts/applications/wizard/components/FormField";
import { Autocomplete } from '@mui/material'

export const SelectClient = ({ defaultClient, onChange, clientes }) => {
    return (
        <Autocomplete
            fullWidth
            id="IdCliente"
            onChange={onChange}
            options={clientes}
            required
            value={defaultClient}
            // sx={{ width: 400 }}
            renderInput={(params) => (
                <FormField {...params} fullWidth label="Empresa" InputLabelProps={{ shrink: true }} />
            )}
        />
    )
}