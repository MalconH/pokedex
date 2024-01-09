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

export function cargarDatosPokemon(nombre, tipos, urlSprite, id, indice) {
  const $carta = document.querySelectorAll('.carta')[indice];
  const $imagen = $carta.querySelector('.card-img-top');
  const $nombre = $carta.querySelector('.card-title');
  const $tipos = $carta.querySelectorAll('.card-subtitle .badge');

  $carta.setAttribute('data-pokemon-id', id);

  $imagen.alt = `Arte oficial del Pokemon ${nombre}`;
  $imagen.src = urlSprite;

  $nombre.textContent = capitalizarPrimeraLetra(nombre);

  tipos.forEach((tipo, i) => {
    $tipos[i].textContent = tipo;
    $tipos[i].classList.add(tipo);
  });
}

export function borrarPokemonesAnteriores() {
  document.querySelectorAll('.col').forEach((carta) => {
    carta.remove();
  });
}
