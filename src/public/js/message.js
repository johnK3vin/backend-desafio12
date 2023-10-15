const socket = io()

const button  = document.getElementById('sendChat')
const parrafo = document.getElementById('mensajesChat')
const valInput = document.getElementById('chatBox')

let user;

function ingresarCorreo() {
  Swal.fire({
    title: "Identificación de usuario",
    text: "Por favor ingrese su correo",
    input: "text",
    inputValidator: (valor) => {
      if (!valor) {
        return "Ingrese su correo por favor";
      }
      return false;
    },
    icon: 'info',
    allowOutsideClick: false,
  }).then((resultado) => {
    user = resultado.value;
    socket.emit("validatorUser", user);

    socket.on('emailValidado', (email) => {
      if (email === user) {
        console.log("Correo válido:", user);
      } else {
        Swal.fire({
            icon: 'error',
            title: "Correo no válido",
            text: "El correo ingresado no se encontró en la base de datos",
            allowOutsideClick: false,
          }).then(() => {
            ingresarCorreo();
          });
      }
    });
  });
}
ingresarCorreo();

button.addEventListener('click',async () =>{
    if(valInput.value.trim().length > 0){
        console.log(valInput.value)
        socket.emit('mensajes' , [user, valInput.value])
        valInput.value = "";
    }
})

socket.on('mostrarMensaje', (mensajes) =>{
    parrafo.innerHTML = "";

    mensajes.forEach((mensaje) => {
      parrafo.innerHTML += `
        <div class="newMessage">
            <p>Usuario: ${mensaje.email}<br/>Escribió: ${mensaje.message}</p>
            <p class="fecha"> ${new Date(mensaje.postTime).toLocaleString()}</p>
        </div>
      `;
    });
})

