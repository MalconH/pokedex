export default function obtenerPokemon(id) {
  const URL_BASE = 'https://pokeapi.co/api/v2/';

  return fetch(`${URL_BASE}pokemon/${id}`)
    .then((respuesta) => respuesta.json());
}
