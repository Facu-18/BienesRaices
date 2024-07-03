

(function(){
    const lat = -31.420030;
    const lng = -64.188773;
    const mapa = L.map('mapa-inicio').setView([lat, lng], 12);

    let markers = new L.FeatureGroup().addTo(mapa)

    let propiedades = [];

     // Filtros
     const filtros = {
        categoria: '',
        precio: ''
    }
    
    
    const categoriasSelect = document.querySelector('#categorias');
    
    const preciosSelect = document.querySelector('#precios');
    
     
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);
    
    // Filtrado de categorias y precios
    categoriasSelect.addEventListener('change', e =>{
        filtros.categoria = +e.target.value
        filtrarPropiedades();
    })

    preciosSelect.addEventListener('change', e =>{
        filtros.precio = +e.target.value
        filtrarPropiedades();
    })

    const obtenerPropiedades = async () =>{
        try{
            const url = '/api/propiedades';
            const respuesta = await fetch(url);
            propiedades = await respuesta.json();
            

            mostrarPropiedades(propiedades)

        }catch(error){
            console.log(error)
        }
    }

    const mostrarPropiedades = propiedades => {
        
        // Limpiar los pines previos
        markers.clearLayers()

        propiedades.forEach(propiedad => {
            // Agregando los pines
            const marker = new L.marker([propiedad?.lat, propiedad?.lng],{
                autoPan: true

            }).addTo(mapa)
               .bindPopup(`
                  <p class="text-indigo-600 font-bold">${propiedad.categoria.nombre}</p> 
                  <h1 class="text-xl font-extrabold uppercase my-3">${propiedad?.titulo}
                  </h1>
                  <img src="/uploads/${propiedad?.imagen}" alt="Imagen de la propiedad ${propiedad.titulo}">
                  <p class="text-gray-600 font-bold">${propiedad.precio.nombre}</p>
                  <a href="/propiedad/${propiedad.id}" class="bg-indigo-600 block p-2 text-center font-bold uppercase text-white"> Ver Propiedad </a>
                `)

            markers.addLayer(marker)
            
        });

    }

    const filtrarPropiedades = ()=> {
        const resultado = propiedades.filter(filtrarCategoria).filter(filtrarPrecio)
        

        mostrarPropiedades(resultado)
    }

    
    
    const filtrarCategoria = propiedad =>{
        return filtros.categoria ? propiedad.CategoriaId === filtros.categoria : propiedad
    }

    const filtrarPrecio = propiedad =>{
        return filtros.precio ? propiedad.PrecioId === filtros.precio : propiedad
    }

    obtenerPropiedades();

})()
