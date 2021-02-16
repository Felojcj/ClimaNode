require('dotenv').config()

const { inquirerMenu, pausa, leerInput, listarLugares } = require('./helpers/inquirer')
const Busquedas = require('./models/busqueda')
const axios = require('axios')

const main = async () => {
  const busquedas = new Busquedas()
  let opt

  do {
    opt = await inquirerMenu()

    switch (opt) {
      case 1:
        // Mostrar Mensaje
        const termino = await leerInput('Ciudad:')

        // Buscar los lugares
        const lugares = await busquedas.ciudad(termino)

        // Seleccionar el lugar
        const idSeleccionado = await listarLugares(lugares)
        if (idSeleccionado === '0') continue

        const lugarSel = lugares.find(l => l.id === idSeleccionado)
        busquedas.agregarHistorial(lugarSel.nombre)

        // Clima
        const clima = await busquedas.climaLugar(lugarSel.lat, lugarSel.lng)

        console.clear()
        console.log('\nInformacion de la ciudad\n'.green)
        console.log('Ciudad:', lugarSel.nombre.green)
        console.log('Lat:', lugarSel.lat)
        console.log('Long:', lugarSel.lng)
        console.log('Temperatura:', clima.temp)
        console.log('Minima:', clima.min)
        console.log('Maxima:', clima.max)
        console.log('Descripcion:', clima.desc.green)
      break;

      case 2:
        busquedas.historialCapitalizado.forEach((lugar, i) => {
          const idx = `${i + 1}.`.green
          console.log(`${idx} ${lugar}`)
        })
      break;
    }

    if (opt !== 0) await pausa()
  } while (opt !== 0)
}

main()
