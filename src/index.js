import manejarClickCarta from './ui/modal.js';
import { cambiarPagina, manejarClickPaginador } from './ui/paginacion.js';

document.querySelector('.pagination').addEventListener('click', manejarClickPaginador);
document.querySelector('.cartas').addEventListener('click', manejarClickCarta);

function inicializar() {
  cambiarPagina(1);
}

inicializar();
