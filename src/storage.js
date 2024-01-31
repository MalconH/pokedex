function obtenerKey(id) {
  return `pokemon_${id}`;
}

export function obtenerPokemon(id) {
  if (!id) {
    throw new Error(`La id ${id} no es válida`);
  }
  const key = obtenerKey(id);
  const pokemon = JSON.parse(localStorage.getItem(key));

  if (pokemon === null) {
    throw new Error(`No se pudo encontrar un pokemon con la id ${id}`);
  }

  return pokemon;
}

export function guardarPokemon(id, pokemon) {
  if (!id) {
    throw new Error(`La id ${id} no es válida`);
  }

  const key = obtenerKey(id);

  localStorage.setItem(key, JSON.stringify(pokemon));
}
