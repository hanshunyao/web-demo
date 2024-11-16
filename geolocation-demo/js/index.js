const showDom = document.querySelector(".show");
navigator.geolocation.getCurrentPosition(
  (position) => {
    console.log(position);
    const { longitude, latitude, accuracy } = position.coords;
    showDom.innerHTML = `
     <div>经度：${longitude}</div>
     <div>纬度：${latitude}</div>
     <div>精确度：${accuracy}</div>
    `;
  },
  (error) => {
    console.log(error);
  }
);
