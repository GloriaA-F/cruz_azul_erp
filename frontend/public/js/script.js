function abrirLogin() {
    document.getElementById('modal-login').classList.remove('hidden');
}

function cerrarLogin() {
    document.getElementById('modal-login').classList.add('hidden');
}

function mostrarSeccion(seccion) {
    if(seccion === 'admin') {
        document.getElementById('sec-inicio').classList.add('hidden');
        document.getElementById('sec-admin').classList.remove('hidden');
    } else {
        document.getElementById('sec-inicio').classList.remove('hidden');
        document.getElementById('sec-admin').classList.add('hidden');
    }
}

document.getElementById('form-login').addEventListener('submit', (e) => {
    e.preventDefault();
    const user = document.getElementById('user').value;
    const pass = document.getElementById('pass').value;

    // Credenciales según lo acordado
    if(user === 'admin' && pass === 'cruzazul2026') {
        cerrarLogin();
        document.getElementById('btn-admin').classList.add('hidden');
        document.getElementById('btn-logout').classList.remove('hidden');
        mostrarSeccion('admin');
        cargarProductos();
    } else {
        alert('Credenciales incorrectas');
    }
});

function logout() {
    location.reload();
}

async function cargarProductos() {
    const lista = document.getElementById('lista-productos');
    lista.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-slate-400 italic">Consultando inventario en Amazon RDS...</td></tr>';
    
    try {
        const response = await fetch('/api/productos');
        const productos = await response.json();
        
        lista.innerHTML = '';
        productos.forEach(p => {
            lista.innerHTML += `
                <tr class="border-b hover:bg-slate-50 transition">
                    <td class="p-4 font-medium">${p.nombre}</td>
                    <td class="p-4 text-blue-600 font-bold">$${p.precio}</td>
                    <td class="p-4"><span class="px-2 py-1 ${p.stock < 10 ? 'bg-red-100 text-red-600' : 'bg-green-100 text-green-600'} rounded-md text-xs font-bold">${p.stock} uds</span></td>
                    <td class="p-4 text-right"><button class="text-slate-400 hover:text-blue-600">Editar</button></td>
                </tr>
            `;
        });
    } catch (error) {
        lista.innerHTML = '<tr><td colspan="4" class="p-8 text-center text-red-500 font-bold">Error: No se pudo conectar con el Backend.</td></tr>';
    }
}
