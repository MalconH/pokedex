export function capitalizarPrimeraLetra(palabra) {
  const primeraLetra = palabra.slice(0, 1).toUpperCase();
  return primeraLetra + palabra.slice(1, palabra.length);
}

export function convertirHectogramosAKilogramo(hectogramo) {
  const hectogramosEnUnKilogramo = 10;
  return hectogramo / hectogramosEnUnKilogramo;
}

export function convertirDecimetrosAMetros(decimetros) {
  const decimetrosEnUnMetro = 10;
  return decimetros / decimetrosEnUnMetro;
}

export function desempacarPokemon(pokemon) {
  const estadisticas = {};
  const tipos = pokemon.types.map(((indiceTipo) => indiceTipo.type.name));
  const {
    id,
    name: nombre,
    sprites: {
      other: {
        'official-artwork': { front_default: urlImagen },
      },
    },
    weight: pesoEnHectogramos,
    height: alturaEnDecimetros,
  } = pokemon;

  pokemon.stats.forEach((indiceEstadistica) => {
    const nombreEstadistica = indiceEstadistica.stat.name;
    const valorEstadistica = indiceEstadistica.base_stat;

    estadisticas[nombreEstadistica] = valorEstadistica;
  });

  return {
    id, nombre, urlImagen, tipos, pesoEnHectogramos, alturaEnDecimetros, estadisticas,
  };
}
