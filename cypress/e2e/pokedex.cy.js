import { convertirDecimetrosAMetros, convertirHectogramosAKilogramo, capitalizarPrimeraLetra } from '../../src/utilidades.js';

describe('Testeando Pokedex', () => {
  const POKEMONES_POR_PAGINA = 20;
  beforeEach(() => {
    const URL = '127.0.0.1:8080';

    for (let i = 1; i <= POKEMONES_POR_PAGINA * 2; i++) {
      cy.fixture('pokemones.json').then((fixturePokemones) => {
        const datosPokemonActual = { body: fixturePokemones[i - 1] };
        cy.intercept(`https://pokeapi.co/api/v2/pokemon/${i}`, datosPokemonActual).as(`pokemon${i}`);
      });
    }

    // Puedo stubear un intercept con un objeto.
    // Agarro el fixture, agarro el objeto en la posi que me interesa
    // y creo un objeto con eso, lo stubeo

    cy.visit(URL);
  });

  it('Carga correctamente las carta pokemon', () => {
    cy.get('.carta').should('have.length', POKEMONES_POR_PAGINA);

    cy.get('.carta').each((carta) => {
      cy.wrap(carta)
        .find('.card-title')
        .should('be.visible');
      cy.wrap(carta)
        .find('.card-subtitle')
        .should('be.visible');
      cy.wrap(carta)
        .find('.card-img-top')
        .should('have.attr', 'src');
    });
  });

  it('Carga correctamente las cartas para cada página', () => {
    verificarCartasEnPagina(1);

    cy.get("nav [data-indice='2']").click();

    verificarCartasEnPagina(2);
  });

  it('Carga correctamente los datos del modal', () => {
    const ID_POKEMON_1 = 1;
    const ID_POKEMON_2 = 8;

    cy.get(`[data-pokemon-id = '${ID_POKEMON_1}']`).click();
    cy.get('.modal').should('be.visible');
    comprobarDatosModal(ID_POKEMON_1);

    cy.wait(500);
    cy.get('.modal .btn-close').click(); // cierra el modal;
    cy.get('.modal')
      .should('not.be.visible');

    cy.get(`[data-pokemon-id = '${ID_POKEMON_2}']`).click();
    comprobarDatosModal(ID_POKEMON_2);
  });

  it('El paginador funciona correctamente', () => {
    cy.get('nav .page-link.active').as('paginaSeleccionada')
      .should('have.text', '1');
    cy.get("[data-indice='anterior']")
      .should('have.class', 'disabled');

    cy.get("[data-indice='2']")
      .should('have.text', '2')
      .click();

    cy.get('@paginaSeleccionada')
      .should('have.text', '2');

    cy.get("[data-indice='3']")
      .should('have.text', '3')
      .click();

    cy.get('@paginaSeleccionada')
      .should('have.text', '3');

    cy.get("[data-indice='siguiente']")
      .should('have.text', 'Siguiente')
      .click();

    cy.get('@paginaSeleccionada')
      .should('have.text', '4');

    cy.get("[data-indice='anterior']")
      .should('have.text', 'Anterior')
      .click().click();

    cy.get('@paginaSeleccionada')
      .should('have.text', '2');
  });
});

function extraerDatosPokemon(pokemon) {
  const {
    id,
    name: nombre,
    sprites: {
      other: {
        'official-artwork': { front_default: urlImagen },
      },
    },
    types: tiposSinMapear,
    weight: pesoEnHG,
    height: alturaEnDM,
    stats: estadisticasSinMapear,
  } = pokemon;

  const tipos = tiposSinMapear.map((item) => item.type.name);
  const estadisticas = {};
  Object.keys(estadisticasSinMapear).forEach((indiceEstadistica) => {
    estadisticas[estadisticasSinMapear[indiceEstadistica].stat.name] = estadisticasSinMapear[indiceEstadistica].base_stat;
  });

  return {
    id,
    nombre,
    urlImagen,
    tipos,
    peso: pesoEnHG,
    altura: alturaEnDM,
    estadisticas,
  };
}

function verificarCartasEnPagina(nroPagina) {
  const POKEMONES_POR_PAGINA = 20;
  const offsetPokemon = (nroPagina - 1) * POKEMONES_POR_PAGINA;

  cy.fixture('pokemones.json').then((pokemones) => {
    for (let i = 0; i < 20; i++) {
      const {
        id: idPokemon,
        nombre: nombrePokemon,
        urlImagen: urlImagenPokemon,
        tipos: tiposPokemon,
      } = extraerDatosPokemon(pokemones[i + offsetPokemon]);

      cy.get('.carta')
        .eq(i)
        .as('cartaActual');

      cy.get('@cartaActual')
        .should('have.attr', 'data-pokemon-id', idPokemon);

      cy.get('@cartaActual')
        .find('img')
        .should('have.attr', 'src', urlImagenPokemon)
        .should('have.attr', 'alt', `Arte oficial del Pokemon ${capitalizarPrimeraLetra(nombrePokemon)}`);

      cy.wrap(tiposPokemon).each((tipoPokemon) => {
        cy.get('@cartaActual')
          .find('.card-subtitle')
          .should('contain.text', tipoPokemon);
      });
    }
  });
}

function comprobarDatosModal(idPokemon) {
  cy.fixture('pokemones.json').then((pokemones) => {
    const datosPokemon = extraerDatosPokemon(pokemones[idPokemon - 1]);

    cy.get('.modal')
      .should('be.visible');

    cy.get('.modal')
      .find('.pokemon-imagen')
      .should('have.attr', 'src', datosPokemon.urlImagen);

    cy.get('.modal')
      .find('.pokemon-peso')
      .should('contain.text', convertirHectogramosAKilogramo(datosPokemon.peso));

    cy.get('.modal')
      .find('.pokemon-altura')
      .should('contain.text', convertirDecimetrosAMetros(datosPokemon.altura));

    cy.wrap(datosPokemon.tipos).each((tipo) => {
      cy.get('.modal')
        .find(`.pokemon-tipo.${tipo}`)
        .should('contain.text', tipo);
    });

    cy.get('.modal')
      .find('.hp')
      .should('contain.text', datosPokemon.estadisticas.hp);

    cy.get('.modal')
      .find('.attack')
      .should('contain.text', datosPokemon.estadisticas.attack);

    cy.get('.modal')
      .find('.defense')
      .should('contain.text', datosPokemon.estadisticas.defense);

    cy.get('.modal')
      .find('.speed')
      .should('contain.text', datosPokemon.estadisticas.speed);

    cy.get('.modal')
      .find('.special-attack')
      .should('contain.text', datosPokemon.estadisticas['special-attack']);

    cy.get('.modal')
      .find('.special-defense')
      .should('contain.text', datosPokemon.estadisticas['special-defense']);
  });
}

/* function comprobarDatosCartaPokemon($carta, id, nombre, tipos) {
    // Comprueba si la id es igual
    cy.wrap($carta)
        .should("have.attr", "data-pokemon-id", id);

    // Comprueba si el titulo del pokemon en la carta es igual
    cy.wrap($carta)
        .find(".card-title")
        .should(($titulo) => {
            const titulo = $titulo.text().toLowerCase();

            expect(titulo).to.equal(nombre);
        });

    cy.wrap($carta)
        .find(".card-subtitle")
        .find("span")
        .each(($tipoPokemon) => {
            const tipo = cy.wrap($tipoPokemon).invoke("class");
        });
} */
