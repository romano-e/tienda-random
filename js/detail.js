document.addEventListener('DOMContentLoaded', () => {
  // 1. Obtener el ID del producto desde la URL
  const parametros = new URLSearchParams(window.location.search);
  const productoId = parametros.get('id');

  // Si por alguna razón entran a producto.html sin un ID, los regresamos al catálogo
  if (!productoId) {
    window.location.href = 'index.html';
    return;
  }

  // 2. Buscar los datos en el JSON (reutilizamos tu ruta de products.json)
  fetch('data/products.json')
    .then(res => res.json())
    .then(productos => {
      const producto = productos.find(p => p.id === productoId);
      
      if (!producto) {
        window.location.href = 'index.html';
        return;
      }

      // 3. Inyectar los datos básicos en la interfaz
      document.getElementById('detalle-nombre').textContent = producto.nombre;
      document.getElementById('detalle-desc-larga').textContent = producto.descripcion_larga;
      document.getElementById('detalle-materiales').textContent = producto.materiales;
      document.getElementById('detalle-medidas').textContent = producto.medidas;
      document.getElementById('codigo-producto').textContent = producto.id;

      // Inyectamos el precio base de siempre
      const elPrecioOriginal = document.getElementById('precio-producto');
      elPrecioOriginal.textContent = producto.precio;

      // Elementos de la promoción
      const contEspecial = document.getElementById('cont-precio-especial');
      const elPrecioEspecial = document.getElementById('precio-especial');

      // Evaluamos si 'precio_promocion' existe y NO está vacío
      if (producto.precio_promocion && producto.precio_promocion.trim() !== "") {
        
        // CONDICIÓN 2: Hay promoción. 
        elPrecioEspecial.textContent = producto.precio_promocion; // Inyectamos el precio especial
        contEspecial.style.display = "block";                     // Mostramos el contenedor oculto
        elPrecioOriginal.classList.add('precio-tachado');         // Volvemos el precio viejo rojo y tachado
        
      } else {
        
        // CONDICIÓN 1: Promoción vacía. Todo sigue normal.
        contEspecial.style.display = "none";                      // Aseguramos que esté oculto
        elPrecioOriginal.classList.remove('precio-tachado');      // Quitamos el estilo tachado si existía
        
      }
      
      // Imagen Principal Grande
      const imgPrincipal = document.getElementById('detalle-img-principal');
      imgPrincipal.src = producto.imagen;
      imgPrincipal.alt = producto.nombre;

      // 4. Cargar la galería con las vistas previas interactivas
      const contenedorExtras = document.getElementById('galeria-extras');
      
      if (producto.fotos_adicionales && producto.fotos_adicionales.length > 0) {
        producto.fotos_adicionales.forEach(fotoUrl => {
          const img = document.createElement('img');
          img.src = fotoUrl;
          img.alt = `Vista adicional de ${producto.nombre}`;
          img.classList.add('img-preview-thumbnail'); // Clase para los estilos CSS

          // El truco mágico: al hacer clic, reemplaza la ruta de la imagen grande
          img.addEventListener('click', () => {
            imgPrincipal.src = img.src;
          });

          contenedorExtras.appendChild(img);
        });
      }
    })
    .catch(err => console.error('Error al cargar los detalles del producto:', err));
});