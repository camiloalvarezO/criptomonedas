const criptomonedasSelect = document.querySelector('#criptomonedas');
const monedasSelect = document.querySelector('#moneda');
const formulario = document.querySelector('#formulario');
const resultado = document.querySelector('#resultado');

const objBusqueda = {
    moneda: '',
    criptomoneda: '',
}

// crear una promesa que va a descargar esas criptomonedas
const obtenerCriptomonedas = criptomonedas => new Promise( resolve => {
    resolve(criptomonedas);
});

// document.addEventListener('DOMContentLoaded', () => {
//     consultarCriptomonedas();

//             formulario.addEventListener('submit',submitFormulario)

//             criptomonedasSelect.addEventListener('change', leerValor)

// });

window.onload = () => {
            consultarCriptomonedas();

            formulario.addEventListener('submit',submitFormulario);

            criptomonedasSelect.addEventListener('change', leerValor);
            monedasSelect.addEventListener('change',leerValor)
            
    }


function consultarCriptomonedas(){
    url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`
    console.log("URL de la solicitud:", url); // Verifica si la solicitud a la API está siendo realizada correctamente. 
    // Puedes agregar un console.log justo antes de la llamada a fetch para asegurarte de que la URL se esté construyendo 
    // correctamente.

    
    fetch(url)
    .then( respuesta => respuesta.json())
    .then( resultado => obtenerCriptomonedas(resultado.Data)) // los datos de las criptomonedas vienen en el .Data del json
    .then( criptomonedas => selectCriptomonedas(criptomonedas)) // puede parecer que estamos haciendo algo de más pero en realidad
    // sirve para no tener un callback, para eso están los promise, obtiene una respuesta(en este caso obtiene las criptomonoedas)
    // entonces hace algo con las criptomonedas, y las vamos a pasar desde el fetch a una función
    .catch( error => console.error('Error en la solicitud:', error));
    
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        const {FullName,Name} = cripto.CoinInfo;

        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}

function submitFormulario(e){
    e.preventDefault();
    
    //validamos el formulario
    const {moneda,criptomoneda} = objBusqueda;
    if(moneda === '' || criptomoneda === ''){
        mostrarAlerta('seleccione los 2 campos');
        return;
    }
    // consultamos la api
    consultarAPI()
}

function mostrarAlerta(msg){
    const alertas = document.querySelector('.error')
    if(!alertas){

        const alerta = document.createElement('div');
        alerta.classList.add('error');
        alerta.textContent = msg;  
        
        formulario.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
}
    function leerValor(e){
    objBusqueda[e.target.name] = e.target.value; // esto es una tecnica de que si se pone [e.target.name] y tenemos en el objeto
    // un valor con ese nombre, ese será el nuevo valor 
    console.log(objBusqueda);
}


function consultarAPI(){
    const { moneda, criptomoneda} = objBusqueda;

    url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${criptomoneda}&tsyms=${moneda}`
    mostrarSpinner();
    fetch(url)
    .then(respuesta => respuesta.json())
    .then(cotizacion => mostrarCotizacionHTML(cotizacion.DISPLAY[criptomoneda][moneda])) // le damos una forma de entrar dinamica 
    //dependiendo que tipo de moneda y criptomoneda sea, ya que no siempre el valor .DISPLAY que viene del json es lineal
}

function mostrarCotizacionHTML(cotizacion){
    
    limpiarHTML();
    const {PRICE, LASTUPDATE, HIGH24HOUR,LOW24HOUR,IMAGEURL,CHANGEPCT24HOUR} = cotizacion;

    // const imagen = document.createElement('img');
    // imagen.src = IMAGEURL;

    // const enlaceImagen = document.createElement('a');
    // enlaceImagen.classList.add('w-full', 'bg-blue-800', 'hover:bg-blue-500', 'text-white', 'uppercase', 'font-bold', 'text-center', 'rounded', 'mt-5');
    // enlaceImagen.href = IMAGEURL; // Puedes cambiar la URL del enlace si es diferente de la imagen
    // enlaceImagen.target = '_blank';
    // enlaceImagen.rel = 'noopener noreferrer';
    // enlaceImagen.appendChild(imagen);


    const precio = document.createElement('p');
    precio.classList.add('precio','text-white-700','rounded');
    precio.innerHTML = `
        El precio es : <span>${PRICE}</span>
    `;
    
    const precioAlto = document.createElement('p');
    precioAlto.innerHTML = `
        <p> precio más alto del día: <span> ${HIGH24HOUR}</span> </p>
    `;

    const precioBajo = document.createElement('p');
    precioBajo.innerHTML = `
        <p> precio más Bajo del día: <span> ${LOW24HOUR}</span> </p>
    `;

    const cambio = document.createElement('p');
    cambio.innerHTML = `
        <p> ultima actualización: <span> ${CHANGEPCT24HOUR}</span> </p>
    `;

    const ultimoCambio = document.createElement('p');
    ultimoCambio.innerHTML = `
        <p> variación de las ultimas 24 horas: <span> ${LASTUPDATE}</span> </p>
    `;
    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(precioBajo);
    resultado.appendChild(cambio);
    resultado.appendChild(ultimoCambio);

}

function limpiarHTML(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild);
    }
}

function mostrarSpinner(){
    limpiarHTML();

    const divSpinner = document.createElement('div')
    divSpinner.innerHTML = `<div class="spinner">
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    </div>`

    resultado.appendChild(divSpinner);
    setTimeout(() => {
        divSpinner.remove();
    }, 1000);
}