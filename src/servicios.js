import { guardarPokemon, obtenerPokemon as obtenerPokemonDeLocalStorage } from './storage.js';
import obtenerPokemonDeApi from './pokeapi.js';
import { desempacarPokemon } from './utilidades.js';

export default async function obtenerPokemon(id) {
  if (id === undefined) {
    throw new Error('No se puede obtener un pokemon sin especificar una id');
  }

  let pokemon;
  try {
    pokemon = obtenerPokemonDeLocalStorage(id);
  } catch (e) {
    pokemon = desempacarPokemon(await obtenerPokemonDeApi(id));
    guardarPokemon(id, pokemon);
  }

  return pokemon;
}
