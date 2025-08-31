const fetch = require("node-fetch"); // версия 2.x
const Pbf = require("pbf").default;
const { VectorTile } = require("@mapbox/vector-tile");

const url = "http://localhost:3001/tiles/10/598/347.pbf";

async function checkTile() {
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`HTTP error: ${res.status}`);

    const arrayBuffer = await res.arrayBuffer();
    const buf = Buffer.from(arrayBuffer);

    const tile = new VectorTile(new Pbf(buf));

    const layerNames = Object.keys(tile.layers);
    console.log("Слои в тайле:", layerNames);

    layerNames.forEach((layerName) => {
      const layer = tile.layers[layerName];
      console.log(`\nСлой: ${layerName}, объектов: ${layer.length}`);
      for (let i = 0; i < Math.min(layer.length, 3); i++) {
        const feature = layer.feature(i);
        // НЕ обращаемся к feature.loadGeometry(), только свойства
        console.log(`  Объект ${i + 1}:`, feature.properties);
      }
    });
  } catch (err) {
    console.error("Ошибка:", err.message);
  }
}

checkTile();
