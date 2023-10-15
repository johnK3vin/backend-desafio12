const prodModel = "../../models/product.models.js";
const socket = io()
const form = document.getElementById('idForm')
const botton = document.getElementById('seeProd')

form.addEventListener('submit', async (e)=>{
    e.preventDefault()

    const datForm = new FormData(e.target)
    const prod = Object.fromEntries(datForm)
    socket.emit("nuevoProd", prod)
    e.target.reset()
})

botton.addEventListener('click' , async (e) =>{
    e.preventDefault()
    await socket.emit('pedir-Datos');

    socket.on('datos', (datos) =>{
        const div = document.querySelector('.prodContainer')
        let products = "";
        const data = datos.docs
        if(data){
            data.forEach((prod)=>{
                products += `
                    <div class='prods'>
                        <h3>${prod.title}</h3>
                        <p>Descripción: ${prod.description}</p>
                        <p>Precio: $${prod.price}</p>
                        <p>Código: ${prod.code}</p>
                        <p>Stock: ${prod.stock}</p>
                    </div>
                
                `
            })
            div.innerHTML = products
            console.log('todo beun')
        }else{
            console.log("error al resivir los datos")
        }
    })
})



