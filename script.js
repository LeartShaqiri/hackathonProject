// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
const renderer = new THREE.WebGLRenderer({ antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
document.body.appendChild(renderer.domElement);

// Globe setup
const globeRadius = 500;
const globe = new ThreeGlobe()
  .globeImageUrl('https://unpkg.com/three-globe/example/img/earth-dark.jpg')
  .bumpImageUrl('https://unpkg.com/three-globe/example/img/earth-topology.png');
globe.scale.set(globeRadius / 100, globeRadius / 100, globeRadius / 100);
scene.add(globe);

// Lighting
scene.add(new THREE.AmbientLight(0xffffff, 0.8));

// OrbitControls
const controls = new THREE.OrbitControls(camera, renderer.domElement);
camera.position.z = globeRadius * 2;

// Continents data
const continents = [
  { name: 'Asia', coords: [34.0479, 100.6197], description: 'Asia is the largest continent, home to diverse cultures and landscapes. Famous landmarks include the Great Wall of China, Mount Everest, and the Taj Mahal.' },
  { name: 'Africa', coords: [1.2921, 36.8219], description: 'Africa is known for its rich biodiversity and cultural heritage. The Sahara Desert, Victoria Falls, and the pyramids of Egypt are key highlights.' },
  { name: 'Europe', coords: [54.5260, 15.2551], description: 'Europe is renowned for its history, art, and architecture. Iconic locations include the Eiffel Tower in France, the Colosseum in Rome, and the beaches of Greece.' },
  { name: 'Australia', coords: [-25.2744, 133.7751], description: 'Australia is famous for its unique wildlife and landscapes. The Great Barrier Reef and the Sydney Opera House are some of its top attractions.' },
  { name: 'North America', coords: [37.0902, -95.7129], description: 'North America is a continent of varied climates and cultures, with cities like New York, Los Angeles, and Toronto offering diverse experiences.' },
  { name: 'South America', coords: [-14.2350, -51.9253], description: 'South America is known for its rainforests and vibrant cultures. The Amazon Rainforest and Machu Picchu are just a few of its world-renowned sites.' },
  { name: 'Antarctica', coords: [-75.2500, 0], description: 'Antarctica is a frozen wilderness, vital for global climate studies. Its icebergs and penguin colonies are famous, though rarely visited.' }
];

const thinkingText = document.getElementById('thinking-text');

// Lat/Long to 3D position
function latLongToVector(lat, lon, radius = globeRadius) {
  const phi = (90 - lat) * (Math.PI / 180);
  const theta = (lon + 180) * (Math.PI / 180);
  return new THREE.Vector3(
    -(radius * Math.sin(phi) * Math.cos(theta)),
    radius * Math.cos(phi),
    radius * Math.sin(phi) * Math.sin(theta)
  );
}

// Create continent markers
continents.forEach(continent => {
  const pos = latLongToVector(continent.coords[0], continent.coords[1]);

  // Create a canvas for the marker
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 64;
  const context = canvas.getContext('2d');
  context.fillStyle = 'white';
  context.font = '20px Arial';
  context.textAlign = 'center';
  context.fillText(continent.name, canvas.width / 2, canvas.height / 2);

  // Create a marker object and add it to the globe
  const marker = new THREE.Sprite(new THREE.SpriteMaterial({ map: new THREE.CanvasTexture(canvas) }));
  marker.position.copy(pos);
  globe.add(marker);

  // Add click event to each marker
  marker.onClick = function() {
    thinkingText.style.display = 'block';

    // Simulate AI thinking for 2 seconds
    setTimeout(() => {
      thinkingText.style.display = 'none';
      alert(continent.description); // Show the continent's description

      // Optionally, you could trigger the robot assistant to speak (if supported)
      if ('speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(continent.description);
        window.speechSynthesis.speak(utterance);
      }
    }, 2000); // AI thinking time
  };

  // Add mouse click event listener to the marker
  marker.addEventListener('click', marker.onClick);
});

// Render loop
function animate() {
  requestAnimationFrame(animate);
  controls.update();
  renderer.render(scene, camera);
}
animate();

// Start experience after clicking "OK" button
function startExperience() {
  document.getElementById('welcome-screen').style.display = 'none'; // Hide welcome screen
  globe.visible = true; // Make globe visible
}

// Handling window resize
window.addEventListener('resize', () => {
  renderer.setSize(window.innerWidth, window.innerHeight);
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
});

// Show robot assistant on hover (optional)
document.getElementById('robot').addEventListener('mouseenter', () => {
  alert('Click on a continent to learn more!');
});
