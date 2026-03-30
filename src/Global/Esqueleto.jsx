const genericAutocomplete = [
  { label: '', id: 0 }
];

var rows = [];
         result.forEach(data => {
            let jsonData = {
               id: data.id,
               label: data.nombre,
            };
            rows.push(jsonData);
         });
         setUser(rows);


         const handleChangeSelect = (event, newValue) => {
          let name = event.target.id.split("-")[0];
          switch (name) {
            case "codigoRegimenFiscal":
              setDefaultRegimenFiscal(newValue)
              break;
            case "UsoCFDI":
              setDefaultUsoCFDI(newValue)
              break;
          }
      
          if (name === "")
            return;
      
          setFormData({
            ...formData,
            [name]: newValue.id
          });
        };

<BaseLayout>
        <MDBox mt={4} mb={4}>
          <Grid container p={3} display="flex">
            <Grid item xs={1} sm={1} mr={-2}>
              <Tooltip title="Regresar">
                <IconButton onClick={() => navigate('/OrderCard')} sx={{ background: '#ebebeb', borderColor: 'black', color: "#41464b" }}>
                  <ArrowBackIcon />
                </IconButton>
              </Tooltip>
            </Grid>
            <Grid item xs={11} sm={11} mt={1} pl={-10}>
              <MDTypography variant="h5">Crear pedido</MDTypography>
            </Grid>
          </Grid>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Card id="basic-info" sx={{ overflow: "visible" }}>
                <Grid container p={3} spacing={3}>

                  CONTENIDO
                  <Autocomplete
                  value={defaultExecutive}
                  id="ddlUsuario"
                  options={user}
                  onChange={handleChangeSelect}
                  renderInput={(params) => (
                     <FormField {...params}
                        required
                        error={errorFlag.usuario}
                        helperText={errorFlag.usuarioMsg}
                        label="Seleccione el ejecutivo"
                        InputLabelProps={{ shrink: true }} />
                  )}
               />

                </Grid>
              </Card>
            </Grid>
          </Grid>
          <Grid container pt={3} display="flex" alignItems="flex-end" style={{ textAlign: "right" }}>
            <Grid item xs={12} sm={12}>
              <MDButton type="button" variant="gradient" color="dark" size="small"
                onClick={confirmar}
              >
                Guardar
              </MDButton>
              <MDButton type="button" variant="gradient" color="dark" size="small"
                onClick={cancelar} style={{ marginLeft: "10px" }}
              >
                Cancelar
              </MDButton>
            </Grid>
          </Grid>
        </MDBox>
      </BaseLayout>