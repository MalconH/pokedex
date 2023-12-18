import {
  crearCartasVacias,
  borrarPokemonesAnteriores,
  cargarDatosPokemon,
} from '../ui.js';

import obtenerPokemon from '../pokeapi.js';

import { mayusculaEnPrimeraLetra } from '../utilidades.js';

let indicePaginas = [1, 2, 3, 4, 5];
let indiceActual = 1;
const INDICE_MINIMO = 1;
const INDICE_MAXIMO = 99;

/*
    Funcionamiento del paginador:
    3  4  [5]  6  7 click en 3.
    1  2  [3]  4  5
    La diferencia entre los nros. superiores e inferieores es de - 2.
    Se le resta dos porque se separa 2 posiciones del centro.
    En cierta forma, el comportamiento del paginado es el siguiente: -2 -1 [0] +1 +2
    Se compara el nro del indiceClickado con el indice al que corresponde en el indicePaginas,
    donde se obtiene cuánto se separa del centro.
    Se le resta 2 ya que si está en el centro (posicion 2), que seria la pagina activa,
    no debe modificar nada.
*/
function actualizarIndicePaginas(indiceClickado) {
  const DISTANCIA_RESPECTO_AL_CENTRO = 2;
  const modificador = indicePaginas.indexOf(indiceClickado) - DISTANCIA_RESPECTO_AL_CENTRO;

  if (indiceClickado > 2) {
    indicePaginas = indicePaginas.map((indice) => indice + modificador);
  } else {
    indicePaginas = [1, 2, 3, 4, 5];
  }
}

function cambiarIndiceActivo(indice) {
  const $indiceActivoAnterior = document.querySelector('.pagination .active');

  if ($indiceActivoAnterior) {
    $indiceActivoAnterior.classList.remove('active');
  }

  document.querySelector(`[data-indice="${indice}"]`).classList.add('active');
}

function bloquearItemPaginacion(indice) {
  const $item = document.querySelector(`[data-indice="${indice}"]`);
  $item.classList.add('disabled');
}

function desbloquearItemPaginacion() {
  const $item = document.querySelector('.page-link.disabled');
  if ($item) {
    $item.classList.remove('disabled');
  }
}

function actualizarInterfaz(indiceClickado) {
  const $itemsPaginacion = document.querySelectorAll('.page-link');

  indicePaginas.forEach((indicePagina, i) => {
    // Ignoro el 0 pq es el item "siguiente" en la interfaz
    $itemsPaginacion[i + 1].textContent = indicePagina;
    $itemsPaginacion[i + 1].setAttribute('data-indice', indicePagina);
  });

  cambiarIndiceActivo(indiceClickado);

  desbloquearItemPaginacion();
  if (indiceClickado === INDICE_MINIMO) {
    bloquearItemPaginacion('anterior');
  }

  if (indiceClickado === INDICE_MAXIMO) {
    bloquearItemPaginacion('siguiente');
  }
}

export function cambiarPagina(pagina) {
  borrarPokemonesAnteriores();
  const paginaActual = pagina;
  const POKEMONES_POR_PAGINA = 20;
  const offset = POKEMONES_POR_PAGINA * (paginaActual - 1);

  crearCartasVacias(20);

  for (let i = 0; i < POKEMONES_POR_PAGINA; i++) {
    const idPokemon = i + 1 + offset;
    obtenerPokemon(idPokemon).then((respuestaPokemon) => {
      const {
        id,
        name: nombrePokemon,
        types: tipos,
        sprites: {
          other: {
            'official-artwork': { front_default: urlSprite },
          },
        },
      } = respuestaPokemon;

      cargarDatosPokemon(
        mayusculaEnPrimeraLetra(nombrePokemon),
        tipos.map((tipo) => tipo.type.name),
        urlSprite,
        id,
        i,
      );
    });
  }
}

export function manejarClickPaginador(e) {
  let indiceClickado = e.target.dataset.indice; // Pagina a la que el usuario quiere ir

  if (!indiceClickado) { return; }

  if (indiceClickado === 'anterior') {
    indiceClickado = indiceActual - 1;
  } else if (indiceClickado === 'siguiente') {
    indiceClickado = indiceActual + 1;
  } else {
    indiceClickado = Number(indiceClickado);
  }

  indiceActual = indiceClickado;
  actualizarIndicePaginas(indiceClickado);
  actualizarInterfaz(indiceClickado);
  cambiarPagina(indiceClickado);
}
