import axios from 'axios';
import L from 'leaflet';
import type {
    LatLngExpression,
    Map,
    Marker,
    TileLayer
} from 'leaflet';

declare const __GEO_KEY__: string;

const form = document.querySelector('form');
const addressInput = document.getElementById('address') as HTMLInputElement;

let marker: Marker | undefined;
let map: Map | undefined;
let tileLayer: TileLayer | undefined;

function searchAddressHandler (event: Event) {
    event.preventDefault();

    const enteredAddress = addressInput.value;

    if (!enteredAddress.trim()) {
        return;
    }

    if (!map) {
        const initialView: LatLngExpression = [0, 0];
        map = L.map('map').setView(initialView, 2);

        tileLayer = L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: '&copy; OpenStreetMap contributors',
            maxZoom: 19
        });
        tileLayer.addTo(map);
    }

    axios.get(
        `https://geocode.maps.co/search?q=${encodeURI(
            enteredAddress
        )}&api_key=${__GEO_KEY__}`
    )
    .then(response => {
        if (!response.data.length) {
            throw new Error('No se encontró esa dirección.');
        }

        const coordinates: LatLngExpression = {
            lat: Number(response.data[0].lat),
            lng: Number(response.data[0].lon)
        }

        map?.setView(coordinates, 13);
        marker?.remove();
        marker = L.marker(coordinates).addTo(map as Map);
    })
    .catch(err => {
        alert(err.message);
        console.log(err);
    });
}

form?.addEventListener('submit', searchAddressHandler);