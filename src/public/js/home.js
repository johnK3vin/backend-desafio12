document.addEventListener("DOMContentLoaded", () => {
  const socket = io();
  const container = document.getElementById('prodContainer')

  const mostraProd = () => {
    socket.emit("pedirDatos");
    socket.on("datosProd", (prods) => {
      const datos = prods.docs
      container.innerHTML = "";
      datos.forEach((element) => {
        container.innerHTML += `
            <div class="prods">
              <h3>${element.title}</h3>
              <p>Descripcion: ${element.description}</p>
              <p>Precio: $${element.price}</p>
              <p>stock: ${element.stock}</p>
            </div>
          `;
      });
    });
  };

  mostraProd();
});
