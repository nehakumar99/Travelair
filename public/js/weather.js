alert("hiiihi");
window.addEventListener('load', () => {
    let long;
    let lat;
    let loc = document.getElementById('location');
    let temperature = document.getElementById('temp');
    let description = document.getelementById('desc');
    let humid = document.getElementById('humidity');

    if(navigator.geolocation)
    {
    navigator.geolocation.getCurrentPosition(position => {
       
       lon = position.coords.longitude;
        lat = position.coords.latitude;
        console.log(position);
 //setting the api
 const api = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=0ebf8de9ed14239865ebfb1d29911c7e`;
//fetching response from api 
fetch(api)
   .then(response => {
       return response.json();
   })
   //above line has no ; because this is chaining
   .then(data => {
    const {temp , humidity} = data.main;
    loc.textContent = data.name;
    temperature.textContent = temp;
    description.textContent = data.weather[0].description.toUpperCase();
    humid.textContent = humidity ;
});
});
}else{
    alert("location not captures");
}
});
