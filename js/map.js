let map = L.map('map')

export function initMap() {
    L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 20
    }).addTo(map)
}

export function setInitialCoordinates(lat, lng, location, ipAddress) {
    map.setView([lat, lng], 17)

    L.marker([lat, lng]).bindPopup(`${location}, ${ipAddress}`).addTo(map)
}

export function setNewCoordinates(lat, lng, location, ipAddress) {
    map.flyTo([lat, lng], 17, {
        animate: true,
        duration: 5
    })

    L.marker([lat, lng]).bindPopup(`${location}, ${ipAddress}`).addTo(map)
}
