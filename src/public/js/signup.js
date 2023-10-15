const form = document.getElementById('formRegister');


form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const datForm = new FormData(e.target)
    const prod = Object.fromEntries(datForm)
    console.log(prod)

    try {
        const response = await fetch('/api/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(prod)
        });

        const data = await response.json();


        if (response.ok) {
            try {
                Swal.fire({
                    title: '¡Registro exitoso!',
                    text: 'Serás redirigido a la página de inicio de sesión.',
                    icon: 'success',
                    confirmButtonText: 'Ok'
                }).then((result) => {
                    if (result.isConfirmed) {
                        window.location.href = '/home'; 
                    }
                });
            } catch (error) {
                Swal.fire({
                    title: 'Error',
                    text: 'Ha ocurrido un error durante el registro.',
                    icon: 'error',
                    confirmButtonText: 'Ok'
                });
            }
        } else {
            alert(`Error: ${data.mensaje}`);
        }
    } catch (error) {
        console.error('Hubo un error al registrar el usuario:', error);
        alert('Hubo un error al registrar. Inténtalo nuevamente.');
    }

   
});