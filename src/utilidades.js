export function mayusculaEnPrimaLetra(palabra) {
  const primeraLetra = palabra.slice(0, 1).toUpperCase();
  return primeraLetra + palabra.slice(1, palabra.length);
}

export function hectogramosAKG(hectogramo) {
  return hectogramo / 10;
}

export function decimetrosAM(decimetros) {
  return decimetros / 10;
}
