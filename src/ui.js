import { capitalizarPrimeraLetra } from './utilidades.js';

export function crearCartasVacias(cantidad) {
  for (let i = 0; i < cantidad; i++) {
    const $carta = document.createElement('div');
    const htmlCarta = `
          <img src="#" alt="" class="card-img-top">
           <div class="card-body">
               <h3 class="card-title">Cargando...</h3>
                <h4 class="card-subtitle h6">
                    <span class="badge"></span>
                    <span class="badge"></span>
                </h4>
            </div>`;
    $carta.innerHTML = htmlCarta;
    $carta.className = 'carta card shadow-sm';

    const $contenedorCartas = document.querySelector('.cartas .row');
    const $contenedorCarta = document.createElement('div');
    $contenedorCarta.className = 'col';

    $contenedorCarta.appendChild($carta);
    $contenedorCartas.appendChild($contenedorCarta);
  }
}

export function cargarDatosPokemon(pokemon, $carta) {
  const {
    id,
    name: nombrePokemon,
    types: tipos,
    sprites: {
      other: {
        'official-artwork': { front_default: urlSprite },
      },
    },
  } = pokemon;

  const $imagen = $carta.querySelector('.card-img-top');
  const $nombre = $carta.querySelector('.card-title');
  const $tipos = $carta.querySelectorAll('.card-subtitle .badge');

  $carta.setAttribute('data-pokemon-id', id);

  $imagen.alt = `Arte oficial del Pokemon ${capitalizarPrimeraLetra(nombrePokemon)}`;
  $imagen.src = urlSprite;

  $nombre.textContent = capitalizarPrimeraLetra(nombrePokemon);

  tipos.forEach((tipo, i) => {
    const nombreTipo = tipo.type.name;
    $tipos[i].textContent = nombreTipo;
    $tipos[i].classList.add(nombreTipo);
  });
}

export function borrarPokemonesAnteriores() {
  document.querySelectorAll('.col').forEach((carta) => {
    carta.remove();
  });
}
