const colors = [
  "#D2691E",
  "#FF6347",
  "#FF8C00",
  "#FFD700",
  "#CD853F",
  "#A0522D",
];

const leafContainer = document.createElement("div");
leafContainer.id = "leaf-container";
leafContainer.style.cssText =
  "position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; perspective: 1000px; pointer-events: none; z-index: -1; overflow: hidden;";
document.body.appendChild(leafContainer);

let windForce = 0;
let windTarget = 0.8;

function updateWind() {
  windTarget = (Math.random() - 0.5) * 1.6;
  setTimeout(updateWind, Math.random() * 3000 + 2000);
}
updateWind();

class Leaf {
  constructor() {
    this.x = Math.random() * window.innerWidth;
    this.y = -100;
    this.size = Math.random() * 25 + 20;
    this.speed = Math.random() * 1 + 0.5;
    this.rotation = Math.random() * 360;
    this.rotationSpeed = Math.random() * 4 - 2;
    this.rotationX = Math.random() * 360;
    this.rotationY = Math.random() * 360;
    this.rotationSpeedX = Math.random() * 3 - 1.5;
    this.rotationSpeedY = Math.random() * 3 - 1.5;
    this.swayAmplitude = Math.random() * 50 + 30;
    this.swaySpeed = Math.random() * 0.02 + 0.01;
    this.swayOffset = Math.random() * Math.PI * 2;
    this.windSensitivity = Math.random() * 0.5 + 0.5;
    this.color = colors[Math.floor(Math.random() * colors.length)];

    this.element = this.createSVG();
    document.getElementById("leaf-container").appendChild(this.element);
  }

  createSVG() {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", this.size);
    svg.setAttribute("height", this.size);
    svg.setAttribute("viewBox", "-2015 -2000 4030 4030");
    svg.classList.add("leaf");

    svg.innerHTML = `
                    <path fill="${this.color}" stroke="#8B4513" stroke-width="30" opacity="0.9" 
                          d="m-90 2030 45-863a95 95 0 0 0-111-98l-859 151 116-320a65 65 0 0 0-20-73l-941-762 212-99a65 65 0 0 0 34-79l-186-572 542 115a65 65 0 0 0 73-38l105-247 423 454a65 65 0 0 0 111-57l-204-1052 327 189a65 65 0 0 0 91-27l332-652 332 652a65 65 0 0 0 91 27l327-189-204 1052a65 65 0 0 0 111 57l423-454 105 247a65 65 0 0 0 73 38l542-115-186 572a65 65 0 0 0 34 79l212 99-941 762a65 65 0 0 0-20 73l116 320-859-151a95 95 0 0 0-111 98l45 863z"/>
                `;

    return svg;
  }

  update(time) {
    windForce += (windTarget - windForce) * 0.02;

    this.y += this.speed;
    this.x += windForce * this.windSensitivity;
    this.rotation += this.rotationSpeed + windForce * 0.5;
    this.rotationX += this.rotationSpeedX;
    this.rotationY += this.rotationSpeedY;
    const sway =
      Math.sin(time * this.swaySpeed + this.swayOffset) * this.swayAmplitude;

    this.element.style.transform = `translate(${this.x + sway}px, ${
      this.y
    }px) rotateX(${this.rotationX}deg) rotateY(${this.rotationY}deg) rotateZ(${
      this.rotation
    }deg)`;

    if (this.y > window.innerHeight + 100) {
      this.y = -100;
      this.x = Math.random() * window.innerWidth;
    }
  }

  remove() {
    this.element.remove();
  }
}

const leaves = [];

for (let i = 0; i < 70; i++) {
  const leaf = new Leaf();
  leaf.y = Math.random() * window.innerHeight;
  leaves.push(leaf);
}

let time = 0;
function animate() {
  time++;
  leaves.forEach((leaf) => leaf.update(time));
  requestAnimationFrame(animate);
}

animate();

setInterval(() => {
  if (leaves.length < 60) {
    leaves.push(new Leaf());
  }
}, 2000);
