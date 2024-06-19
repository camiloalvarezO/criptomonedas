const criptomonedasSelect = document.querySelector('#criptomonedas')
const formulario = document.querySelector('#formulario')
const selectorMoneda = document.querySelector('#moneda')

const objMoneda = {
    moneda: "",
    criptomoneda: ""
}

const consultarCriptomonedas = criptomonedas => new Promise(resolve => {
    resolve(criptomonedas);
})

document.addEventListener('DOMContentLoaded', ()=> {
    consultarAPI();

    formulario.addEventListener('submit',submitFormulario)

    selectorMoneda.addEventListener('change',leerValor)
    criptomonedasSelect.addEventListener('change',leerValor)
})


function consultarAPI(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(response => response.json())
        .then(resultado => consultarCriptomonedas(resultado.Data))
        .then(criptomonedas => selectCriptomonedas(criptomonedas));
}

function selectCriptomonedas(criptomonedas){
    criptomonedas.forEach(cripto => {
        console.log(cripto);
        const {FullName, Name} = cripto.CoinInfo;


        const option = document.createElement('option');
        option.value = Name;
        option.text = FullName;
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


}