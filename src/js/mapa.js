(function() {
    const lat = -31.420030;
    const lng = -64.188773;
    const mapa = L.map('mapa').setView([lat, lng], 12);
    let marker;

    // Utilizar provider y geocoder
    const geocodeService = L.esri.Geocoding.geocodeService();
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // El pin
    marker = new L.marker([lat, lng],{
        draggable: true,
        autoPan: true
    }).addTo(mapa);

    // Detectar movimiento del pin
    marker.on('moveend', function(e) {
        marker = e.target;
        const posicion = marker.getLatLng();
        mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));

        // Obtener info de las calles al soltar el pin
        geocodeService.reverse().latlng(posicion, 12).run(function(err, resultado) {
            if (err) {
                console.error(err);
                return;
            }
            if (resultado && resultado.address) {
                marker.bindPopup(resultado.address.LongLabel).openPopup();
                
                //Llenar los campos
                document.querySelector('.calle').textContent = resultado?.address?.Address ?? '';
                document.querySelector('#calle').value = resultado?.address?.Address ?? '';
                document.querySelector('#lat').value = resultado?.latlng?.lat ?? '';
                document.querySelector('#lng').value = resultado?.latlng?.lng ?? '';
            } 
        });
    });
})();


