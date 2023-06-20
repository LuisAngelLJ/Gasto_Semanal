const formulario = document.querySelector('#agregar-gasto');
const gastoListado = document.querySelector('#gastos ul');


eventListeners();
function eventListeners() {
    document.addEventListener('DOMContentLoaded', preguntarPresupuesto);

    formulario.addEventListener('submit', agregarGasto);
}

class Presupuesto {
    constructor(presupuesto) {
        this.presupuesto = Number(presupuesto);
        this.restante = Number(presupuesto);
        this.gastos = [];
    }

    nuevoGasto(gasto) {
        this.gastos = [...this.gastos, gasto];
        console.log(this.gastos);
        this.calcularRestante();
    }

    calcularRestante() {
        const gastado = this.gastos.reduce((total, gasto) => total + gasto.cantidad, 0);
        this.restante = this.presupuesto - gastado;

        console.log(this.restante);
    }

    eliminarGasto(id) {
       // console.log(id);
       this.gastos = this.gastos.filter(gasto => gasto.id != id);
       //console.log(this.gastos);
       this.calcularRestante();
    }
}

class Ui {
    insertarPresupuesto(cantidad) {
        const {presupuesto, restante} = cantidad;
        document.querySelector('#total').textContent = presupuesto;
        document.querySelector('#restante').textContent = restante;
    }

    imprimirAlerta(mensaje, tipo) {
        const divMensaje = document.createElement('div');
        divMensaje.classList.add('text-center', 'alert');

        if(tipo === 'error') {
            divMensaje.classList.add('alert-danger');
        } else {
            divMensaje.classList.add('alert-success');
        }

        divMensaje.textContent = mensaje;


        document.querySelector('.primario').insertBefore(divMensaje, formulario);

        setTimeout(() => {
            divMensaje.remove();
        }, 3000);
    }

    agregarGastoListado(gastos) {
        this.limpiarHTML();
        gastos.forEach( gasto => {
            const { cantidad, nombre, id } = gasto;

            const nuevoGasto = document.createElement('li');
            nuevoGasto.className = 'list-group-item d-flex justify-content-between align-items-center';
            //nuevoGasto.setAttribute('data-id', id);
            nuevoGasto.dataset.id = id;
            nuevoGasto.innerHTML = `
                ${nombre} <span class="badge badge-primary badge-pill">${cantidad}</span>
            `;

            const btnBorrar = document.createElement('button');
            btnBorrar.textContent = "Borrar";
            btnBorrar.classList.add('btn', 'btn-danger', 'borrar-gasto');
            btnBorrar.onclick = () => {
                eliminarGasto(id);
            };

            nuevoGasto.appendChild(btnBorrar);

            gastoListado.append(nuevoGasto);
        });
    }

    limpiarHTML() {
        while(gastoListado.firstChild) {
            gastoListado.removeChild(gastoListado.firstChild);
        }
    }

    actualizarRestante(restante) {
        document.querySelector('#restante').textContent = restante;
    }

    comprobarPresupuesto(presupuestoObj) {
        const {presupuesto, restante} = presupuestoObj;

        const restanteDiv = document.querySelector('.restante');

        if((presupuesto / 4) > restante) {
            //console.log("ya gastaste el 75%");
            restanteDiv.classList.remove('alert-success', 'alert-warning');
            restanteDiv.classList.add('alert-danger');
        } else if((presupuesto / 2) > restante) {
            restanteDiv.classList.remove('alert-success', 'alert-danger');
            restanteDiv.classList.add('alert-warning');
        } else {
            restanteDiv.classList.remove('alert-warning', 'alert-danger');
            restanteDiv.classList.add('alert-success');
        }


        //si el presupuesto ya no alcanza
        if(restante <= 0) {
            ui.imprimirAlerta('El presupuesto se ha agotado', 'error');
            document.querySelector('button[type = "submit"').disabled = true;
        }
    }
}

const ui = new Ui();
//variable que tomará el valor de la instancia de presupuesto
let presupuesto;



//FUNCIONES
function preguntarPresupuesto() {
    const presupuestoUsuario = prompt('¿Cual es tu presupuesto?');

    Number(presupuestoUsuario)

    if(presupuestoUsuario === '' || presupuestoUsuario === null || isNaN(presupuestoUsuario) || presupuestoUsuario <= 0) {
        window.location.reload();
    }

    //asigno la instancia a la variable inicializada
    presupuesto = new Presupuesto(presupuestoUsuario);

    console.log(presupuesto);

    ui.insertarPresupuesto(presupuesto);
}


function agregarGasto(e) {
    e.preventDefault();

    const nombre = document.querySelector('#gasto').value;
    const cantidad = Number(document.querySelector('#cantidad').value);

    if(nombre === '' || cantidad === '') {
        ui.imprimirAlerta('Ambos campos son obligatorios', 'error');
        return;
    } else if(cantidad <= 0 || isNaN(cantidad)) {
        ui.imprimirAlerta('Cantidad no es válida', 'error');
        return;
    }

    //generar un objeto con el gasto - esto es lo contrario al destructuring, es un objeto, pero como las propiedades y los campos se llaman igual esta es la forma fácil de declararlo
    const gasto = {nombre, cantidad, id: Date.now()};
    presupuesto.nuevoGasto(gasto);

    ui.imprimirAlerta('Gasto agregado correctamente');

    //imprimir los gastos, para no pasar toda la info completa solo le paso el gasto
    const { gastos, restante } = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);

    formulario.reset();
}

function eliminarGasto(id) {
    //eliminar del arreglo
    presupuesto.eliminarGasto(id);
    //eliminar del HTML
    const {gastos, restante} = presupuesto;
    ui.agregarGastoListado(gastos);
    ui.actualizarRestante(restante);
    ui.comprobarPresupuesto(presupuesto);
}