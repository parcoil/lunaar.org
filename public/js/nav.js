document.addEventListener("DOMContentLoaded", function () {
  const navBar = `
<nav class="navbar">
    <div class="navbar-brand">
        <a href="/"><svg width="20" height="20" viewBox="0 0.587 494.972 413.945" version="1.1" sodipodi:docname="logggo.svg" inkscape:version="1.3.2 (091e20e, 2023-11-25)" xmlns:inkscape="http://www.inkscape.org/namespaces/inkscape" xmlns:sodipodi="http://sodipodi.sourceforge.net/DTD/sodipodi-0.dtd" xmlns="http://www.w3.org/2000/svg" xmlns:svg="http://www.w3.org/2000/svg">
  <sodipodi:namedview id="namedview5" pagecolor="#ffffff" bordercolor="#000000" borderopacity="0.25" inkscape:showpageshadow="2" inkscape:pageopacity="0.0" inkscape:pagecheckerboard="0" inkscape:deskcolor="#d1d1d1" inkscape:zoom="0.45235477" inkscape:cx="-63.003646" inkscape:cy="23.21187" inkscape:window-width="1920" inkscape:window-height="949" inkscape:window-x="1920" inkscape:window-y="27" inkscape:window-maximized="1" inkscape:current-layer="svg5"></sodipodi:namedview>
  <defs id="defs1"></defs>
  <path class="st1" d="M 209.353 407.486 C 269.933 407.486 325.261 379.925 361.917 334.762 C 367.339 328.081 361.427 318.321 353.046 319.916 C 257.758 338.064 170.251 265.003 170.251 168.813 C 170.251 113.404 199.913 62.452 248.121 35.018 C 255.552 30.789 253.683 19.522 245.239 17.963 C 233.402 15.78 221.39 14.681 209.353 14.679 C 100.941 14.679 12.95 102.532 12.95 211.083 C 12.95 319.495 100.803 407.486 209.353 407.486 Z" id="path1" style="fill: #7600c3; fill-opacity: 1"></path>
  <g transform="matrix(0.19536555,-0.08235951,0.08235951,0.19536555,191.47,189.14735)" id="g5" style="fill: #7711ff; fill-opacity: 1">
    <g id="g4" style="fill: #7711ff; fill-opacity: 1">
      <g transform="translate(660.61987,-430.64142)" id="g2" style="fill: #7711ff; fill-opacity: 1">
        <path class="st0" d="m 331.9,56.7 32.6,79.8 c 2.5,6.2 8,10.1 14.6,10.6 l 86,6.4 c 14.2,1 25.7,10.1 30.1,23.6 4.4,13.5 0.4,27.6 -10.5,36.8 l -65.9,55.7 c -5.1,4.3 -7.2,10.7 -5.6,17.2 l 20.5,83.8 c 3.4,13.8 -1.6,27.6 -13.2,35.9 -11.5,8.4 -26.1,8.9 -38.2,1.4 l -82.4,-51 -82.4,51 c -12.1,7.5 -26.7,7 -38.2,-1.4 -11.5,-8.4 -16.5,-22.1 -13.2,-35.9 l 20.5,-83.8 c 1.6,-6.5 -0.5,-12.9 -5.6,-17.2 l -65.9,-55.7 c -10.9,-9.2 -14.9,-23.3 -10.5,-36.8 4.4,-13.5 15.9,-22.6 30.1,-23.6 l 86,-6.4 c 6.7,-0.5 12.1,-4.4 14.6,-10.6 l 32.6,-79.8 c 5.4,-13.2 17.5,-21.3 31.8,-21.3 14.7,-0.1 26.8,8.1 32.2,21.3 z" style="
            clip-rule: evenodd;
            fill: #7711ff;
            fill-opacity: 1;
            fill-rule: evenodd;
          " id="path2"></path>
      </g>
      <g transform="translate(627.2677,362.79053)" id="g3" style="fill: #7711ff; fill-opacity: 1">
        <path class="st0" d="m 331.9,56.7 32.6,79.8 c 2.5,6.2 8,10.1 14.6,10.6 l 86,6.4 c 14.2,1 25.7,10.1 30.1,23.6 4.4,13.5 0.4,27.6 -10.5,36.8 l -65.9,55.7 c -5.1,4.3 -7.2,10.7 -5.6,17.2 l 20.5,83.8 c 3.4,13.8 -1.6,27.6 -13.2,35.9 -11.5,8.4 -26.1,8.9 -38.2,1.4 l -82.4,-51 -82.4,51 c -12.1,7.5 -26.7,7 -38.2,-1.4 -11.5,-8.4 -16.5,-22.1 -13.2,-35.9 l 20.5,-83.8 c 1.6,-6.5 -0.5,-12.9 -5.6,-17.2 l -65.9,-55.7 c -10.9,-9.2 -14.9,-23.3 -10.5,-36.8 4.4,-13.5 15.9,-22.6 30.1,-23.6 l 86,-6.4 c 6.7,-0.5 12.1,-4.4 14.6,-10.6 l 32.6,-79.8 c 5.4,-13.2 17.5,-21.3 31.8,-21.3 14.7,-0.1 26.8,8.1 32.2,21.3 z" style="
            clip-rule: evenodd;
            fill: #7711ff;
            fill-opacity: 1;
            fill-rule: evenodd;
          " id="path3"></path>
      </g>
      <path class="st0" d="m 331.9,56.7 32.6,79.8 c 2.5,6.2 8,10.1 14.6,10.6 l 86,6.4 c 14.2,1 25.7,10.1 30.1,23.6 4.4,13.5 0.4,27.6 -10.5,36.8 l -65.9,55.7 c -5.1,4.3 -7.2,10.7 -5.6,17.2 l 20.5,83.8 c 3.4,13.8 -1.6,27.6 -13.2,35.9 -11.5,8.4 -26.1,8.9 -38.2,1.4 l -82.4,-51 -82.4,51 c -12.1,7.5 -26.7,7 -38.2,-1.4 -11.5,-8.4 -16.5,-22.1 -13.2,-35.9 l 20.5,-83.8 c 1.6,-6.5 -0.5,-12.9 -5.6,-17.2 l -65.9,-55.7 c -10.9,-9.2 -14.9,-23.3 -10.5,-36.8 4.4,-13.5 15.9,-22.6 30.1,-23.6 l 86,-6.4 c 6.7,-0.5 12.1,-4.4 14.6,-10.6 l 32.6,-79.8 c 5.4,-13.2 17.5,-21.3 31.8,-21.3 14.7,-0.1 26.8,8.1 32.2,21.3 z" style="
          clip-rule: evenodd;
          fill: #7711ff;
          fill-opacity: 1;
          fill-rule: evenodd;
        " id="path4"></path>
    </g>
  </g>
</svg></a>
       <!-- <span class="navbar-title">Lunaar</span> -->
    </div>
    <div class="navbar-links">
        <a href="/" class="navbar-link"><span class="icon" aria-hidden="true"><i class="fas fa-home"></i></span> Home</a>
        <a href="/science" class="navbar-link"><span class="icon" aria-hidden="true"><i class="fas fa-gamepad"></i></span> Games</a>
            <a href="/ai" class="navbar-link"><span class="icon" aria-hidden="true"><i class="fas fa-robot"></i></span> AI</a>
        <a href="/math" class="navbar-link"><span class="icon" aria-hidden="true"><i class="fas fa-grid-2"></i></span> Apps</a>
        <a href="/settings" class="navbar-link"><span class="icon" aria-hidden="true"><i class="fas fa-cog"></i></span> Settings</a>
    </div>
</nav>
`;
  const container = document.querySelector(".navbar-container");

  if (container) {
    if (window.location.pathname === "/go") {
      null;
    } else {
      container.innerHTML = navBar;
    }
  }
});
