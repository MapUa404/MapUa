const map = L.map('map').setView([48.3794, 31.1656], 6); // Центр України

L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
  attribution: '&copy; OpenStreetMap contributors'
}).addTo(map);

const drawnItems = new L.FeatureGroup();
map.addLayer(drawnItems);

const drawControl = new L.Control.Draw({
  edit: {
    featureGroup: drawnItems
  },
  draw: {
    polygon: true,
    polyline: true,
    rectangle: true,
    circle: false,
    circlemarker: false,
    marker: true
  }
});
map.addControl(drawControl);

function promptData(layer) {
  const name = prompt("Назва:", "");
  const desc = prompt("Опис:", "");
  const color = prompt("Колір (hex або 'red'):", "#3388ff");

  if (layer instanceof L.Polygon || layer instanceof L.Polyline || layer instanceof L.Rectangle) {
    layer.setStyle({ color: color });
  }

  layer.bindPopup(`<b>${name}</b><br>${desc}`);
  layer.options.customData = { name, desc, color };
}

map.on(L.Draw.Event.CREATED, function (event) {
  const layer = event.layer;
  promptData(layer);
  drawnItems.addLayer(layer);
});

// Завантаження GeoJSON
function downloadGeoJSON() {
  const geojson = drawnItems.toGeoJSON();
  const blob = new Blob([JSON.stringify(geojson, null, 2)], { type: "application/json" });
  saveAs(blob, "map.geojson");
}

// Кнопка збереження
const exportButton = L.control({ position: 'topright' });
exportButton.onAdd = function () {
  const div = L.DomUtil.create('div', 'leaflet-bar');
  const btn = L.DomUtil.create('a', '', div);
  btn.innerHTML = '💾';
  btn.href = '#';
  btn.title = 'Зберегти GeoJSON';
  btn.onclick = function (e) {
    e.preventDefault();
    downloadGeoJSON();
  };
  return div;
};
exportButton.addTo(map);
