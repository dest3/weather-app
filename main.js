//creo una constante llamada api donde gaurdo la url de la api con la key personal de la misma 
const api = {
    key: '0fc45feca7f54eeaeab4eb8a82aad712',
    url: 'http://api.openweathermap.org/data/2.5/weather?'
};
//obtengo los elementos por el id del html para crear constantes para luego poder actalizarlos
const card = document.getElementById('card')
const city = document.getElementById('city');
const date = document.getElementById('date');
const tempimg = document.getElementById('temp-img');
const temp = document.getElementById('temp');
const weather = document.getElementById('weather');
const range = document.getElementById('range');

//obtiene los datos de el form y la search box cuando se aprieta enter o enviar
const form = document.getElementById('search-form');
const searchbox = document.getElementById('searchbox');

form.addEventListener('submit', onSubmit, true);

function updateImage(data) {
    const temp = toCelsius(data.main.temp);
    let src = 'img/temp-mid.png';
    if (temp> 26){
        scr = 'img/temp-high.png';
    } else if (temp < 20){
        src = 'img/temp-low.png'
    }
    tempimg.src = src;
}

//esta funcion trae la informacion de la api y la guarda en sus respectivos lugares dentro del html mediante un json
async function search(query) {
    try {
        //llama a la api con la url, la key y la query
        const response = await fetch(`${api.url}q=${query}&appid=${api.key}`);
        const data = await response.json();
        card.style.display = 'block';
        city.innerText = `${data.name}, ${data.sys.country}`;
        date.innerText = (new Date()).toLocaleDateString();
        temp.innerText = `${toCelsius(data.main.temp)}c`;
        weather.innerText = data.weather[0].description;
        range.innerText = `${toCelsius(data.main.temp_min)} / ${toCelsius(data.main.temp_max)}`;
        updateImage(data);
    } catch (error) {
        //en caso de error notifica por consola y alerta
        console.log(error);
        alert('Hubo un error al obtener el clima actual');
    }
}

//convierte la temperatura de kelvin a centigrados
function toCelsius(kelvin){
    return Math.round(kelvin - 273.15)
}

//obtiene la info puesta en el input de ciudad 
function onSubmit(event) {
    event.preventDefault();
    search(searchbox.value);
}

// Obtener el botón por su ID
const botonGuardar = document.getElementById('guardar');

// Variable para guardar el contenido de la tarjeta
let contenidoTarjeta;

// Agregar un evento que se activa al hacer click
botonGuardar.addEventListener('click', function() {
    // Obtener el contenido HTML de la tarjeta
    const tarjetaElement = document.getElementById('tarjeta');
    contenidoTarjeta = tarjetaElement.innerHTML;
    console.log("Botón Guardar presionado. Contenido de la tarjeta:", contenidoTarjeta);
    let divlleno =false;
    // Recorrer cada div de la sección "grilla"
    const divsGrilla = document.querySelectorAll('.grilla > div');
    divsGrilla.forEach(div => {
        // Verificar si el div está vacío
        if (!divlleno && div.innerHTML.trim() === '') {
            // Si está vacío, asignarle el contenido de la tarjeta guardada
            div.innerHTML = contenidoTarjeta;
            divlleno = true;
        }
    });
    // Guardar el contenido de la "grilla" en el localStorage
    guardarGrilla();
});


// Función para guardar el contenido de la "grilla" en el localStorage
function guardarGrilla() {
    // Recorrer cada div de la sección "grilla"
    const divsGrilla = document.querySelectorAll('.grilla > div');
    const contenidoDivs = Array.from(divsGrilla).map(div => div.innerHTML);
    localStorage.setItem('grillaContenido', JSON.stringify(contenidoDivs));
}

// Función para cargar el contenido de la "grilla" desde el localStorage
function cargarGrilla() {
    const contenidoGrilla = JSON.parse(localStorage.getItem('grillaContenido'));
    if (contenidoGrilla) {
        const divsGrilla = document.querySelectorAll('.grilla > div');
        divsGrilla.forEach((div, index) => {
            div.innerHTML = contenidoGrilla[index];
        });
    }
}

// Llamar a la función cargarGrilla al cargar la página para restaurar el estado de la "grilla"
window.addEventListener('DOMContentLoaded', cargarGrilla);

// Obtener el botón por su ID
const botonReset = document.getElementById('reset');

botonReset.addEventListener('click', function() {
    // Resetear el localStorage y dejarlo vacío
    localStorage.clear();
    // Luego, recargar la página para que la "grilla" vuelva a estar vacía
    window.location.reload();
});


const grilla = document.getElementById('grilla')

new Sortable(grilla, {
    animation: 200,
    chosenClass: "select",
    dragClass: "drag",
    ghostClass: "fantasma"
});