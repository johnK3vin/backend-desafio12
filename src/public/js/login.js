document.getElementById('loginForm').addEventListener('submit', async function(e) {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;


    try {
        const response = await fetch('/api/session/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            })
        });

        const data = await response.json();
        console.log(data)

        if (response.status === 200 || response.status === 401 ) {
            console.log("todo bien ")
            window.location.href = "/home";
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.resultado
            });
        }

    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Oops...',
            text: 'Hubo un error al intentar iniciar sesión'
        });
    }
});