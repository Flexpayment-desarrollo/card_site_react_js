global.Constants = {
    ubicacion: true,
    //Desarrollo
    url: 'https://card.easytransfer.mx:',
    port: '1003',
    //Produccion
    //url: 'https://hermes.easytransfer.mx:',
    //port: '3021',
    credential: '"UtPIs1xqrvGDeUXqxIsNosRUCl9IAhGhex63aYamjdeDIculo9YP2mp06H3uh2EmKzfgOw2OWDc/EZajadJWVwxx1d/LUpj1x+OXjlL1E0i9+fUg+pebRXq26pf2C9Ng9zzgl/GnUF3mbtmNE3qwOoUDiv7mAushAmzHod94PssxEEyMDSU0kYNy0OuMQgM0CKMRYWePdq5zkCxgbVBqpvd80W+lBi9zSGuiGEl7/8A5ZAhMRZTSZyvuiz1XeZo38vbwPQy2Z2rg+y3e2M2n8p8yySYzzblopO05K3/l6WWOse6Bboqxi8eif7ogAWpeO3s/pwgxSLg4wf1SkalKcQ==',
    token: '',
}

global.Timers = {
    boton: 10000,
    modal: 600000
}

global.Credentials = {
    id: '',
    email: '',
    fechaExpiraPass: '',
    idPerfil: 0,
    idTipoPerfil: 0,
    nombre: '',
    perfil: '',
    token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCIsImN0eSI6IkpXVCJ9.eyJzZXNzaW9uX2lkIjoiSVU5ZTJXSU15WExnK0l5ZUNvMWxhV0wxQWNYeHNCd0xGb0dBNC9XZTY5V3JMUTlRTTBOVHo4d1F4T0VIb3pkSWZmVFpRMGY1eTcrY1V3UjZ6bVh2TFVpVzhycFlxemx6MWdHVDQ2OXFqN21uMXdjaDJmK2d6eGlsb09CcEhDUW10Z0lVTzZwTVByNWh2NlRhb1FINnNpQXo0L1hRUmJhK1lxZTk5M2xVSURYZTF6L29YUVlRczFlRzZBenJvSEs0QlVOQ3ZsUHJsQ09QczlxME9nV1pZSUQ4b3JHdi8zREdILzB2SWJ3bXNIR3hFVlZISll2UDhyRkNSalMzaUhtZ1o4OFVaYzgyMElzWlFjeWE2YVowcVRrOXkwV2xmbzZVVkVDSzdhYVdhcS9BWjV5UlZTL1V3ek9FRWdhbGVwK3NjaWdVNUg4b24rd1ZiK0hzSGtVU0t1NEtla0ZEUCsyMnArRWdFaGkrejBwS3RmdWdXdFhGL2o4Ymp6bzFHTy9QOXZXeGd4WFUvTHV6YThaaGY2NDl4WmlnYkdBYk9NSWpLUXlOQ1psVEVjdHBLbEd0Zzc2dGxCLzVTVGliZmowSElQa3JqQTk3R0ErR1YvTkduajZzMTFmQTg2Ny9IRE1qcG1hV2pZaXBrdEZHZWU5amVvU2FSM0RqbkpWMkZZOUdDQVFHa2ROZVBjL3VJUjRBOGl3OVVtQ3lHb0NBbkJpYzB3c25YZVQ1L0FBVDBnUlcyNTZZLzRkWnBmenFFNW9Mdm9wbHdCS2dCdlF2QTBzSTdiSTlRQUEzRkE2NURTUjB1T0xBYk5YazhzUjQ0TTBkNTF3ajRwZW5uMzZEaWovazJyTHVIaXd2eVFXYTBmZXVPZW8xS0RBdTFnY3QxTHhRN2EyUXE5czhRa0U9Iiwic2Vzc2lvbl9wZXJmaWxJZCI6InZjMGtsN1JIWUxkbTZHbEU4RURSTGZWR3JiWnZKZkZrZEFXT1pwdThmUXhPbG9RRlNvVWdma2JLaVhUZ0dOV3QwOFBhSkRyNTlsUmR1d0tRLzZyM3ZRVURwNEpYL00yWGVtemxHVkEyV3ZkVFNMRHAxSmdaZ1N3SU1Hc2RXVWtTSmFnSDNxdkRWTkxVcDhrS1NHOSs2bXBkNGVBQVp3NnA1emJwUlBtU2hLaUp0RVZqSVIzV05nM0libGZoR0RDMVdwMHhZN2l2a29iZXlBU1VWdk5YNkIwUFR2WDRvNllJakMzbGRmUExIVkk3WXorNnpSOXB0ZllGQW5iY0hmT2FlVFBPeU5neXZSSm9NQ1JBU0RCaDJza0kxK2daY3IyZzc4OXdGVmVzTXlBczFJazJPd0JjUjNjZ2VqVm1TbU5NYy95ckRyMU1IS1YvK2tHbkJFWUUvUTBNWUxpUVl1MndxUityTE5OdzlwSVdCc3JxUncvbXhiMjFiMkNuNDlpcGN5YUR3SC9nSUF4K28vdkZmZ1lyV0VHZ1A4SGtDczdqckVTaExjS2V0TXRaZ3hZamlod1Y2c2xTSEZPRkl2Sm1sbjdyVktPZmlKSTh0OS9BTkJGT2hIZUNyYUJ4MEFPNk5Vd3ROa1VjUEZSVlJ4aXdQTnZ3Tko2T2V1UVMvOWFPSGJXK0p2eHJ4NGRUNEF0bVV6MXZuSFlhSmV0aFdyYStoNWk0WGZzNUROL3hYWElrMTExcmZWUlNxWWx2bTlPT2RTMDVVYjcyOFdUSUNiNHo4T3pvdEttUjhIaFB0a3BHM0gvVWJDeXZqYWtRK2VHQUVuelhjdjFLTlAwbXpiYXJwalpISWVJRjFiNFZFaWxoUnIxeHRjOXpmTnlCM3d6Zkd3eDdEMkNOVytrPSIsImVtYWlsIjoiZGVzYXJyb2xsb0Bpbm92YWcubXgiLCJuYmYiOjE2NjQ5OTQ1MTksImV4cCI6MTY2NTAxMjUxOSwiaWF0IjoxNjY0OTk0NTE5fQ.sXm4_ZHRVQWZe4LEinMNT-m1Ahr0O6Un0t3wjQCEG9s'
}

global.EstatusPedidoMonedero = {
    Alta: 1,
    Credito: 2,
    Pagado: 3,
    Conciliado: 4,
    Cancelado: 5,
    Facturado: 6
}

global.EstatusPedidoTarjetas = {
    Credito: 1,
    Pagado: 2,
    Conciliado: 3,
    Asignado: 4,
    Cancelado: 5,
    PagoRechazado: 7
}

global.ColorEstatusTransferencia = {
    Denegada: "#C64444",
    Aprobada: "lightgreen",
    Pendiente: "#E1BB0C",
}