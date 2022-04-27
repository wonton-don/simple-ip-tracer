
let lon;
let lat;
const ip = document.querySelector('.ipOut');
const local = document.querySelector('.localOut');
const timezone = document.querySelector('.tzOut');
const isp = document.querySelector('.ispOut');

//function to update location and fields
const updateLocation = async (res) => {
    console.log(res)
    const data = await res.data;
    lat = data.latitude;
    lon = data.longitude;
    ip.innerText = data.ip;
    isp.innerText = data.connection.isp;
    local.innerText = `${data.city}, ${data.region}`;
    timezone.innerText = data.timezone.id;
    const center = new mapboxgl.LngLat(lon, lat);
    map.setCenter(center);
    const marker = new mapboxgl.Marker()
        .setLngLat([lon, lat])
        .addTo(map);
}

//get the users ip on page load
let apiKey = 'aa3984661d555365c55727fbe2d0acf805ab2bb8680ecb728a4da319';
axios.get(`https://api.ipdata.co?api-key=${apiKey}`)
    .then(async res => {
        const data = await res.data;
        lat = data.latitude;
        lon = data.longitude;
        ip.innerText = data.ip;
        local.innerText = `${data.city}, ${data.region}`;
        timezone.innerText = data.time_zone.name;
        isp.innerText = data.asn.name;
        const center = new mapboxgl.LngLat(lon, lat);
        map.setCenter(center);
        const marker = new mapboxgl.Marker()
            .setLngLat([lon, lat])
            .addTo(map);
    })

//load map
mapboxgl.accessToken = 'pk.eyJ1Ijoid29udG9uLWRvbiIsImEiOiJjbDA3Z3MxczgwMHM3M2JxZTJkN2lhMGdkIn0.Hq0gfETpy3T-eYzsV-ATFQ';
const map = new mapboxgl.Map({
    container: document.querySelector('.map'),
    style: 'mapbox://styles/mapbox/streets-v11',
    center: [1, 1],
    zoom: 10
});

//on search btn click get the ip from the search input and call update location function
const search = document.querySelector('#search');
const searchBtn = document.querySelector('.searchBtn');
searchBtn.addEventListener('click', () => {
    const input = search.value;
    const regex = new RegExp('^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$');
    if (regex.test(input)) {
        axios.get(`http://ipwho.is/${input}`)
            .then(async res => updateLocation(res))
        search.placeholder = 'Search for any IP address or domain'
    } else {
        search.value = '';
        search.placeholder = 'Invalid IP Address'
    }
})