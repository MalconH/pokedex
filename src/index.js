async function cargarPokemones(offset, cantidad) {
    for (let i = 1; i <= cantidad; i++) {
        await obtenerPokemon(i, offset).then(respuestaPokemon => {
            const {
                name: nombrePokemon,
                types: tipos,
                sprites: { other: { "official-artwork": {
                    front_default: urlPokemon } }
                }
            } = respuestaPokemon;

            crearCartaPokemon(
                nombrePokemon,
                urlPokemon,
                tipos.map((item) => item.type.name)
            );
        });
    }
}

function obtenerPokemon(id, offset = 0) {
    const URL_BASE = "https://pokeapi.co/api/v2/";

    return fetch(`${URL_BASE}pokemon/${id + offset}`)
        .then(respuesta => respuesta.json());
}

function crearCartaPokemon(nombre, urlImagen, tipos) {
    const $carta = crearCarta();

    // Selecciono los elementos para los datos del pokemon
    const $contenedorCartas = document.querySelector(".cartas .row");
    const $nombrePokemon = $carta.querySelector("h3.card-title");
    const $imagenPokemon = $carta.querySelector("img.card-img-top");
    const $tiposPokemon = $carta.querySelectorAll(".card-subtitle .badge");

    $nombrePokemon.textContent = mayusculaEnPrimaLetra(nombre);
    $imagenPokemon.src = urlImagen;
    $imagenPokemon.alt = `Arte original del pokemon ${nombre}`;

    if (tipos.length > 1) {
        tipos.forEach((tipo, i) => {
            $tiposPokemon[i].textContent = tipo;
            $tiposPokemon[i].classList.add(tipo);
        });
    } else {
        $tiposPokemon[0].textContent = tipos;
        $tiposPokemon[0].classList.add(tipos);
        $tiposPokemon[1].remove();
    }

    $contenedorCartas.appendChild($carta);
}

function crearCarta() {
    const htmlCarta = `
        <div class="carta card shadow-sm">
          <img src="#" alt="..." class="card-img-top">
           <div class="card-body">
               <h3 class="card-title">Lorem, ipsum dolor.</h3>
                <h4 class="card-subtitle h6">
                    <span class="badge bg-secondary"></span>
                    <span class="badge bg-secondary"></span>
                </h4>
            </div>
        </div>`;

    const $contenedor = document.createElement("div");
    $contenedor.innerHTML = htmlCarta;
    $contenedor.className = "col";

    return $contenedor;
}

function mayusculaEnPrimaLetra(palabra) {
    const primeraLetra = palabra.slice(0, 1).toUpperCase();
    return primeraLetra + palabra.slice(1, palabra.length);
}


function cambiarPagina(pagina) {
    borrarPokemonesAnteriores();
    const paginaActual = pagina;
    const POKEMONES_POR_PAGINA = 20;
    const offset = POKEMONES_POR_PAGINA * (paginaActual - 1);

    cargarPokemones(offset, POKEMONES_POR_PAGINA);
}

function borrarPokemonesAnteriores() {
    document.querySelectorAll(".col").forEach((carta) => {
        carta.remove();
    });
}


function inicializar() {
    cambiarPagina(1);
}



inicializar();
