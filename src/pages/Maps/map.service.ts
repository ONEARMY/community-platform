const getMapPins = () => {
    return fetch('https://experiment-0424-sze2iv2xoq-lm.a.run.app/map-pins')
        .then(response => response.json());
}

export const mapPinService = {
    getMapPins,
}