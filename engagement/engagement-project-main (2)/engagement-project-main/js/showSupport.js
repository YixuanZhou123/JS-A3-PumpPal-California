function showSupport() {
  const supportButton = document.getElementById('show-support');
  supportButton.addEventListener('click', openMapPopup);
}

function openMapPopup() {
  const mapWindow = window.open("./popupPage/showSupport.html", "Map", "width=800,height=600");

 // mapWindow.document.close();
}

export { showSupport };
