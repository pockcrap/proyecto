let preguntas_aleatorias = true;
let mostrar_pantalla_juego_términado = true;
let reiniciar_puntos_al_reiniciar_el_juego = true;
let max_preguntas = 10;
let fondos = ["fondo1","fondo2","fondo3","fondo4"];
let indice = 0;

function cambiarFondo() {
 let body = document.body;
 body.classList.remove(fondos[indice]);
 indice = (indice + 1 ) % fondos.length;
 body.classList.add(fondos[indice]); 
}

function iniciarMusica() {
  let audio = document.getElementById("musica");
  audio.volume = 0.3;
  audio.play();
}

function toggleMusica() {
  let audio = document.getElementById("musica");
  let btn = document.getElementById("btnMusica");
  if (audio.paused) {
  audio.play();
  btn.innerHTML = "♫";
  }else{
    audio.pause();
    btn.innerHTML = "♩"
  }
}


function toggleMenu() {
  let menu = document.getElementById("menu");
  menu.classList.toggle("abierto");
}

window.onload = async function () {
  document.body.addEventListener("click", iniciarMusica, {once:true});
  let Response = await fetch("base-preguntas.json");
  interprete_bp = await Response.json();
  escogerPreguntaAleatoria();
};

let pregunta;
let posibles_respuestas;
btn_correspondiente = [
  select_id("btn1"),
  select_id("btn2"),
  select_id("btn3"),
  select_id("btn4")
];
let npreguntas = [];

let preguntas_hechas = 0;
let preguntas_correctas = 0;

function reiniciar_juego() {
  preguntas_correctas = 0;
  preguntas_hechas = 0;
  npreguntas = [];
  escogerPreguntaAleatoria();
}

function escogerPreguntaAleatoria() {

  
    if (npreguntas.length === max_preguntas) {
      if (mostrar_pantalla_juego_términado) {
        Swal.fire({
          title: "Juego finalizado",
          html:
          `<p>puntuacion: ${preguntas_correctas}/${preguntas_hechas}</p>`,
          icon: "success",
          confirmButtonText: "reiniciar"
        }).then((result)=>{
          if (result.isConfirmed) {
            reiniciar_juego();
          }
        });
      }
      if (reiniciar_puntos_al_reiniciar_el_juego) {
        preguntas_correctas = 0
        preguntas_hechas = 0
      }
      npreguntas = [];
      return;
    }
  
  let n;
  if (preguntas_aleatorias) {
    n = Math.floor(Math.random() * interprete_bp.length);
  } else {
    n = 0;
  }

  while (npreguntas.includes(n)) {
    n++;
    if (n >= interprete_bp.length) {
      n = 0;
    }
  }
  npreguntas.push(n);
  if(preguntas_hechas < max_preguntas) {
    preguntas_hechas++;
  }
  escogerPregunta(n);
}

function escogerPregunta(n) {
  pregunta = interprete_bp[n];
  select_id("categoria").innerHTML = pregunta.categoria;
  select_id("pregunta").innerHTML = pregunta.pregunta;
  select_id("numero").innerHTML = preguntas_hechas;
  let pc = preguntas_correctas;
  if (preguntas_hechas > 1) {
    select_id("puntaje").innerHTML = pc + "/" + (preguntas_hechas - 1);
  } else {
    select_id("puntaje").innerHTML = "";
  }

  style("imagen").objectFit = "cover";
  desordenarRespuestas(pregunta);
  if (pregunta.imagen) {
    select_id("imagen").setAttribute("src", pregunta.imagen);
    style("imagen").height = "200px";
    style("imagen").width = "100%";
  } else {
    style("imagen").height = "0px";
    style("imagen").width = "0px";
    setTimeout(() => {
      select_id("imagen").setAttribute("src", "");
    }, 500);
  }
}

function desordenarRespuestas(pregunta) {
  posibles_respuestas = [
    pregunta.respuesta,
    pregunta.incorrecta1,
    pregunta.incorrecta2,
    pregunta.incorrecta3,
  ];
  posibles_respuestas.sort(() => Math.random() - 0.5);

  select_id("btn1").innerHTML = posibles_respuestas[0];
  select_id("btn2").innerHTML = posibles_respuestas[1];
  select_id("btn3").innerHTML = posibles_respuestas[2];
  select_id("btn4").innerHTML = posibles_respuestas[3];
}

let suspender_botones = false;

function oprimir_btn(i) {
  if (suspender_botones) {
    return;
  }
  suspender_botones = true;
  if (posibles_respuestas[i] === pregunta.respuesta) {
    preguntas_correctas++;
    btn_correspondiente[i].style.background = "green";
  } else {
    btn_correspondiente[i].style.background = "red";
  }
  for (let j = 0; j < 4; j++) {
    if (posibles_respuestas[j] === pregunta.respuesta) {
      btn_correspondiente[j].style.background = "green";
      break;
    }
  }
  setTimeout(() => {
    reiniciar();
    suspender_botones = false;
  }, 3000);
}

function reiniciar() {
  for (const btn of btn_correspondiente) {
    btn.style.background = "orange";
  }
  escogerPreguntaAleatoria();
}

function select_id(id) {
  return document.getElementById(id);
}

function style(id) {
  return select_id(id).style;
}

function readText(ruta_local) {
  var texto = null;
  var xmlhttp = new XMLHttpRequest();
  xmlhttp.open("GET", ruta_local, false);
  xmlhttp.send();
  if (xmlhttp.status == 200) {
    texto = xmlhttp.responseText;
  }
  return texto;
}