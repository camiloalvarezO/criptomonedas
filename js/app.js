const criptomonedasSelect = document.querySelector('#criptomonedas')

document.addEventListener('DOMContentLoaded', ()=> consultarAPI());


function consultarAPI(){
    const url = `https://min-api.cryptocompare.com/data/top/mktcapfull?limit=10&tsym=USD`;

    fetch(url)
        .then(response => response.json())
        .then(resultado => console.log(resultado))
}