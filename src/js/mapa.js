(function() {
    const lat = -31.420030;
    const lng = -64.188773;
    const mapa = L.map('mapa').setView([lat, lng ], 12);
    let marker;

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
    }).addTo(mapa);

    // El pin
    marker = new L.marker([lat, lng],{
        draggable: true,
        autoPan: true
    })
    .addTo(mapa)

    // Detectar movimiento del pin
    marker.on('moveend',function(e){
       marker = e.target
       const posicion = marker.getLatLng();
       mapa.panTo(new L.LatLng(posicion.lat, posicion.lng));
    })

})()

