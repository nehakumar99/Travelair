let countDownString='12 August 2020 12:00:00';

// function to call timer every second 
setInterval(function(){
    let countDownDate = new Date (countDownString).getTime()/1000;
    // dividing to convert  millisecondsto seconds 
    let now=new Date().getTime()/1000;
    // the difference is calculated in seconds 
    let diff = Math.floor(countDownDate - now);
    // console.log(diff); 
    // convert to days from seconds 
    let days=Math.floor(diff/(60*60*24));
    //convert seconds to hours 
    let hours = Math.floor((diff % (60*60*24)) /(60*60));
    //convert seconds to mins
    let mins = Math.floor((diff % (60*60))/60);
    let secs = Math.floor(diff % 60);
    if(diff > -1)
    {
        document.getElementById('days').innerText=days;
        document.getElementById('hours').innerText=hours;
        document.getElementById('mins').innerText=mins;
        document.getElementById('secs').innerText=secs;
    }
},1000);