const criptomonedasSelect = document.querySelector('#criptomonedas')
const formulario = document.querySelector('#formulario')
const selectorMoneda = document.querySelector('#moneda')
const resultado = document.querySelector('#resultado')
const objMoneda = {
    moneda: "",
    criptomoneda: ""
}

const obtenerCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', ()=> {
    consultarCriptomonedas();

    formulario.addEventListener('submit',submitFormulario)

    selectorMoneda.addEventListener('change',leerValor)
    criptomonedasSelect.addEventListener('change',leerValor)
})


function consultarCriptomonedas(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(response => response.json())
        .then(resultado => obtenerCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        console.log(cripto);
        const {FullName, Name} = cripto.CoinInfo;


        const option = document.createElement('option');
        option.value = Name;
        option.textContent = FullName;
        criptomonedasSelect.appendChild(option);
    });
}


function leerValor(e){
    // document.getElementById("criptomonedas").options[0].selected = true;
    // document.getElementById("criptomonedas").options[0].disabled = true;
    objMoneda[e.target.name] = e.target.value;

    console.log(objMoneda);
}

function submitFormulario(e){
    e.preventDefault();

    const { Name, criptomoneda} = objMoneda;

    if(objMoneda.Name === "" || objMoneda.criptomoneda === ""){
        mostrarmensaje('Ambos Campos Son Obligatorios');
        return;
    }
    consultarAPI()
}

function mostrarmensaje(mensaje){
    const existealerta = document.querySelector('.error')
    // if(!existealerta){
    if(!existealerta){

        const alerta = document.createElement('div');
        alerta.classList.add('error');
        alerta.textContent = mensaje;
        const rowDiv = document.querySelector('.row:nth-child(2) > div');
        console.log(rowDiv);
        rowDiv.appendChild(alerta);
        setTimeout(() => {
            alerta.remove();
        }, 3000);
    }
        
        
        // const alerta = document.getElementById('error-message');
        // if(alerta){

        //     alerta.textContent = mensaje;
        //     alerta.classList.add('error');
        //     setTimeout(() => {
        //         alerta.remove();
        //     }, 3000);
        // }
    // }
}

function consultarAPI(){
    const {moneda,criptomoneda} = objMoneda;

    url = `https://min-api.cryptocompare.com/data/pricemultifull?fsyms=${moneda}&tsyms=${criptomoneda}`;
    mostrarspinner();
    // setTimeout(() => { // se mostraría el spinner, la consulta es muy rapida y no da tiempo
        
        fetch(url)
            .then(resultado=> resultado.json())
            .then(respuesta => respuesta.RAW)
            .then(cotizacion => mostrarcotizacionHTML(cotizacion[moneda][criptomoneda]))
            
            limpiarpantalla();
    // }, 1000);
            
}

function mostrarcotizacionHTML(cotizacion){
    const {OPENDAY, HIGHDAY,LOWDAY, CHANGEPCT24HOUR,LASTUPDATE} = cotizacion;
    console.log(cotizacion);
    const precio = document.createElement('p')
    precio.classList.add('precio')
    precio.innerHTML = `El precio actual es: <span>${OPENDAY}</span>`;

    const precioAlto = document.createElement('p')
    precioAlto.innerHTML = `<p> El precio más alto en las ultimas 24Horas <span>${HIGHDAY}</span>`

    const PrecioBajo = document.createElement('p')
    PrecioBajo.innerHTML = `El precio más bajo en las ultimas 24Horas <span>${LOWDAY}</span>`

    const precio24hr = document.createElement('p');
    precio24hr.innerHTML =  `porcentaje de cambio en las ultimas 24Horas <span>${CHANGEPCT24HOUR}</span>`

    const ultimo = document.createElement('p');
    ultimo.innerHTML =  `porcentaje de cambio en las ultimas 24Horas <span>${LASTUPDATE}</span>`


    resultado.appendChild(precio);
    resultado.appendChild(precioAlto);
    resultado.appendChild(PrecioBajo);
    resultado.appendChild(precio24hr);
    resultado.appendChild(ultimo);
}

function limpiarpantalla(){
    while(resultado.firstChild){
        resultado.removeChild(resultado.firstChild)
    }
}

function mostrarspinner(){
    limpiarpantalla()
    const spinner = document.createElement('div');
    spinner.classList.add('spinner')
    spinner.innerHTML =`
    
    <div class="bounce1"></div>
    <div class="bounce2"></div>
    <div class="bounce3"></div>
    
    `

    resultado.appendChild(spinner);
}