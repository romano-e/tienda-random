document.addEventListener('DOMContentLoaded', () => {
  const contenedorProductos = document.getElementById('contenedor-productos');
  const modal = document.getElementById('modal-producto');
  const btnCerrar = document.getElementById('cerrar-modal');

  // Elementos internos del modal
  const modalImg = document.getElementById('modal-img');
  const modalTitulo = document.getElementById('modal-titulo');
  const modalDesc = document.getElementById('modal-desc');
  const modalLink = document.getElementById('modal-link');

  // 1. Cargar los datos del catálogo
  fetch('data/products.json')
    .then(respuesta => respuesta.json())
    .then(productos => {
      productos.forEach(producto => {
        // Salta si un producto no esta disponible
        if (producto.disponible === "NO") return;
        // Crear la tarjeta para cada producto
        const tarjeta = document.createElement('div');
        tarjeta.className = 'tarjeta-producto';
        tarjeta.innerHTML = `
          <img src="${producto.imagen}" alt="${producto.nombre}">
          <h3>${producto.nombre}</h3>
        `;

        // 2. Agregar el evento de clic para abrir el detalle
        tarjeta.addEventListener('click', () => {
          modalImg.src = producto.imagen;
          modalTitulo.textContent = producto.nombre;
          modalDesc.textContent = producto.descripcion;
          // NUEVA LÍNEA: Cambia el enlace para incluir el ID en la URL
          modalLink.href = `producto.html?id=${producto.id}`;
          modal.showModal(); // Abre el modal nativo de HTML
        });

        // Insertar en el HTML
        contenedorProductos.appendChild(tarjeta);
      });
    })
    .catch(error => console.error('Error cargando el catálogo:', error));

  // 3. Lógica para cerrar el modal
  btnCerrar.addEventListener('click', () => {
    modal.close();
  });

  // Cerrar el modal si se hace clic afuera del contenido
  modal.addEventListener('click', (e) => {
    if (e.target === modal) modal.close();
  });
});