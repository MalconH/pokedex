export function capitalizarPrimeraLetra(palabra) {
  const primeraLetra = palabra.slice(0, 1).toUpperCase();
  return primeraLetra + palabra.slice(1, palabra.length);
}

export function convertirHectogramosAKilogramo(hectogramo) {
  const hectogramosEnUnKilogramo = 10;
  return hectogramo / hectogramosEnUnKilogramo;
}

export function convertirDecimetrosAMetros(decimetros) {
  const decimetrosEnUnMetro = 10;
  return decimetros / decimetrosEnUnMetro;
}
