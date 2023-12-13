function obtenerPokemon(id) {
  const URL_BASE = 'https://pokeapi.co/api/v2/';

  return fetch(`${URL_BASE}pokemon/${id}`)
    .then((respuesta) => respuesta.json());
}

function mayusculaEnPrimaLetra(palabra) {
  const primeraLetra = palabra.slice(0, 1).toUpperCase();
  return primeraLetra + palabra.slice(1, palabra.length);
}

function crearCartasVacias(cantidad) {
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

function cargarDatosPokemon(nombre, tipos, urlSprite, id, indice) {
  const $carta = document.querySelectorAll('.carta')[indice];
  const $imagen = $carta.querySelector('.card-img-top');
  const $nombre = $carta.querySelector('.card-title');
  const $tipos = $carta.querySelectorAll('.card-subtitle .badge');

  $carta.setAttribute('data-pokemon-id', id);

  $imagen.alt = `Arte oficial del Pokemon ${nombre}`;
  $imagen.src = urlSprite;

  $nombre.textContent = mayusculaEnPrimaLetra(nombre);

  tipos.forEach((tipo, i) => {
    $tipos[i].textContent = tipo;
    $tipos[i].classList.add(tipo);
  });
}

function cambiarPagina(pagina) {
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
        mayusculaEnPrimaLetra(nombrePokemon),
        tipos.map((tipo) => tipo.type.name),
        urlSprite,
        id,
        i,
      );
    });
  }
}

function borrarPokemonesAnteriores() {
  document.querySelectorAll('.col').forEach((carta) => {
    carta.remove();
  });
}

// Modal
document.querySelector('.cartas').onclick = function (e) {
  const idPokemon = Number(e.target.getAttribute('data-pokemon-id'));
  if (idPokemon !== 0) {
    mostrarModalPokemon(idPokemon);
  }
};

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
      mayusculaEnPrimaLetra(nombre),
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

function cargarDatosModal(nombre, imagen, tipos, pesoKG, alturaMetros, estadisticas, modal) {
  const $titulo = modal.querySelector('.modal-title');
  const $cuerpo = modal.querySelector('.modal-body');
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

function hectogramosAKG(hectogramo) {
  return hectogramo / 10;
}

function decimetrosAM(decimetros) {
  return decimetros / 10;
}

function resetearClasesTiposPokemonModal() {
  document.querySelectorAll('.pokemon-tipo').forEach((tipo) => {
    tipo.className = 'pokemon-tipo badge bg-secondary';
  });
}

function inicializar() {
  cambiarPagina(1);
}

inicializar();
