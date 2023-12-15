import obtenerPokemon from '../pokeapi.js';
import { decimetrosAM, hectogramosAKG, mayusculaEnPrimeraLetra } from '../utilidades.js';

function resetearClasesTiposPokemonModal() {
  document.querySelectorAll('.pokemon-tipo').forEach((tipo) => {
    const clonTipo = tipo;
    clonTipo.className = 'pokemon-tipo badge bg-secondary';
  });
}

function cargarDatosModal(nombre, imagen, tipos, pesoKG, alturaMetros, estadisticas, modal) {
  const $titulo = modal.querySelector('.modal-title');
  const $tiposPokemon = modal.querySelectorAll('.pokemon-tipo');
  const $imagen = document.querySelector('.pokemon-imagen');

  // Carga imagen
  $imagen.src = imagen;
  $imagen.alt = nombre;

  // Carga peso y altura
  document.querySelector('.pokemon-peso').textContent = `${pesoKG}kg`;
  document.querySelector('.pokemon-altura').textContent = `${alturaMetros}m`;

  // Carga estadisticas
  estadisticas.forEach(((estadistica) => {
    const nombreEstadistica = Object.keys(estadistica);
    const valorEstadistica = estadistica[nombreEstadistica];

    document.querySelector(`.${nombreEstadistica}-valor`).textContent = valorEstadistica;
  }));

  // Carga los tipos
  resetearClasesTiposPokemonModal();
  if (tipos.length > 1) {
    tipos.forEach((tipo, i) => {
      $tiposPokemon[i].textContent = tipo;
      $tiposPokemon[i].classList.remove('bg-secondary');
      $tiposPokemon[i].classList.add(tipo);
    });
  } else {
    $tiposPokemon[0].textContent = tipos;
    $tiposPokemon[0].classList.remove('bg-secondary');
    $tiposPokemon[0].classList.add(tipos);
    $tiposPokemon[1].classList.add('d-none');
  }

  $titulo.textContent = nombre;
}

function mostrarModalPokemon(idPokemon) {
  const modalPokemon = new bootstrap.Modal(document.querySelector('#modal-pokemon'), {});
  const $modal = modalPokemon._element;

  obtenerPokemon(idPokemon).then((pokemon) => {
    // Desempaco el JSON a constantes:

    const {
      name: nombre,
      sprites: {
        other: {
          'official-artwork': { front_default: urlImagen },
        },
      },
      types: tipos,
      weight: pesoEnHectogramos,
      height: alturaEnDecimetros,
      stats: estadisticas,
    } = pokemon;

    cargarDatosModal(
      mayusculaEnPrimeraLetra(nombre),
      urlImagen,
      tipos.map(((tipo) => tipo.type.name)),
      hectogramosAKG(pesoEnHectogramos),
      decimetrosAM(alturaEnDecimetros),
      estadisticas.map((estadistica) => {
        const nuevaEstadistica = {};

        // El key:value es nombre_estadistica:valor_estadistica, p ej: hp: 50
        nuevaEstadistica[estadistica.stat.name] = estadistica.base_stat;
        return nuevaEstadistica;
      }).flat(),
      $modal,
    );
  });

  modalPokemon.show();
}

export default function manejarClickCarta(e) {
  const idPokemon = Number(e.target.getAttribute('data-pokemon-id'));
  if (idPokemon !== 0) {
    mostrarModalPokemon(idPokemon);
  }
}
