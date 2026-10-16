function isLoggedIn() {
  return localStorage.getItem('isLoggedIn') === 'true';
}

function ensureAuth(page) {
  if (page !== 'login' && page !== 'signup' && !isLoggedIn()) {
    loadPage('login');
    return false;
  }
  return true;
}

function updateNavAuthLink() {
  const nav = document.querySelector('nav ul');
  if (!nav) return;
  const authLi = nav.querySelector('[data-auth-link]');
  if (authLi) nav.removeChild(authLi);
  const li = document.createElement('li');
  li.className = 'button';
  li.setAttribute('data-auth-link', '');
  if (isLoggedIn()) {
    li.innerHTML = '<a href="#" onclick="logout()">Logout</a>';
  } else {
    li.innerHTML = '<a href="#" onclick="loadPage(\'login\')">Login</a>';
  }
  nav.appendChild(li);
}

async function logout() {
  try {
    await window.supabaseHelpers.signOut();
  } catch (_) {}
  localStorage.removeItem('isLoggedIn');
  updateNavAuthLink();
  loadPage('login');
}

// Chatbot toggle function
function toggleChatbot() {
  const chatbot = document.getElementById('chatbot');
  const toggle = document.getElementById('chatbot-toggle');
  
  if (chatbot.style.display === 'none' || chatbot.style.display === '') {
    // Open chatbot
    chatbot.style.display = 'flex';
    toggle.style.display = 'none';
  } else {
    // Close chatbot
    chatbot.style.display = 'none';
    toggle.style.display = 'flex';
  }
}

// Function to reset chatbot to closed state
function resetChatbotState() {
  const chatbot = document.getElementById('chatbot');
  const toggle = document.getElementById('chatbot-toggle');
  
  if (chatbot) {
    chatbot.style.display = 'none';
  }
  if (toggle) {
    toggle.style.display = 'flex';
  }
}

// Ensure chatbot starts closed on page load
window.addEventListener('DOMContentLoaded', function() {
  resetChatbotState();
});

function loadPage(page) {
  if (!ensureAuth(page)) return;
  
  // Ensure chatbot stays closed when navigating between pages
  resetChatbotState();
  
  let content = document.getElementById("content");

  const pages = {
    home: `
    <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
      <h2 style = "text-align: center;">Welcome to Sanjivani College of Engineering, Kopargaon</h2>
      <p style = "text-align: center;">Providing quality education and fostering innovation for future engineers.</p>

      <h3 class="text-1xl font-bold text-[#0d47a1] text-left">Campus Satellite View :</h3>
      <div class="map-container">
        <iframe 
          src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3780.469272531774!2d74.4945034!3d19.9007494!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3bdc43dbfc8e40eb%3A0x5a84f8f3da9e8c2c!2sSanjivani%20College%20of%20Engineering!5e0!3m2!1sen!2sin!4v1724690000000!5m2!1sen!2sin&maptype=satellite" 
          width="100%" 
          height="400" 
          style="border:0; border-radius:12px;" 
          allowfullscreen 
          loading="lazy" 
          referrerpolicy="no-referrer-when-downgrade">
        </iframe>
      </div>

      <br>
      <a href="https://www.google.com/maps/place/Sanjivani+College+of+Engineering,+Kopargaon,+Maharashtra+423603/@19.9007494,74.4945034,17z" 
         target="_blank" 
         style="display:inline-block; margin-top:10px; padding:10px 20px; background:#004080; color:white; border-radius:6px; text-decoration:none;">
         Open in Google Maps
      </a>
    </div>
    `,

    signup: `
    <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
      <section class="min-h-[60vh] grid place-items-center">
        <div class="w-full max-w-md bg-white rounded-xl shadow p-6">
          <h2 class="text-2xl font-bold text-[#0d47a1] text-center">Create Account</h2>
          <div id="signup-message" class="text-center text-sm mt-2 text-gray-600"></div>
          <form id="signup-form" class="mt-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input id="signup-email" type="email" required class="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@example.com">
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input id="signup-password" type="password" minlength="6" required class="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="At least 6 characters">
            </div>
            <button id="signup-submit" type="submit" class="w-full py-2.5 bg-[#0d47a1] text-white rounded-lg hover:bg-[#0b3a86]">Sign up</button>
            <p class="text-center text-sm mt-2">Already have an account? <a href="#" onclick="loadPage('login')" class="text-blue-600">Login</a></p>
          </form>
        </div>
      </section>
    </div>
    `,
    classrooms: `
    <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
      <section class="max-w-7xl mx-auto">
        <h2 class="text-3xl font-bold text-[#0d47a1] text-center">Classrooms & Labs</h2>
        <p class="text-center text-gray-600 mt-2">Explore our campus facilities by building, floor, and department</p>
        
        <!-- Search Bar (themed rounded) -->
        <div class="mt-6 max-w-2xl mx-auto search-row">
          <div class="input-container">
            <input class="input" id="classroom-search" type="text" placeholder="Search classrooms, labs, or departments...">
            <span class="icon">🔍</span>
          </div>
        </div>

        <!-- Type Filter (hidden original; moved into selectors row below) -->
        <div class="mt-4 max-w-2xl mx-auto flex justify-start" style="display: none;">
          <div class="select" id="type-filter-hidden" data-default="All" data-one="Classrooms" data-two="Labs" data-three="Staff Rooms" data-four="Washroom (Boys)" data-five="Washroom (Girls)">
            <div class="selected">
              <svg class="arrow" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 448 512"><path d="M201.4 374.6c12.5 12.5 32.8 12.5 45.3 0l160-160c12.5-12.5 12.5-32.8 0-45.3s-32.8-12.5-45.3 0L224 306.7 86.6 169.4c-12.5-12.5-32.8-12.5-45.3 0s-12.5 32.8 0 45.3l160 160z"/></svg>
            </div>
            <div class="options">
              <div class="option">
                <input type="radio" name="type" id="all" value="all" checked>
                <label for="all" data-txt="All"></label>
              </div>
              <div class="option">
                <input type="radio" name="type" id="option-1" value="classroom">
                <label for="option-1" data-txt="Classrooms"></label>
              </div>
              <div class="option">
                <input type="radio" name="type" id="option-2" value="lab">
                <label for="option-2" data-txt="Labs"></label>
              </div>
              <div class="option">
                <input type="radio" name="type" id="option-3" value="staffroom">
                <label for="option-3" data-txt="Staff Rooms"></label>
              </div>
              <div class="option">
                <input type="radio" name="type" id="option-4" value="washroom-boys">
                <label for="option-4" data-txt="Washroom (Boys)"></label>
              </div>
              <div class="option">
                <input type="radio" name="type" id="option-5" value="washroom-girls">
                <label for="option-5" data-txt="Washroom (Girls)"></label>
              </div>
            </div>
          </div>
        </div>

        <!-- Building Tabs -->
        <div class="mt-8">
          <div class="flex flex-wrap justify-center gap-4 mb-6" style="display: none;">
            <div class="seg-wrapper">
              <div class="seg-option">
                <input class="seg-input building-tab" type="radio" name="building" id="bldg-engineering" data-building="engineering">
                <label class="seg-btn" for="bldg-engineering"><span class="seg-span">Engineering</span></label>
              </div>
              <div class="seg-option">
                <input class="seg-input building-tab" type="radio" name="building" id="bldg-itmba" data-building="it-mba">
                <label class="seg-btn" for="bldg-itmba"><span class="seg-span">IT/MBA</span></label>
              </div>
              <div class="seg-option">
                <input class="seg-input building-tab" type="radio" name="building" id="bldg-uni" data-building="uni">
                <label class="seg-btn" for="bldg-uni"><span class="seg-span">University</span></label>
              </div>
              <div class="seg-option">
                <input class="seg-input building-tab" type="radio" name="building" id="bldg-sims" data-building="sims">
                <label class="seg-btn" for="bldg-sims"><span class="seg-span">SIMS</span></label>
              </div>
              <div class="seg-option">
                <input class="seg-input building-tab" type="radio" name="building" id="bldg-diploma" data-building="diploma">
                <label class="seg-btn" for="bldg-diploma"><span class="seg-span">Diploma</span></label>
              </div>
              <div class="seg-option">
                <input class="seg-input building-tab" type="radio" name="building" id="bldg-pharmacy" data-building="pharmacy">
                <label class="seg-btn" for="bldg-pharmacy"><span class="seg-span">Pharmacy</span></label>
              </div>
              <div class="seg-option">
                <input class="seg-input building-tab" type="radio" name="building" id="bldg-junior" data-building="junior-college">
                <label class="seg-btn" for="bldg-junior"><span class="seg-span">Junior College</span></label>
              </div>
            </div>
          </div>

          <!-- Filter + Building + Floor/Department dropdown row -->
          <div class="mt-4 max-w-7xl mx-auto flex items-center justify-between gap-3 selectors-row">
            <!-- left: filter (already inserted above) -->
            <div class="flex-1 min-w-[240px]">
              <div class="popup" id="type-filter">
                <input id="filter-toggle" type="checkbox">
                <label class="burger" for="filter-toggle">
                  <span></span>
                  <span></span>
                  <span></span>
                </label>
                <nav class="popup-window">
                  <legend>Filter by</legend>
                  <ul>
                    <li><button type="button" data-filter-value="all">All</button></li>
                    <li><button type="button" data-filter-value="classroom">Classrooms</button></li>
                    <li><button type="button" data-filter-value="lab">Labs</button></li>
                    <hr>
                    <li><button type="button" data-filter-value="staffroom">Staff Rooms</button></li>
                    <li><button type="button" data-filter-value="washroom-boys">Washroom (Boys)</button></li>
                    <li><button type="button" data-filter-value="washroom-girls">Washroom (Girls)</button></li>
                  </ul>
                </nav>
              </div>
            </div>
            <!-- right: selectors (building, then dropdowns) -->
            <div class="controls-inline">
              <!-- building selector (moved here) -->
              <div class="seg-wrapper" id="building-tabs">
                <div class="seg-option">
                  <input class="seg-input building-tab" type="radio" name="building" id="bldg2-engineering" data-building="engineering">
                  <label class="seg-btn" for="bldg2-engineering"><span class="seg-span">Engineering</span></label>
                </div>
                <div class="seg-option">
                  <input class="seg-input building-tab" type="radio" name="building" id="bldg2-sims" data-building="sims">
                  <label class="seg-btn" for="bldg2-sims"><span class="seg-span">SIMS</span></label>
                </div>                
                <div class="seg-option">
                  <input class="seg-input building-tab" type="radio" name="building" id="bldg2-itmba" data-building="it-mba">
                  <label class="seg-btn" for="bldg2-itmba"><span class="seg-span">IT/MBA</span></label>
                </div>
                <div class="seg-option">
                  <input class="seg-input building-tab" type="radio" name="building" id="bldg2-uni" data-building="uni">
                  <label class="seg-btn" for="bldg2-uni"><span class="seg-span">University</span></label>
                </div>
                <div class="seg-option">
                  <input class="seg-input building-tab" type="radio" name="building" id="bldg2-diploma" data-building="diploma">
                  <label class="seg-btn" for="bldg2-diploma"><span class="seg-span">Diploma</span></label>
                </div>
                <div class="seg-option">
                  <input class="seg-input building-tab" type="radio" name="building" id="bldg2-pharmacy" data-building="pharmacy">
                  <label class="seg-btn" for="bldg2-pharmacy"><span class="seg-span">Pharmacy</span></label>
                </div>
                <div class="seg-option">
                  <input class="seg-input building-tab" type="radio" name="building" id="bldg2-junior" data-building="junior-college">
                  <label class="seg-btn" for="bldg2-junior"><span class="seg-span">Junior College</span></label>
                </div>
          </div>

              <!-- floor dropdown -->
              <div class="min-w-[160px]">
                <select id="floor-select" class="selector-select">
                  <option value="">Select floor</option>
                </select>
              </div>

              <!-- department dropdown -->
              <div class="min-w-[180px]">
                <select id="department-select" class="selector-select">
                  <option value="">Select department</option>
                </select>
              </div>
            </div>
          </div>

          <!-- Classrooms Grid -->
          <div id="classrooms-grid" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            <!-- Dynamic content will be loaded here -->
          </div>
        
        <!-- Indoor Navigation Section -->
        <div class="mt-8 mb-6">
          <div class="bg-gradient-to-r from-[#0d47a1] to-[#0b3a86] rounded-xl p-6 text-white">
            <h3 class="text-2xl font-bold mb-4 text-center">🏢 Indoor Navigation</h3>
            <p class="text-center text-blue-100 mb-6">Interactive floor plan to help you navigate the building</p>
            
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Floor Plan Visual -->
              <div class="bg-white bg-opacity-10 rounded-lg p-4">
                <h4 class="text-lg font-semibold mb-3 text-center">📍 Engineering Building Floor Plan</h4>
                <div class="bg-white rounded-lg p-2 min-h-[300px] flex items-center justify-center">
                  <div id="indoor-plan-wrap" style="position:relative; width:100%; max-width:880px;">
                    <img id="indoor-floor-img" src="./Ground Floor(Engg. Building).png" alt="Floor Plan" style="width:100%; height:auto; display:block; border-radius:8px;">
                    <canvas id="indoor-overlay" style="position:absolute; inset:0; width:100%; height:100%; pointer-events:none;"></canvas>
                  </div>
                </div>
                <div class="mt-2 flex justify-center gap-2">
                  <button id="indoor-change-floor" class="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-all">🔁 Change Floor</button>
                  <button id="indoor-previous-step" class="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-all">⬅️ Previous Step</button>
                  <button id="indoor-next-step" class="bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg px-4 py-2 transition-all">➡️ Next Step</button>
                </div>
                <div id="navigation-step-info" class="mt-3 text-center text-blue-100 text-sm hidden">
                  <div id="step-counter" class="font-semibold"></div>
                  <div id="step-description" class="mt-1"></div>
                </div>
              </div>
              
              <!-- Navigation Tools -->
              <div class="space-y-4">
                <div class="bg-white bg-opacity-10 rounded-lg p-4">
                  <h4 class="text-lg font-semibold mb-3">🧭 Indoor Navigation</h4>
                  <div class="grid grid-cols-1 gap-3">
                    <div>
                      <label class="block text-sm text-blue-100 mb-1">Floor</label>
                      <select id="indoor-floor-select" class="selector-select w-full">
                        <option value="ground">Ground Floor</option>
                        <option value="first">1st Floor</option>
                        <option value="second">2nd Floor</option>
                      </select>
                    </div>
                    <div>
                      <label class="block text-sm text-blue-100 mb-1">Current location</label>
                      <input id="indoor-start-input" class="chatbot-input w-full" placeholder="Type or pick current location" list="indoor-start-list" />
                      <datalist id="indoor-start-list"></datalist>
                    </div>
                    <div>
                      <label class="block text-sm text-blue-100 mb-1">Destination</label>
                      <input id="indoor-end-input" class="chatbot-input w-full" placeholder="Type or pick destination" list="indoor-end-list" />
                      <datalist id="indoor-end-list"></datalist>
                    </div>
                    <div class="flex gap-2">
                      <button id="indoor-draw-route" class="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-left transition-all">➡️ Draw Route</button>
                      <button id="indoor-clear-route" class="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-left transition-all">♻️ Clear</button>
                    </div>
                    <div class="flex gap-2">
                      <button id="indoor-scan-text" class="w-full bg-white bg-opacity-20 hover:bg-opacity-30 rounded-lg p-3 text-left transition-all">🧠 Scan Floor Text (OCR)</button>
                    </div>
                    <div>
                      <textarea id="indoor-ocr-output" class="w-full border rounded-md p-2 text-sm" rows="5" placeholder="Detected text will appear here..."></textarea>
                    </div>
                  </div>
                </div>

                

                <div class="bg-white bg-opacity-10 rounded-lg p-4">
                  <h4 class="text-lg font-semibold mb-3">ℹ️ Tips</h4>
                  <ul class="text-sm text-blue-100 list-disc pl-5 space-y-1">
                    <li>Switch floors to use the correct floor image from this folder.</li>
                    <li>Add POIs once, they persist in this browser.</li>
                    <li>Pick current and destination, then Draw Route.</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
        </div>

        <!-- Classroom Detail Modal -->
        <div id="classroom-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-4">
                <h3 id="modal-title" class="text-2xl font-bold text-[#0d47a1]"></h3>
                <button onclick="closeClassroomModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              <div id="modal-content"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
    `,
    departments: `
    <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
      <section class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-[#0d47a1] text-center">Departments</h2>
        <p class="text-center text-gray-600 mt-2">Explore our engineering and management departments</p>
        
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('computer-engineering')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">💻</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Computer Engineering</h3>
              <p class="text-gray-100 font-semibold text-sm">Software, hardware, and innovation in computing</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('information-technology')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">🖥️</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Information Technology</h3>
              <p class="text-gray-100 font-semibold text-sm">IT infrastructure, networking, and security</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('mechanical-engineering')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">⚙️</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Mechanical Engineering</h3>
              <p class="text-gray-100 font-semibold text-sm">Design, manufacturing, and mechanics</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('mechatronics-engineering')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">🤖</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Mechatronics Engineering</h3>
              <p class="text-gray-100 font-semibold text-sm">Mechanics, electronics, and computing</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('civil-engineering')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">🏗️</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Civil Engineering</h3>
              <p class="text-gray-100 font-semibold text-sm">Construction, planning, and infrastructure</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('structural-engineering')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">🏢</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Structural Engineering</h3>
              <p class="text-gray-100 font-semibold text-sm">Safe, strong and stable structures</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('electronics-computer-engineering')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">🔌</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Electronics & Computer Engineering</h3>
              <p class="text-gray-100 font-semibold text-sm">Electronics with computer systems and automation</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('electrical-engineering')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">💡</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">Electrical Engineering</h3>
              <p class="text-gray-100 font-semibold text-sm">Power systems, circuits, and energy solutions</p>
            </div>
          </div>

          <div class="dept-card bg-white rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer p-6" onclick="showDeptOptions('mba')">
            <div class="text-center">
              <span class="text-5xl mb-4 block">📈</span>
              <h3 class="text-xl font-semibold text-[#ffffff] mb-2">MBA</h3>
              <p class="text-gray-100 font-semibold text-sm">Business management and administration</p>
            </div>
          </div>
        </div>

        

        <!-- Department Options Modal -->
        <div id="dept-options-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 id="dept-options-title" class="text-2xl font-bold text-[#0d47a1]"></h3>
                <button onclick="closeDeptOptionsModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              
              <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div class="bg-blue-50 rounded-lg p-4 cursor-pointer hover:bg-blue-100 transition-colors" onclick="showDeptDetails('labs')">
                  <div class="text-center">
                    <span class="text-4xl mb-2 block">🔬</span>
                    <h4 class="font-semibold text-[#0d47a1]">Laboratories</h4>
                    <p class="text-sm text-gray-600 mt-1">View department labs</p>
                  </div>
                </div>
                
                <div class="bg-green-50 rounded-lg p-4 cursor-pointer hover:bg-green-100 transition-colors" onclick="showDeptDetails('hod')">
                  <div class="text-center">
                    <span class="text-4xl mb-2 block">👨‍💼</span>
                    <h4 class="font-semibold text-[#0d47a1]">HOD's Desk</h4>
                    <p class="text-sm text-gray-600 mt-1">Head of Department</p>
                  </div>
                </div>
                
                <div class="bg-purple-50 rounded-lg p-4 cursor-pointer hover:bg-purple-100 transition-colors" onclick="showDeptDetails('faculty')">
                  <div class="text-center">
                    <span class="text-4xl mb-2 block">👨‍🏫</span>
                    <h4 class="font-semibold text-[#0d47a1]">Faculty</h4>
                    <p class="text-sm text-gray-600 mt-1">Department faculty</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Department Details Modal -->
        <div id="dept-details-modal" class="fixed inset-0 bg-black bg-opacity-50 z-50 hidden flex items-center justify-center p-4">
          <div class="bg-white rounded-xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div class="p-6">
              <div class="flex justify-between items-center mb-6">
                <h3 id="dept-details-title" class="text-2xl font-bold text-[#0d47a1]"></h3>
                <button onclick="closeDeptDetailsModal()" class="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
              </div>
              <div id="dept-details-content"></div>
            </div>
          </div>
        </div>
      </section>
    </div>
    `,

    ratings: `
    <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
      <section class="max-w-6xl mx-auto">
        <h2 class="text-3xl font-bold text-[#0d47a1] text-center">Ratings</h2>
        <p class="text-center text-gray-600 mt-2">Share experiences about hostels, canteens and cafe.</p>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
          <div class="bg-white rounded-xl shadow p-6">
            <h3 class="text-xl font-semibold text-[#0d47a1]">Hostels</h3>
            <div class="mt-3" id="hostel-stars">
              <div class="rating" data-group="hostel">
                ${[5,4,3,2,1].map(i => `
                  <input type="radio" id="hostel-star-${i}" name="rating-hostel" value="${i}">
                  <label for="hostel-star-${i}" aria-label="${i} stars">
                    <svg viewBox="0 0 24 24" stroke-width="1">
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.71 1.548 8.266L12 18.896l-7.484 4.386 1.548-8.266L0 9.306l8.332-1.151z"/>
                    </svg>
                  </label>
              `).join('')}
              </div>
            </div>
            <textarea id="hostel-review" class="w-full mt-4 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" rows="3" placeholder="Write your hostel review..."></textarea>
            <button class="mt-3 px-4 py-2 bg-[#0d47a1] text-white rounded hover:bg-[#0b3a86]" onclick="submitRating('hostel')">Submit</button>
            <div class="mt-4" id="hostel-list"></div>
          </div>

          <div class="bg-white rounded-xl shadow p-6">
            <h3 class="text-xl font-semibold text-[#0d47a1]">Canteens & Cafe</h3>
            <div class="mt-3" id="food-stars">
              <div class="rating" data-group="food">
                ${[5,4,3,2,1].map(i => `
                  <input type="radio" id="food-star-${i}" name="rating-food" value="${i}">
                  <label for="food-star-${i}" aria-label="${i} stars">
                    <svg viewBox="0 0 24 24" stroke-width="1">
                      <path d="M12 .587l3.668 7.568 8.332 1.151-6.064 5.71 1.548 8.266L12 18.896l-7.484 4.386 1.548-8.266L0 9.306l8.332-1.151z"/>
                    </svg>
                  </label>
              `).join('')}
              </div>
            </div>
            <textarea id="food-review" class="w-full mt-4 border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" rows="3" placeholder="Write your canteen/cafe review..."></textarea>
            <button class="mt-3 px-4 py-2 bg-[#0d47a1] text-white rounded hover:bg-[#0b3a86]" onclick="submitRating('food')">Submit</button>
            <div class="mt-4" id="food-list"></div>
          </div>
        </div>
      </section>
    </div>
    `,

    login: `
    <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
      <section class="min-h-[60vh] grid place-items-center">
        <div class="w-full max-w-md bg-white rounded-xl shadow p-6">
          <h2 class="text-2xl font-bold text-[#0d47a1] text-center">Login</h2>
          <div id="login-message" class="text-center text-sm mt-2 text-gray-600"></div>
          <form id="login-form" class="mt-6 space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Email</label>
              <input id="login-email" type="email" required class="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="you@example.com">
        </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Password</label>
              <input id="login-password" type="password" required class="mt-1 w-full border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-blue-400" placeholder="••••••••">
        </div>
            <div class="flex items-center justify-between">
              <label class="inline-flex items-center gap-2 text-sm text-gray-700">
                <input type="checkbox" class="rounded border-gray-300"> Remember me
              </label>
              <a href="#" class="text-sm text-blue-600 hover:underline">Forgot?</a>
      </div>
            <button id="login-submit" type="submit" class="w-full py-2.5 bg-[#0d47a1] text-white rounded-lg hover:bg-[#0b3a86]">Sign in</button>
            <p class="text-center text-sm mt-2">New user? <a href="#" onclick="loadPage('signup')" class="text-blue-600">Create an account</a></p>
          </form>
        </div>
      </section>
    </div>
    `,

    about: `
      <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 class="text-2xl font-bold text-[#0d47a1] text-center">About Us</h2>
        <p class="text-center text-gray-600 text-sm mt-3">
          Sanjivani College of Engineering, Kopargaon, established in 1983, is one of the premier institutions in Maharashtra providing quality technical education.
        </p>
        <p class="text-center text-gray-600 text-sm mt-2">
          We aim to nurture talent, encourage research, and create future-ready engineers.
        </p>
      </div>
    `,

    contact: `
      <div class="bg-white rounded-xl shadow-lg p-6 mt-8">
        <h2 class="text-2xl font-bold text-[#0d47a1] text-center">Contact Us</h2>
        <p class="text-center text-gray-600 text-sm mt-3">
          <strong>Address:</strong> Sanjivani College of Engineering, Kopargaon, Maharashtra 423603
        </p>
        <p class="text-center text-gray-600 text-sm mt-2">
          <strong>Email:</strong> info@sanjivani.org.in
        </p>
        <p class="text-center text-gray-600 text-sm mt-2">
          <strong>Phone:</strong> +91-2423-222-862
        </p>
      </div>
    `
  };

  content.innerHTML = pages[page];

  // Page initializers
  if (page === 'ratings') {
    initRatingsPage();
  }
  if (page === 'login') {
    initLoginPage();
  }
  if (page === 'signup') {
    initSignupPage();
  }
  if (page === 'classrooms') {
    initClassroomsPage();
  }
}

// Load login first unless already logged in (sync with Supabase session)
window.onload = async () => {
  try {
    const session = await window.supabaseHelpers.getSession();
    if (session) {
      localStorage.setItem('isLoggedIn', 'true');
    }
  } catch (_) {}
  updateNavAuthLink();
  if (isLoggedIn()) {
    loadPage('home');
  } else {
    loadPage('login');
  }
};

// ----- Department Data and Functions -----
const departmentData = {
  'computer-engineering': {
    name: 'Computer Engineering',
    description: 'Focuses on software, hardware, and innovation in computing',
    labs: [
      'Software Lab 1',
      'Software Lab 2',
      'Unix Lab',
      'Advance Development Tool Lab',
      'Programming Lab 1 / Virtusa Lab',
      'Centre of Data Science',
      'Network Lab',
      'Network Lab / Staff Room',
      'PG Lab',
      'High Performance Computing Lab (HPC Lab)',
      'Project Lab',
      'Engineering Physics Lab',
      'Language Lab'
    ],
    hod: {
      name: 'Prof. Dr. M A Jawale',
      qualification: 'Ph.D. in Computer Engineering',
      experience: '22 years',
      specialization: 'Computer Engineering',
      email: 'hod.comp@sanjivani.org.in',
      message: 'Welcome to Computer Engineering Department. We focus on practical learning with industry-relevant curriculum and strong placement support.',
      photo: "https://sanjivanicoe.org.in/media/k2/items/cache/bebada99aaa9847746eea59472544575_S.jpg?t=20250814_064249"
    },
    faculty: [
      { name: 'Prof. Dr. M A Jawale', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo: "https://sanjivanicoe.org.in/media/k2/items/cache/bebada99aaa9847746eea59472544575_S.jpg?t=20250814_064249" },
      { name: 'Dr. A.B.Pawar', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/42121f00ffc451d0c288e11c1f28cbd4_S.jpg?t=20250814_064435" },
      { name: 'Dr. P. N. Kalavadekar', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/737344dd8934cc52da9f7f85f2627abb_S.jpg?t=20250814_064444" },
      { name: 'Dr. B. J. Dange', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/0d0c19531d6e29f793ed165732978408_S.jpg?t=20250812_161726" },
      { name: 'Dr. T. Bhaskar', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d48ed900e79fa9547169c26138b4cd8d_S.jpg?t=20250807_172249" },
      { name: 'Dr. A. V. Brahmane', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/780149ddfa09fbd86eb140fe6810d770_S.jpg?t=20250812_161834"  },
      { name: 'Dr. S. R. Deshmukh', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/267b1948fa84309bc99f9c0289cabe44_S.jpg?t=20250814_064233" },
      { name: 'Dr. S. N. Gunjal', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/852967248dd3e6cb3942a1fe6af42945_S.jpg?t=20250814_065220" },
      { name: 'Dr. H. E. Khodke', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/245effadf41c6129f4fe7accc564ef86_S.jpg?t=20250814_065157" },
      { name: 'Prof. N. G. Pardeshi', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/3707d8f2be163bd14c78cf07586f13bb_S.jpg?t=20250814_065146" },
      { name: 'Prof. J. N. Kale', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/aaa082d2257ab65aecf61c2340e9c5b9_S.jpg?t=20250814_064735" },
      { name: 'Prof. V. N. Nirgude', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/deb45d333d0414ba3de42155789fdb4a_S.jpg?t=20250814_064702" },
      { name: 'Dr. A.S.Bodhe', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/68b62085e41e8f225811766f8d5eb2bb_S.jpg?t=20250814_064647" },
      { name: 'Prof. B. B. Kotame', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/1698b847c2e4fe98c05adcdc9d420590_S.jpg?t=20250814_064636" },
      { name: 'Prof. A. D. Sangale', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/3749aaa8ee129d7e919bddcc7e09cd36_S.jpg?t=20250814_064622" },
      { name: 'Prof. Monika Agrawal', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/deb9f9efc56ef2a940bdf0d58ccaad5c_S.jpg?t=20250814_064613" },
      { name: 'Prof. A.B.Mokal', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/63955aa9869cf7707ada1662dbfb31e2_S.jpg?t=20250814_064605" },
      { name: 'Prof. P.B.Dhanwate', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/dbe05350458c15fa6c802fb686391131_S.jpg?t=20250814_145310" },
      { name: 'Ms. Swapnali Sunil Gawali', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/873514e130e46a244b5aae0b135db01f_S.jpg?t=20250814_064538"},
      { name: 'Prof. P.M.Dhanrao', qualification: 'M.Tech', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/ea82697ed9755e975f3c7d735db2070c_S.jpg?t=20250814_150619" },
      { name: 'Prof. J.Eshwari', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/3dcbd8056f504532259e733a4b9e2ae3_S.jpg?t=20250814_151106" },
      { name: 'Prof. S. A. Shivarkar', qualification: 'M.Tech', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/00e7056ec788d5b42162a6c13dbba43c_S.jpg?t=20250814_065712" },
      { name: 'Dr. Rahul Gaikwad', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/e529a8dc22bd84a37f6f8ae6b8ce40d3_S.jpg?t=20250814_064455" }
    ],
    associations: ['ACES (Association of Computer Engineering Students)'],
    achievements: 'NBA Accredited, Strong placement record'
  },
  'information-technology': {
    name: 'Information Technology',
    description: 'Specializes in IT infrastructure, networking, and security',
    labs: [
      'IT Infrastructure Lab',
      'Network Security Lab',
      'Database Systems Lab',
      'Web Development Lab',
      'Mobile Application Lab',
      'Cloud Computing Lab',
      'Information Security Lab',
      'System Administration Lab'
    ],
    hod: {
      name: 'Prof. Dr. M A Jawale',
      qualification: 'Ph.D. in Computer Engineering',
      experience: '22 years',
      specialization: 'Computer Engineering',
      email: 'hod.it@sanjivani.org.in',
      message: 'Information Technology Department emphasizes on cutting-edge technologies and industry partnerships for better career opportunities.', 
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/bebada99aaa9847746eea59472544575_S.jpg?t=20250814_064249"
    },
    faculty: [
      { name: 'Prof. Dr. M A Jawale', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/bebada99aaa9847746eea59472544575_S.jpg?t=20250814_064249" },
      { name: 'Mr. A. A. Barbind', qualification: 'M.E', specialization: 'Electronics', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/e9c724eeb5636d1c1c1a2c2e85d40377_S.jpg?t=20250807_174644" },
      { name: 'Mr. R. N. Kankrale', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/9415f9bcd76598f9c08127db1641b596_S.jpg?t=20250807_173252" },
      { name: 'Dr. R. R. Nikam', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/83c2446a0896df0a1f4af01c940ae1d9_S.jpg?t=20250807_174528" },
      { name: 'Dr. R. D. Chintamni', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/00d9b1e39f02d57be65ad2a9a6eaa3b8_S.jpg?t=20250807_173342" },
      { name: 'Dr. Y. S. Deshmukh', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/339a0e1449b6b4062056bc300d87e893_S.jpg?t=20250807_162308" },
      { name: 'Mrs. K. D. Patil', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/954fb0ebf1d84fb921bfb0b6e045d57f_S.jpg?t=20250807_174326" },
      { name: 'Dr. N. S. Patankar', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/0548677e6432786dd8df61eb3aaec139_S.jpg?t=20250807_173858" },
      { name: 'Dr. C. D. Bawankar', qualification: 'Ph.D.', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d3b3799d6611d677944f5f86a500beb3_S.jpg?t=20250807_174608" },
      { name: 'Mrs. M. S. Kurhe', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/500a44935c8320008f1c713a63e32b8e_S.jpg?t=20250807_174239" },
      { name: 'Mr. N. L. Shelake', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d65085d854a39feae81a41eb458281c5_S.jpg?t=20250807_174040" },
      { name: 'Mr. S. Muthuraj', qualification: 'M.Tech', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/157c6c6cd616f458d56a6caf427711f8_S.jpg?t=20250807_174146" },
      { name: 'Mr. U. B. Sangule', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7ab716354432ee12f19b58c60471093b_S.jpg?t=20250807_173117" },
      { name: 'Mrs. B. B. Pawar', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/eb9b7452cdc806568d2312ea5614a301_S.jpg?t=20250807_172025" },
      { name: 'Miss. P. G.Thakre', qualification: 'M.Tech', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/8b0dca3b357fcee94cf1b8a6c08994ea_S.jpg?t=20250807_173512" },
      { name: 'Mr. S. H. Darekar', qualification: 'M.E', specialization: 'Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/e9f3064a37460e22935d3df9e26e53bb_S.jpg?t=20250807_172830" }
    ],
    associations: ['C.S.I.', 'I.T.E.R.A'],
    achievements: 'Strong industry partnerships, Excellent placement record'
  },
  'mechanical-engineering': {
    name: 'Mechanical Engineering',
    description: 'Deals with design, manufacturing, and mechanics',
    labs: [
      'Manufacturing Science Lab',
      'Thermal Lab 1',
      'Thermal Lab 2',
      'Machine Lab',
      'Metallurgy Lab',
      'Fluid Mechanics Lab',
      'Geotechnical Engineering Lab',
      'CAD Lab 1',
      'CAD Lab 2',
      'Industry 4.0 Lab',
      'Automation Lab'
    ],
    hod: {
      name: 'Dr. P. M. Patare',
      qualification: 'Ph.D. in Mechanical Engineering',
      experience: '21 years',
      specialization: 'Mechanical Engineering, Machine Design',
      email: 'hod.mech@sanjivani.org.in',
      message: 'Mechanical Engineering Department provides hands-on experience with modern manufacturing technologies and strong industry collaboration.', 
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/5288462d048e0d3f60f64bb84cff6df4_S.jpg?t=20250814_042353"
    },
    faculty: [
      { name: 'Dr. P. M. Patare', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/5288462d048e0d3f60f64bb84cff6df4_S.jpg?t=20250814_042353" },
      { name: 'Dr. S. V. Bhaskar', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/576492c356d8e0278dfa7b752bad5bc8_S.jpg?t=20250814_042429" },
      { name: 'Dr. S. S. Ingle', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/dd34e32172fe0202ef287e574244e1d2_S.jpg?t=20250814_042444" },
      { name: 'Dr. S. P. Palekar', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/f8091000de3f026d209837e21bc2e700_S.jpg?t=20250814_042508" },
      { name: 'Dr. L. S. Dhamande', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/e2acd849d365015ef08ef5b696dc9e31_S.jpg?t=20250814_042520" },
      { name: 'Dr. D. P. Bhaskar', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/f0ba2bfd8f936a77d3b146acfe9443c7_S.jpg?t=20250814_042532" },
      { name: 'Dr. K. C. Bhosale', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/ce7646a74c54cecf1c05442c71f02147_S.jpg?t=20250814_042623" },
      { name: 'Mr. P. W. Ingle', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/b1d237aad44a95e3871fc116e6241517_S.jpg?t=20250814_144756" },
      { name: 'Mr. H. P. Varade', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/0d1fd34f22c9730e91eb5170fbddc114_S.jpg?t=20250814_042955" },
      { name: 'Mr. Y. H. Ahire', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/56dab2b3675237b0ba79395c67ee9ae4_S.jpg?t=20250814_043021" },
      { name: 'Mr.V. P. Bhaurkar', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/5fa21cd9e0d2531a2f1dfdffbab46f70_S.jpg?t=20250814_043038" },
      { name: 'Dr. I. I. Sayyad', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/ee68a9df1200997b07be8fb0bbdb9f29_S.jpg?t=20250814_043054" },
      { name: 'Mr. Y. A. Bhavsar', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/461011bcaf5b5e723e897c33f049f169_S.jpg?t=20250814_043222" },
      { name: 'Mr. N. D. Sadaphal', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7acce66d40ec90c2d61987b409cbf850_S.jpg?t=20250814_043238" },
      { name: 'Dr. S. R. Thorat', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/47674e109b85ae6495880f2604f34f58_S.jpg?t=20250814_043257" },
      { name: 'Mrs. S. M. Gujrathi', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/29766e2a37e979b18d18c428ff9c5aba_S.jpg?t=20250814_043313" },
      { name: 'Mr. A. A. Joshi', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/0dc247c07eee71a72cf9409729fb3455_S.jpg?t=20250815_091222" },
      { name: 'Mr. V.J Suryawanshi', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/171fc14b49a79ea979710de5b3402b30_S.jpg?t=20250814_043345" },
      { name: 'Mr.P. A. Bojage', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/c10c64c27e0606d1654b81b9bb482558_S.jpg?t=20250814_043412" },
      { name: 'Mr. N. S. Surner', qualification: 'M.Tech', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/211fb1d06f9479a7650fc3bb47b93c8b_S.jpg?t=20250814_043533" },
      { name: 'Mr. J. B. Ashtekar', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/cf4507ae4969876df39b5f798b6f40ce_S.jpg?t=20250814_043557" },
      { name: 'Mr. P. N. Patil', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7293a47c0f4cdddd46ff10bcf3d23287_S.jpg?t=20250814_043616" },
      { name: 'Dr. A. D. Wable', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/53bed31cb74891ae64a31e4c592ef86d_S.jpg?t=20250814_043627" },
      { name: 'Mr. R. S. Kolhe', qualification: 'M.E.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/47359a90eed3ee35f2dab5a3c718abb3_S.jpg?t=20250814_043801" }
    ],
    associations: ['M.E.S.A.', 'S.A.E.', 'ISHRAE'],
    achievements: 'NBA Accredited, Strong R&D activities, Patent achievements'
  },
  'mechatronics-engineering': {
    name: 'Mechatronics Engineering',
    description: 'Combines mechanics, electronics, and computing',
    labs: [
      'Robotics Lab',
      'Control Systems Lab',
      'Microcontroller Lab',
      'Automation Lab',
      'PLC Lab',
      'Sensors & Actuators Lab',
      'Embedded Systems Lab',
      'Industrial Automation Lab'
    ],
    hod: {
      name: 'Dr. R .A. Kapgate',
      qualification: 'Ph.D. in Mechanical Engineering',
      experience: '21.5 years',
      specialization: 'Mechanical Engineering',
      email: 'hod.mechatronics@sanjivani.org.in',
      message: 'Mechatronics Engineering combines mechanical, electrical, and computer engineering for innovative automation solutions.', 
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7a6409a35f8223f856dc99651cb33cb1_S.jpg?t=20250813_041156"
    },
    faculty: [
      { name: 'Dr. R .A. Kapgate', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7a6409a35f8223f856dc99651cb33cb1_S.jpg?t=20250813_041156" },
      { name: 'Dr. S. M. Kadam', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/5f9ec0b2e765a617089a13fe6f9b5c6d_S.jpg?t=20250813_041224" },
      { name: 'Dr. S. S. Kulkarni', qualification: 'Ph.D.', specialization: 'Electronics Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/ae265ec8d02add74bcb0f72e47ec001b_S.jpg?t=20250813_041723" },
      { name: 'Dr. Naveen Kumar', qualification: 'Ph.D.', specialization: 'Materials Science- Powder Metallurgy', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7fb770f34c796f7501d3cf0f0dc39075_S.jpg?t=20250813_041805" },
      { name: 'Dr. Sachin S. Raj', qualification: 'Ph.D.', specialization: 'Mechanical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/18bdd04e288fc232234be2fb5ea8bf38_S.jpg?t=20250830_083538" },
      { name: 'Mr. A. A. Kondekar', qualification: ' M.E.', specialization: 'Digital Electronics', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d81dde7813bd99a2f6a5498a2ec932ec_S.jpg?t=20250813_041954" },
      { name: 'Ms. S. C. Bhangale', qualification: 'M.E.', specialization: 'Electronics Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/f41bf091a4e18f2312495cc0e975d9f7_S.jpg?t=20250813_044532" },
      { name: 'Mr. Yogesh Dighe', qualification: 'M.E.', specialization: 'Design Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/79e08f32fa8a036f84441baab7b7a7ff_S.jpg?t=20250813_042237" },
      { name: 'Ms. P. A. Thorat', qualification: 'M.E.', specialization: 'Design Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/34570ba96cc3a4daee50221a47a4e2ec_S.jpg?t=20250813_042409" },
      { name: 'Mr.S. V. Fartale', qualification: 'M.E.', specialization: 'Design Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/69bc9c3e85c501b0a6208cc7a55abbf9_S.jpg?t=20250813_042558" },
      { name: 'Mr. G. A. Bhatane', qualification: 'M.E.', specialization: 'E & TC', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/c1011ef61ed9937904f4938c63d014ea_S.jpg?t=20250813_042638" }
    ],
    associations: ['Student Technical Society'],
    achievements: 'Innovation in teaching, Strong industry collaboration'
  },
  'civil-engineering': {
    name: 'Civil Engineering',
    description: 'Focuses on construction, planning, and infrastructure',
    labs: [
      'Engineering Environment Lab',
      'Geology Lab',
      'P.G. Research Lab',
      'CAD Lab 1',
      'Surveying Lab',
      'Hydraulics Lab'
    ],
    hod: {
      name: 'Dr. A.S.Sayyad',
      qualification: 'Ph.D. in Structural Engineering',
      experience: '16 years',
      specialization: 'Structural Engineering, Structural Design',
      email: 'hod.civil@sanjivani.org.in',
      message: 'Civil Engineering Department focuses on sustainable infrastructure development and modern construction technologies.',
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/df1da44862bfbe0dd2169e4d14570593_S.jpg?t=20250812_135441"
    },
    faculty: [
      { name: 'Dr. A. S. Sayyad', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/df1da44862bfbe0dd2169e4d14570593_S.jpg?t=20250812_135441" },
      { name: 'Dr. C. L. Jejurkar', qualification: 'Ph.D.', specialization: 'Water Resources Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/464131a32be92db1eb03bd70266fdd38_S.jpg?t=20250812_135528" },
      { name: 'Dr. S. V. Patankar', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/a9ccd7cd1c4267a50c67ac0bd7180172_S.jpg?t=20250812_135552" },
      { name: 'Dr. S. M. Ghumare', qualification: 'Ph.D.', specialization: 'Civil Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/1d36d23b156ead252433d4ce2c21c387_S.jpg?t=20250812_135617" },
      { name: 'Dr. V. V. Sasane', qualification: 'Ph.D.', specialization: 'Civil Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7f2cd38b7681e6e2ef83b5a7a5385264_S.jpg?t=20250812_135635" },
      { name: 'Dr. A. V. Deshpande', qualification: 'Ph.D.', specialization: 'Geology', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d063d8b7c1471349d2847c26ce4e4d8c_S.jpg?t=20250812_135653" },
      { name: 'Prof. D. D. More', qualification: 'M.E.', specialization: 'Structures', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/910084c4eb3461ee8947cd42bdd4b146_S.jpg?t=20250812_135709" },
      { name: 'Dr. S. R. Korake', qualification: 'Ph.D.', specialization: 'Civil Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/5d9bd784bfd234610bf8ba15e7ad6a4e_S.jpg?t=20250812_135725" },
      { name: 'Prof. P. P. Dange', qualification: 'M.E.', specialization: 'Construction Management', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/be7685026070406a215779b242f1aa2e_S.jpg?t=20250812_135740" },
      { name: 'Prof. S. R. Nawale', qualification: 'M.E.', specialization: 'Structures', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/8da476f72f06a276b1f930cdb28c21f1_S.jpg?t=20250812_135758" },
      { name: 'Prof. A. V. Ghogare', qualification: 'M.E.', specialization: 'Structures', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/f60a47f7792630a3a86bc14c0657e89c_S.jpg?t=20250812_135820" },
      { name: 'Dr. V. M. Mahajan', qualification: 'Ph.D.', specialization: 'Environmental Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/9ded0288e863fbe79d863f606cb05c21_S.jpg?t=20250812_135833" },
      { name: 'Prof. V. S. Chaudhari', qualification: 'M.E.', specialization: 'Environmental Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/8dc425b2acbf9c68064b8a63eae1ffbc_S.jpg?t=20250812_135847" },
      { name: 'Prof. K. D. Petare', qualification: 'M.Sc', specialization: 'Geology', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/4ab4b6df96c060fa741e97b50eafb07c_S.jpg?t=20250812_135858" },
      { name: 'Prof.M.R.Shaikh', qualification: 'M.E.', specialization: 'Geotechnical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/ee760d1c1474fde7f8f71a96b2452e29_S.jpg?t=20250812_135914" },
      { name: 'Prof. R. V. Kolhe', qualification: 'M.Tech', specialization: 'Construction Management', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/45e8f4939bc3bd36e4b87ab1e324d227_S.jpg?t=20250812_135932" },
      { name: 'Mr. Gaikwad Ashish Raosaheb', qualification: 'M.E.', specialization: 'Civil Environmental Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/85b62d4a27ea43297eb1ab349b6e06c6_S.jpg?t=20250812_135946" },
      { name: 'Mr. N. B. Aher', qualification: 'M.E.', specialization: 'Environmental Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/cd66a7a18d37d7e5dd969c249e9a1ecb_S.jpg?t=20250812_135957"},
      { name: 'Ms. Areen Khan', qualification: 'M.Tech', specialization: 'Geotechnical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7ae73efe4c50580e061849ef2d5b5ea4_S.jpg" },
      { name: 'Mr. M. M. Gangadware', qualification: 'M.E.', specialization: 'Environmental Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/60cac5bf67bfb0259c686e8da95fd599_S.jpg" },
    ],
    associations: ['CESA', 'Industrial Visits'],
    achievements: 'Research Centre, Sanjivani Programs, Strong placement record'
  },
  'structural-engineering': {
    name: 'Structural Engineering',
    description: 'Ensures structures are safe, strong and stable',
    labs: [
      'Structural Analysis Lab',
      'Concrete Technology Lab',
      'Steel Structures Lab',
      'Earthquake Engineering Lab',
      'Bridge Engineering Lab',
      'Finite Element Analysis Lab',
      'Material Testing Lab',
      'Structural Design Lab'
    ],
    hod: {
      name: 'Dr. A.S.Sayyad',
      qualification: 'Ph.D. in Structural Engineering',
      experience: '22+ years',
      specialization: 'Structural Engineering, Structural Analysis',
      email: 'hod.structural@sanjivani.org.in',
      message: 'Structural Engineering Department emphasizes on safe and sustainable structural design with modern analysis techniques.', 
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/3b3e749011568df066956f2034087c10_S.jpg?t=20250813_112149"
    },
    faculty: [
      { name: 'Dr. A.S.Sayyad', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/3b3e749011568df066956f2034087c10_S.jpg?t=20250813_112149" },
      { name: 'Dr. N. S. Naik', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/63ae8dd535459e6ddaa9950601158f8d_S.jpg?t=20250813_112205" },
      { name: 'Dr. S.M.Gunjal', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/52ec984cc72302fd412e2aa145a6526c_S.jpg?t=20250813_112225" },
      { name: 'Dr. B.M.Shinde', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7539a1b30386b8951ffea14c91e802dc_S.jpg?t=20250813_112057" },
      { name: 'Prof. H. N.Wagh', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/dc9e231f652301f80ea8e901bd9ec18a_S.jpg?t=20250813_112115" },
      { name: 'Prof. S. S. Kolapkar', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d9b208614500b6f80739755fd29fad52_S.jpg?t=20250813_112129" },
      { name: 'Prof. A. S.Jape', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/97aa066dcc42404e7602768333af5659_S.jpg?t=20250813_111945" },
      { name: 'Prof.S. B. Gayake', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/474f4cdd4383ff91fd1d98bcb039d93b_S.jpg?t=20250813_112014" },
      { name: 'Dr. H. N. Kedar', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/c75601cf4b798b9bb038a5b73c93d358_S.jpg?t=20250813_112035" },
      { name: 'Prof.R.J.Vyawahare', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/bdc7d0f30e0c420b2ac279d6a1c096e4_S.jpg?t=20250813_111911" },
      { name: 'Prof.Apurwa Rastogi', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/3d3b7d5d68132cc424920deb43e754bb_S.jpg?t=20250814_152126" },
      { name: 'Dr. Prakash A. Singh', qualification: 'Ph.D.', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/b48f2c03bbd159814922841bfb3fe7d7_S.jpg?t=20250813_111749" },
      { name: 'Prof. Choden Tamang', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/5ab529a5ebdeee2caf2312423d91adb3_S.jpg?t=20250814_151751" },
      { name: 'Prof.N.S.Wagh', qualification: 'M.Tech', specialization: 'Structural Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/3b77d3f73b59742412f393cd0d264b14_S.jpg?t=20250813_111822" }
    ],
    associations: ['Structural Engineering Society'],
    achievements: 'Strong research activities, Industry collaborations'
  },
  'electronics-computer-engineering': {
    name: 'Electronics & Computer Engineering',
    description: 'Combines electronics with computer systems and automation',
    labs: [
      'IoT and CG Lab',
      'AI and ML Lab',
      'Analog and Digital Communication Lab',
      'ES and DSP Lab',
      'Printed Circuit Board Lab',
      'Project Lab',
      'Research Lab',
      'BEE Lab',
      'Electrical Machine Lab 1'
    ],
    hod: {
      name: 'Dr. D.B.Kshirsagar',
      qualification: 'Ph.D. in Electronics & Communication Engineering',
      experience: '20+ years',
      specialization: 'Electronics & Computer Engineering, VLSI Design',
      email: 'hod.ece@sanjivani.org.in',
      message: 'Electronics & Computer Engineering Department integrates hardware and software for innovative electronic solutions.', 
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/358873fad4914931314b94f2036b503a_S.jpg?t=20250814_063257"
    },
    faculty: [
      { name: 'Dr. D.B.Kshirsagar', qualification: 'Ph.D.', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/358873fad4914931314b94f2036b503a_S.jpg?t=20250814_063257" },
      { name: 'Dr. B. S. Agarkar', qualification: 'Ph.D.', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d722f2a14a84b7ad8053262f61a6106b_S.jpg?t=20250813_014917" },
      { name: 'Dr. S. V. Chaudhari', qualification: 'Ph.D.', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/948378d6a67ac0d7c7c6728581b072ab_S.jpg?t=20250811_101531" },
      { name: 'Dr. N. K. Darwante', qualification: 'Ph.D.', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/aaa036e4cb16038f90e128d8e39c714f_S.jpg?t=20250813_015012" },
      { name: 'Mr. N. D. Kapale', qualification: 'M.Tech', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/d6e7bc44feb1613d041d5385e5745b10_S.jpg?t=20250813_015055" },
      { name: 'Dr. M. A. Sayyad', qualification: 'Ph.D.', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/048731097de322302aff7e52151c991d_S.jpg?t=20250813_015141" },
      { name: 'Dr. D. G. Lokhande', qualification: 'Ph.D.', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/a42a2aa6c7440291c38ba9adc5892a56_S.jpg?t=20250811_101910" },
      { name: 'Mr. N. Y.Siddiqui', qualification: 'M.Tech', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/75b44b0e9c2e5d305fa323c6c51d3476_S.jpg?t=20250813_015223" },
      { name: 'Mr. N. I. Bhopale', qualification: 'M.Tech', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/a63cd9e38964634741a5a3fe89055308_S.jpg?t=20250813_015313" },
      { name: 'Mr. S.S.Kulkarni', qualification: 'M.Tech', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/063ee9aeb9f60efa02823e51450f82ce_S.jpg?t=20250813_015406" },
      { name: 'Mr. Y. R. Khandekar', qualification: 'M.Tech', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/63503204d18160dd6a733e989b70c404_S.jpg?t=20250813_015441" },
      { name: 'Mr. S. K. Gupta', qualification: 'M.Tech', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/88f135a483ef01fac8d7b920488085e4_S.jpg?t=20250813_020203" },
      { name: 'Dr.Mahurkar Dipak Pralhad', qualification: 'Ph.D.', specialization: 'Electronics & Computer Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/4147ca3af8bf81f64b5d738c371bfecb_S.jpg?t=20250813_020240" }
    ],
    associations: ['I.E.E.E.', 'ISF', 'E.T.E.S.A.'],
    achievements: 'Research Centre, Strong placement record, Innovation in teaching'
  },
  'electrical-engineering': {
    name: 'Electrical Engineering',
    description: 'Specializes in power systems, circuits, and energy solutions',
    labs: [
      'Electrical Machines Lab 1',
      'Power Systems Lab',
      'Control Systems Lab',
      'Power Electronics Lab',
      'Electrical Measurements Lab',
      'Circuit Analysis Lab',
      'Renewable Energy Lab',
      'High Voltage Lab'
    ],
    hod: {
      name: 'Dr. D. B. Pardeshi',
      qualification: 'Ph.D. in Electrical Engineering',
      experience: '21+ years',
      specialization: 'Electrical Engineering, Power Systems',
      email: 'hod.electrical@sanjivani.org.in',
      message: 'Electrical Engineering Department focuses on sustainable energy solutions and modern power systems technology.', 
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/95a78f3015bd19286b33c65657114fc4_S.jpg?t=20250813_164349"
    },
    faculty: [
      { name: 'Dr. D. B. Pardeshi', qualification: 'Ph.D.', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/95a78f3015bd19286b33c65657114fc4_S.jpg?t=20250813_164349" },
      { name: 'Dr. Govindraj Vijayakumar', qualification: 'Ph.D.', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/48689e827932dc70ec0a6e6067e8a72b_S.jpg?t=20250813_164419" },
      { name: 'Dr. P. V. Thokal', qualification: 'Ph.D.', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/086218b2ac4369b7cefd2acbee0be8b1_S.jpg?t=20250813_164431" },
      { name: 'Mr. R. N. Hajare', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/9653b574708b7a6469e28ee67a57dc73_S.jpg?t=20250813_164444" },
      { name: 'Mr. R. R. Bibave', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/fe392f78a62c6fc460cf8c2a182b395f_S.jpg?t=20250813_164457" },
      { name: 'Mrs S. S. Gondkar', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/7be335477876db854960134c6e137164_S.jpg?t=20250813_164653" },
      { name: 'Mr. Debraj Bhowmick', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/ffe144b59c409587b4c9211fb31afdfe_S.jpg?t=20250813_165002" },
      { name: 'Mr. S. K. Agrawal', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/0d422469a7bfe49699e19d8d898530d7_S.jpg?t=20250813_165026" },
      { name: 'Mr. V. C. Wable', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/daf30d03da42a5291604b3fcca07f0d0_S.jpg?t=20250813_165105" },
      { name: 'Mr. B. B. Kadam', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/ce11944b98d0742eead2b016a253afd2_S.jpg?t=20250813_165046" },
      { name: 'Ms. P. D. Daunde', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/97a787f8d6fb66aaef15fa858aa433ea_S.jpg?t=20250813_165128" },
      { name: 'Ms. C. P. Jadhav', qualification: 'M.Tech', specialization: 'Electrical Engineering', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/5ef17ed4d733d4dc3519b291889643fe_S.jpg?t=20250830_082312" }
    ],
    associations: ['Electrical Engineering Society'],
    achievements: 'NBA Accredited, Strong placement statistics, Innovation in teaching'
  },
  'mba': {
    name: 'MBA',
    description: 'Business management and administration',
    labs: [
      'Business Analytics Lab',
      'Computer Applications Lab',
      'Case Study Room',
      'Management Games Room',
      'Library & Reading Room',
      'Conference Room',
      'Presentation Room',
      'Research Lab'
    ],
    hod: {
      name: 'Dr. Ritesh K. Patel',
      qualification: 'Ph.D. in Management Studies',
      experience: '18+ years',
      specialization: 'Management Studies, Business Administration',
      email: 'hod.mba@sanjivani.org.in',
      message: 'MBA Department prepares future business leaders with practical knowledge and industry-relevant skills for global opportunities.', 
      photo:"https://sanjivanicoe.org.in/media/k2/items/cache/70a2f0392847dc331972c7d3d3673ab9_S.jpg?t=20250810_082740"
    },
    faculty: [
      { name: 'Dr. Ritesh K. Patel', qualification: 'Ph.D.', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/70a2f0392847dc331972c7d3d3673ab9_S.jpg?t=20250810_082740" },
      { name: 'Dr. V.M Tidake', qualification: 'Ph.D.', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/bd3346ba561b5b55180dd1441a09d1ee_S.jpg?t=20250810_081721" },
      { name: 'Ms. P.S. Kawle', qualification: 'Ph.D.', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/052250dc50138371fd04f19c188f0143_S.jpg?t=20250810_081835" },
      { name: 'Dr. Ghodake Shamrao P.', qualification: 'Ph.D.', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/621af29360685f88fae4c26f96ed9d8c_S.jpg?t=20250810_081806" },
      { name: 'Dr. Sanjit Singh', qualification: 'Ph.D.', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/e17bf28887a04e7713039bc3ae638d41_S.jpg?t=20250810_081923" },
      { name: 'Mr.S.S.Pawar', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/4effff5398b13b476604d4d8450bedfd_S.jpg?t=20250810_080709" },
      { name: 'Ms. M. V. Jawarkar', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/0555bbe9368a05bff51437bdc1ff702e_S.jpg?t=20250810_082847" },
      { name: 'Mr.Rajkumar Bhola', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/8b072d4f47fa16702f8c7356d2c88ee8_S.jpg?t=20250810_071425" },
      { name: 'Mr.V.R.Nimbolkar', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/9ad74ebcc3d83e86bcc0098026ed5e9f_S.jpg?t=20250810_080622" },
      { name: 'Dr. K. S. Shinde', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/464b3f74fd6601955ccb022f610c3111_S.jpg?t=20250830_081904" },
      { name: 'Ms. P. R. Punjabi', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/814d386f5c4138112e5fa70430be6661_S.jpg?t=20250810_082019" },
      { name: 'Ms. H. R. Jadhav', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/f3ad4a234535b69ec9bf916a25462992_S.jpg?t=20250810_082939" },
      { name: 'Mr. A.S. Amrao', qualification: 'MBA', specialization: 'Management Studies', photo:"https://sanjivanicoe.org.in/media/k2/items/cache/dd45d054dfce696b68bc0b43a11d1bfe_S.jpg?t=20250810_081405" }
    ],
    associations: ['MBA Student Association'],
    achievements: 'Strong placement record, Industry partnerships, Student activities'
  }
};

let currentDepartment = '';

function showDeptOptions(deptKey) {
  currentDepartment = deptKey;
  const dept = departmentData[deptKey];
  
  document.getElementById('dept-options-title').textContent = dept.name;
  document.getElementById('dept-options-modal').classList.remove('hidden');
}

function closeDeptOptionsModal() {
  document.getElementById('dept-options-modal').classList.add('hidden');
}
// department details
function showDeptDetails(type) {
  const dept = departmentData[currentDepartment];
  const title = document.getElementById('dept-details-title');
  const content = document.getElementById('dept-details-content');
  
  closeDeptOptionsModal();
  
  if (type === 'labs') {
    title.textContent = `${dept.name} - Laboratories`;
    content.innerHTML = `
      <div class="space-y-4">
        <p class="text-gray-600">${dept.description}</p>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          ${dept.labs.map(lab => `
            <div class="bg-blue-50 rounded-lg p-4">
              <div class="flex items-center gap-3">
                <span class="text-2xl">🔬</span>
                <div>
                  <h4 class="font-semibold text-[#0d47a1]">${lab}</h4>
                  <p class="text-sm text-gray-600">Well-equipped laboratory</p>
                </div>
              </div>
            </div>
          `).join('')}
        </div>
        <div class="bg-green-50 rounded-lg p-4 mt-6">
          <h4 class="font-semibold text-[#0d47a1] mb-2">Key Features</h4>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Modern equipment and software</li>
            <li>• High-speed internet connectivity</li>
            <li>• Air-conditioned environment</li>
            <li>• 24/7 access for research work</li>
          </ul>
        </div>
      </div>
    `;
    
    // Update lab navigation info
    updateLabNavigationInfo(dept.name, dept.labs.length);
  } else if (type === 'hod') {
    title.textContent = `${dept.name} - HOD's Desk`;
    content.innerHTML = `
      <div class="space-y-6">
        <div class="bg-gradient-to-r from-blue-50 to-blue-100 rounded-lg p-6">
          <div class="flex items-center gap-4">
            
            <!-- HOD Photo with fallback -->
            <div class="photo-container w-32 h-32">
              ${dept.hod.photo 
                ? `<img src="${dept.hod.photo}" alt="${dept.hod.name}" class="hod-photo"
                    onerror="this.style.display='none'; this.insertAdjacentHTML('afterend','<div class=\\'photo-fallback\\'>${dept.hod.name.charAt(0)}</div>');">`
                : `<div class="photo-fallback">${dept.hod.name.split(" ").map(n => n[0]).join("").slice(0,2)}</div>`}
            </div>

            <div>
              <h3 class="text-xl font-bold text-[#0d47a1]">${dept.hod.name}</h3>
              <p class="text-gray-600">Head of Department</p>
            </div>
          </div>
        </div>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-[#0d47a1] mb-2">Qualification</h4>
            <p class="text-gray-700">${dept.hod.qualification}</p>
          </div>
          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-[#0d47a1] mb-2">Experience</h4>
            <p class="text-gray-700">${dept.hod.experience}</p>
          </div>
          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-[#0d47a1] mb-2">Specialization</h4>
            <p class="text-gray-700">${dept.hod.specialization}</p>
          </div>
          <div class="bg-white border rounded-lg p-4">
            <h4 class="font-semibold text-[#0d47a1] mb-2">Email</h4>
            <p class="text-gray-700">${dept.hod.email}</p>
          </div>
        </div>
        
        <div class="bg-yellow-50 rounded-lg p-4">
          <h4 class="font-semibold text-[#0d47a1] mb-2">Message from HOD</h4>
          <p class="text-gray-700">${dept.hod.message}</p>
        </div>
      </div>
    `;
  } else if (type === 'faculty') {
    title.textContent = `${dept.name} - Faculty`;
    content.innerHTML = `
      <div class="space-y-4">
        <p class="text-gray-600">Meet our experienced and dedicated faculty members</p>
        <div class="faculty-scroll-container">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            ${dept.faculty.map(faculty => `
            <div class="bg-white border rounded-lg p-4 hover:shadow-md transition-shadow">
              <div class="flex items-center gap-3">
                  <div class="photo-container w-20 h-20">
                    ${faculty.photo 
                      ? `<img src="${faculty.photo}" alt="${faculty.name}" class="faculty-photo" 
                            onerror="this.style.display='none'; this.insertAdjacentHTML('afterend','<div class=\\'photo-fallback\\'>${faculty.name.charAt(0)}</div>');">`
                      : `<div class="photo-fallback">${faculty.name.split(" ").map(n=>n[0]).join("").slice(0,2)}</div>`}
                </div>
                <div>
                  <h4 class="font-semibold text-[#0d47a1]">${faculty.name}</h4>
                  <p class="text-sm text-gray-600">${faculty.qualification}</p>
                  <p class="text-xs text-gray-500">${faculty.specialization}</p>
                </div>
              </div>
            </div>
          `).join('')}
          </div>
        </div>
        
        <div class="bg-blue-50 rounded-lg p-4 mt-6">
          <h4 class="font-semibold text-[#0d47a1] mb-2">Faculty Highlights</h4>
          <ul class="text-sm text-gray-700 space-y-1">
            <li>• Experienced faculty with industry exposure</li>
            <li>• Regular participation in conferences and workshops</li>
            <li>• Strong research publications</li>
            <li>• Student mentoring and guidance</li>
          </ul>
        </div>
      </div>
    `;
  }
  
  document.getElementById('dept-details-modal').classList.remove('hidden');
}

function closeDeptDetailsModal() {
  document.getElementById('dept-details-modal').classList.add('hidden');
}

// Update lab navigation information display
function updateLabNavigationInfo(deptName, labCount) {
  const navLabDept = document.getElementById('nav-lab-dept');
  const navLabCount = document.getElementById('nav-lab-count');
  
  if (navLabDept) {
    navLabDept.textContent = deptName || '-';
  }
  if (navLabCount) {
    navLabCount.textContent = labCount || '0';
  }
}

// ----- Ratings: State, Init, and Actions -----
const ratingsState = {
  currentSelection: { hostel: 0, food: 0 },
  data: (() => {
    try {
      const saved = localStorage.getItem('ratingsData');
      return saved ? JSON.parse(saved) : { hostel: [], food: [] };
    } catch (e) {
      return { hostel: [], food: [] };
    }
  })()
};

function persistRatings() {
  try {
    localStorage.setItem('ratingsData', JSON.stringify(ratingsState.data));
  } catch (e) {
    // ignore persistence errors
  }
}

function initRatingsPage() {
  // Attach change handlers to new rating radios
  document.querySelectorAll('.rating').forEach(container => {
    const group = container.getAttribute('data-group');
    container.querySelectorAll('input[type="radio"]').forEach(radio => {
      radio.addEventListener('change', () => {
        ratingsState.currentSelection[group] = parseInt(radio.value);
        // Visual selection is handled by CSS
      });
    });
  });

  // No star coloring needed; CSS handles state. Just render existing lists
  renderRatingsList('hostel');
  renderRatingsList('food');
}
// dynamic star rating
function updateStars(group) {
  // obsolete with new CSS-based stars; kept for compatibility
}
// rating submit option
function submitRating(group) {
  const rating = ratingsState.currentSelection[group] || 0;
  const textareaId = group === 'hostel' ? 'hostel-review' : 'food-review';
  const review = (document.getElementById(textareaId)?.value || '').trim();
  if (rating === 0 && review === '') {
    alert('Please select a rating or write a review.');
    return;
  }
  const entry = {
    rating,
    review,
    date: new Date().toISOString()
  };
  ratingsState.data[group].unshift(entry);
  persistRatings();
  // Reset selection and textarea
  ratingsState.currentSelection[group] = 0;
  updateStars(group);
  if (textareaId) {
    const ta = document.getElementById(textareaId);
    if (ta) ta.value = '';
  }
  renderRatingsList(group);
}
// review delete 
function deleteReview(group, index) {
  console.log("Deleting review from:", group, "at index:", index); // debug

  if (!ratingsState.data[group]) return;

  // confirmation popup
  const confirmDelete = confirm("Are you sure you want to delete this review?");
  if (!confirmDelete) return;

  // remove the review
  ratingsState.data[group].splice(index, 1);

  // save updated data
  localStorage.setItem("ratingsData", JSON.stringify(ratingsState.data));

  // re-render list
  renderRatingsList(group);
}

let deleteGroup = null;
let deleteIndex = null;
//delete review
function deleteReview(group, index) {
  // Open custom modal instead of browser confirm
  deleteGroup = group;
  deleteIndex = index;
  document.getElementById("deleteModal").classList.remove("hidden");
}
// close delete prompt
function closeDeleteModal() {
  document.getElementById("deleteModal").classList.add("hidden");
  deleteGroup = null;
  deleteIndex = null;
}
// delete review comfirmation
function confirmDeleteReview() {
  if (deleteGroup !== null && deleteIndex !== null) {
    ratingsState.data[deleteGroup].splice(deleteIndex, 1);
    localStorage.setItem("ratingsData", JSON.stringify(ratingsState.data));
    renderRatingsList(deleteGroup);
  }
  closeDeleteModal();
}

// Edits review
function editReview(group, index) {
  if (!ratingsState.data[group]) return;

  const review = ratingsState.data[group][index];

  // ask user for new review text
  const newText = prompt("Edit your review:", review.review || "");
  if (newText === null) return; // cancelled

  // ask user for new rating
  let newRating = prompt("Edit your rating (1–5):", review.rating);
  if (newRating === null) return; // cancelled
  newRating = parseInt(newRating);

  if (isNaN(newRating) || newRating < 1 || newRating > 5) {
    alert("Invalid rating. Must be between 1 and 5.");
    return;
  }

  // update stored review
  ratingsState.data[group][index] = {
    ...review,
    review: newText.trim(),
    rating: newRating,
    date: new Date().toISOString()
  };

  // save to localStorage
  localStorage.setItem("ratingsData", JSON.stringify(ratingsState.data));

  // refresh UI
  renderRatingsList(group);
}
// show star for rating
function get3DStarSVG(filled = true) {
  if (filled) {
    return `
      <svg class="star-svg" viewBox="0 0 64 64" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <linearGradient id="goldGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stop-color="#fff700"/>
            <stop offset="50%" stop-color="#ffcc00"/>
            <stop offset="100%" stop-color="#b8860b"/>
          </linearGradient>
        </defs>
        <path d="M32 2 L39.09 24.26 L62 24.27 L44.55 38.13 L50.18 62 L32 50.56 L13.82 62 L19.45 38.13 L2 24.27 L24.91 24.26 Z" fill="url(#goldGrad)" filter="url(#starShadow)"/>
        <defs>
          <filter id="starShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="1" dy="1" stdDeviation="1" flood-color="#000" flood-opacity="0.5"/>
          </filter>
        </defs>
      </svg>
    `;
  } else {
    // Unfilled star
    return `
      <svg class="star-svg" viewBox="0 0 64 64" width="24" height="24" xmlns="http://www.w3.org/2000/svg">
        <path d="M32 2 L39.09 24.26 L62 24.27 L44.55 38.13 L50.18 62 L32 50.56 L13.82 62 L19.45 38.13 L2 24.27 L24.91 24.26 Z" fill="#d1d5db" stroke="#a0a0a0" stroke-width="2"/>
      </svg>
    `;
  }
}

// rating and review list 
function renderRatingsList(group) {
  const listId = group === 'hostel' ? 'hostel-list' : 'food-list';
  const container = document.getElementById(listId);
  if (!container) return;
  const entries = ratingsState.data[group];
  if (!entries || entries.length === 0) {
    container.innerHTML = `<p class="text-gray-500">No reviews yet. Be the first to add one!</p>`;
    return;
  }
  container.innerHTML = entries.map((e, i) => {
    const stars = '★★★★★'.split('').map((ch, j) => get3DStarSVG(j < (e.rating || 0))).join('');
           
    const date = new Date(e.date).toLocaleString();
    const safeReview = e.review ? e.review.replace(/[&<>]/g, (c) => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c])) : '';
  
    // Check if this review is being edited
    if (e.isEditing) {
      return `
        <div class="mt-3 border rounded-lg p-3">
          <div class="text-lg">${stars}</div>
          <textarea id="edit-input-${group}-${i}" class="w-full border rounded-md p-2 text-sm mt-2">${safeReview}</textarea>
          <div class="flex gap-2 mt-2">
            <button class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600" onclick="saveInlineEdit('${group}', ${i})">Save</button>
            <button class="px-3 py-1 bg-gray-400 text-white text-xs rounded-md hover:bg-gray-500" onclick="cancelInlineEdit('${group}', ${i})">Cancel</button>
          </div>
        </div>
      `;
    }
  
    return `
      <div class="mt-3 border rounded-lg p-3">
        <div class="flex items-center justify-between">
          <div class="text-lg">${stars}</div>
          <span class="text-xs text-gray-400">${date}</span>
        </div>
        ${safeReview ? `<p class="mt-2 text-gray-700">${safeReview}</p>` : ''}
        <div class="flex gap-2 mt-2">
          <button class="px-3 py-1 bg-blue-500 text-white text-xs rounded-md hover:bg-blue-600" onclick="startInlineEdit('${group}', ${i})">Edit</button>
          <button 
  class="px-3 py-1 bg-red-500 text-white text-xs rounded-md hover:bg-red-600" 
  onclick="deleteReview('${group}', ${i})">
  Delete
</button>

        </div>
      </div>
    `;
  }).join('');
}

function startInlineEdit(group, index) {
  ratingsState.data[group][index].isEditing = true;
  renderRatingsList(group);
}

function cancelInlineEdit(group, index) {
  ratingsState.data[group][index].isEditing = false;
  renderRatingsList(group);
}

function saveInlineEdit(group, index) {
  const newText = document.getElementById(`edit-input-${group}-${index}`).value.trim();
  ratingsState.data[group][index].review = newText;
  ratingsState.data[group][index].date = new Date().toISOString();
  delete ratingsState.data[group][index].isEditing; // remove flag
  localStorage.setItem("ratingsData", JSON.stringify(ratingsState.data));
  renderRatingsList(group);
}

  

// ----- Login (Mock UI only) -----
function initLoginPage() {
  const form = document.getElementById('login-form');
  if (!form) return;
  const emailEl = document.getElementById('login-email');
  const passwordEl = document.getElementById('login-password');
  const submitBtn = document.getElementById('login-submit');
  const messageEl = document.getElementById('login-message');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    if (!emailEl || !passwordEl) return;
    const email = emailEl.value.trim();
    const password = passwordEl.value;
    messageEl.textContent = '';
    messageEl.className = 'text-center text-sm mt-2 text-gray-600';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Signing in...';
    try {
      if (!window.supabaseHelpers || !window.supabaseHelpers.signInWithPassword) {
        throw new Error('Supabase not loaded. Please open the site via http:// (not file://).');
      }
      const { data, error } = await window.supabaseHelpers.signInWithPassword(email, password);
      if (error) {
        let errorMessage = 'Login failed: ' + (error.message || 'Unknown error');
        if (error.message && error.message.includes('Invalid login credentials')) {
          errorMessage = 'Invalid email or password. Please check your credentials and try again.';
        } else if (error.message && error.message.includes('Email not confirmed')) {
          errorMessage = 'Email not verified. For development, try creating a new account or check your email.';
        }
        messageEl.textContent = errorMessage;
        messageEl.className = 'text-center text-sm mt-2 text-red-600';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';
        return;
      }
      
      // Check if login was successful
      if (data.user) {
        localStorage.setItem('isLoggedIn', 'true');
        updateNavAuthLink();
        loadPage('home');
      } else {
        messageEl.textContent = 'Login failed: No user data received';
        messageEl.className = 'text-center text-sm mt-2 text-red-600';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign in';
      }
    } catch (err) {
      messageEl.textContent = 'Login failed: ' + (err.message || 'Network error');
      messageEl.className = 'text-center text-sm mt-2 text-red-600';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign in';
    }
  });
}

function initSignupPage() {
  const form = document.getElementById('signup-form');
  if (!form) return;
  const emailEl = document.getElementById('signup-email');
  const passwordEl = document.getElementById('signup-password');
  const submitBtn = document.getElementById('signup-submit');
  const messageEl = document.getElementById('signup-message');
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = emailEl.value.trim();
    const password = passwordEl.value;
    messageEl.textContent = '';
    messageEl.className = 'text-center text-sm mt-2 text-gray-600';
    submitBtn.disabled = true;
    submitBtn.textContent = 'Creating account...';
    try {
      if (!window.supabaseHelpers || !window.supabaseHelpers.signUpWithPassword) {
        throw new Error('Supabase not loaded. Please open the site via http:// (not file://).');
      }
      const { data, error } = await window.supabaseHelpers.signUpWithPassword(email, password);
      if (error) {
        messageEl.textContent = 'Signup failed: ' + (error.message || 'Unknown error');
        messageEl.className = 'text-center text-sm mt-2 text-red-600';
        submitBtn.disabled = false;
        submitBtn.textContent = 'Sign up';
        return;
      }
      
      // Check if user was created successfully
      if (data.user) {
        // For development: auto-login after signup
        localStorage.setItem('isLoggedIn', 'true');
        updateNavAuthLink();
        loadPage('home');
        return;
      }
      
      messageEl.innerHTML = 'Signup successful! Please check your email for verification link.<br><small>After clicking the verification link, you can log in.</small>';
      messageEl.className = 'text-center text-sm mt-2 text-green-600';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign up';
    } catch (err) {
      messageEl.textContent = 'Signup failed: ' + (err.message || 'Network error');
      messageEl.className = 'text-center text-sm mt-2 text-red-600';
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign up';
    }
  });
}

// ----- Classrooms: Data Structure and Navigation -----
const classroomData = {
  'engineering': {
    'ground': {
      'mechanical': [
        '016 - Manufacturing Science Lab',
        '017 - Thermal Lab 2 / Staff Room',
        '018 - Tutorial Room',
        '019 - Machine Lab / Staff Room',
        '020 - Washroom (Boys)',
        '021 - Metallurgy Lab / Staff Room',
        '022 - Fluid Mechanics Lab',
        '023 - Geotechnical Engineering Lab',
        '024 - Seminar Hall',
        '025 - Seminar Hall',
        '026 - Staff Room',
        '027 - Thermal Lab 1',
        '028 - Engineering Chemistry Lab / Staff Room'
      ],
      'ece': [
        '001 - Director Cabin (Dr. M. V. Nagarhalli)',
        '005 - Student Section',
        '006 - Dean Academics',
        '007 - Department Office (Dr. D.B. Kshirsagar)',
        '008 - IoT and CG Lab',
        '009 - AI and ML Lab',
        '010 - Analog and Digital Communication Lab / Staff Room',
        '011 - Washroom',
        '012 - Tutorial Room',
        '013 - Test Measurement Lab',
        '014 - Staff Room',
        '029 - Research Lab / Dr. M. A. Sayyad',
        '030 - ES and DSP Lab',
        '031 - Printed Circuit Board Lab',
        '032 - Project Lab / Prof. N. Y. Siddiqui',
        '033 - Prof. Shailesh Kulkarni',
        '034 - PG Lab',
        '035 - Electronics Lab / Prof. S. V. Chaudhari',
        '036 - Prof. N. K. Darwante',
        '037 - Department Library',
        '038 - BEE Lab / Staff Room',
        '039 - Tutorial Room',
        '040 - Electrical Machine Lab 1',
        '041 - Electrical Machine Lab 1',
        '042 - Reprographic Facility (Xerox)',
        '043 - Office College of Engineering / Registrar'
      ]
    },
    '1st': {
      'mechanical': [
        '109 - HOD Cabin',
        '110 - Staff Room',
        '111 - Conference Hall',
        '112 - Conference Hall',
        '113 - Chamber / Staff Room',
        '114 - Chamber / Staff Room',
        '115 - Classroom',
        '116 - Washroom (Boys)',
        '117 - CAD Lab 1',
        '118 - Computer Center',
        '119 - Classroom (Step Hall)',
        '120 - Staff Room',
        '121 - Classroom (Step Hall)',
        '122 - Industry 4.0 Lab',
        '123 - Automation Lab',
        '124 - CAD Lab 2'
      ],
      'computer': [
        '101 - Software Lab 1',
        '102 - Software Lab 2',
        '103 - Unix Lab / Staff Room',
        '104 - Advance Development Tool Lab',
        '105 - Washroom',
        '106 - Staff Room (Dr. D.B. Kshirsagar)',
        '107 - Staff Room',
        '108 - Store Room',
        '125 - Programming Lab 1 / Virtusa Lab',
        '126 - Centre of Data Science',
        '127 - Centre of Data Science',
        '128 - Staff Room',
        '129 - Network Lab',
        '130 - Network Lab / Staff Room',
        '131 - PG Lab',
        '132 - HOD Cabin',
        '133 - High Performance Computing Lab (HPC Lab)',
        '134 - Project Lab',
        '135 - Staff Room',
        '136 - Engineering Physics Lab',
        '137 - Engineering Physics Lab',
        '138 - Language Lab'
      ]
    },
    '2nd': {
      'civil': [
        '210 - Department Library / Staff Room',
        '211 - Staff Room',
        '212 - Classroom',
        '213 - Staff Room',
        '214 - Classroom',
        '215 - Ladies Common Room',
        '216 - Engineering Environment Lab',
        '217 - Classroom',
        '218 - Classroom',
        '219 - Drawing Hall',
        '220 - Classroom (Step Hall)',
        '221 - Staff Room',
        '222 - Classroom (Step Hall)',
        '223 - Geology Lab',
        '224 - P.G. Research Lab',
        '225 - CAD Lab 1'
      ],
      'first-year': [
        '201 - Classroom',
        '202 - Classroom',
        '203 - Classroom',
        '204 - Classroom',
        '205 - Washroom',
        '206 - Drawing Hall',
        '207 - University Exam Control Room',
        '208 - Classroom',
        '209 - Drawing Hall',
        '226 - Drawing Hall',
        '227 - Classroom',
        '228 - Classroom',
        '229 - Classroom',
        '230 - Classroom',
        '231 - Classroom',
        '232 - Classroom',
        '233 - Classroom',
        '234 - Staff Room',
        '235 - Classroom',
        '236 - Classroom',
        '237 - Classroom',
        '238 - Staff Room',
        '239 - Staff Room',
        '240 - Staff Room'
      ]
    }
  },
  'it-mba': {
    'ground': {
      'common': [
        'Library', 
        'Reading Room', 
        'Facilitation Center'
      ]
    },
    '1st': {
      'common': [
        'Classroom 1',
         'Classroom 2',
         'Web Technology Lab'
        ]
    },
    '2nd': {
      'it-department': [
        '302 - Programming Lab 1',
        '303 - Project Lab',
        '304 - Programming Lab 2',
        '305 - Programming Lab 3',
        '306 - Network Lab',
        '307 - Language Lab',
        'Itera Library'
      ]
    },
    '3rd': {
      'it-department': [
        '402 - HOD Cabin',
        '403 - Hardware Lab',
        '404 - Classroom',
        '405 - Classroom',
        '406 - Classroom',
        '407 - Classroom',
      ]
    },
    '4th': {
      'mba': [
        '501 - Washroom',
        '502 - HOD Cabin (Faculty)',
        '503 - Computer Lab',
        '504 - MBA I div-A',
        '505 - MBA I div-B',
        '506 - MBA II (Marketing)'
      ]
    },
    '5th': {
      'mba': [
        '601 - Classroom',
        '602 - MBA II (Logistic)',
        '603 - MBA II (Human Capital)',
        '604 - Classroom',
        '605 - Seminar Hall'
      ]
    }
  },
  'uni': {
    'ground': {
      'common': ['Not yet defined']
    }
  },
  'diploma': {
    'ground': {
      'common': ['Not yet defined']
    }
  },
  'pharmacy': {
    'ground': {
      'common': ['Not yet defined']
    }
  },
  'junior-college': {
    'ground': {
      'common': ['Not yet defined']
    }
  },
  'sims': {
    'ground': {
      'common': [
        'Washroom (Girls)',
        'Washroom (Boys)'
      ]
    },
    '1st': {
      'electrical': [
        'E102 - Boys Washroom',
        'E103 - Electrical Machines Lab 2',
        'E104 - Department of Training and Placement',
        'E105 - Power Electronics and Microcontroller Lab',
        'E106 - Power System Switchgear and Protection Lab',
        'E107 - Computer Lab',
        'E108 - High Voltage Engineering Lab',
      ]
    },
    '2nd': {
      'electrical': [
        'E201 - Project Lab ',
        'E202 - Girls Washroom',
        'E203 - Renewable Energy Lab',
        'E204 - Control Systems Lab',
        'E205 - Evaluation and Assessment Section',
        'E206 - Examination Record Section',
        'E207 - Examination M.I.S Section',
        'E208 - Controller of EXamination (Dr. P. N. Kalvadekar)'
      ]
    },
    '3rd': {
      'structural': [
        'E301 - HOD Cabin',
        'E302 - Seminar Hall',
        'E303 - Staffroom/ Structural Analysis and Design Lab',
        'E304 - Staffroom/ Structural Audit and Health Monitoring Lab',
        'E305 - Innovation/ Project Lab',
        'E306 - Innovation Lab/ Staffroom',
        'E307 - Compputer and Structural Lab',
        'E308 - Classroom',
      ]
    },
    '4th': {
      'mechatronics': [
        'E401 - HOD Cabin',
        'E402 - Computer/ Programming Lab',
        'E403 - CAD Lab/ Computer Lab',
        'E404 - Basis Mechatronics Lab',
        'E405 - Industry 4.0 Lab',
        'E406 - Automotive Mechatronics Lab',
        'E407 - Fab Lab'
      ]
    },
    '5th': {
      'mechatronics': [
        'E501 - Office',
        'E502 - Classroom 1',
        'E503 - Classroom 2',
        'E504 - Tutorial Room',
        'E505 - Classroom',
        'E506 - Program Co-ordinator',
        'E507 - Classroom'
      ]
    }
  }
};

let currentSelection = {
  building: 'engineering',
  floor: 'ground',
  department: 'mechanical',
  filter: 'all'
};

// Pretty-print helpers for UI labels
function getPrettyBuildingName(building) {
  const mapping = {
    'engineering': 'Engineering',
    'it-mba': 'IT/MBA',
    'uni': 'University',
    'diploma': 'Diploma',
    'pharmacy': 'Pharmacy',
    'junior-college': 'Junior College',
    'sims': 'SIMS'
  };
  if (!building) return '-';
  return mapping[building] || (building.charAt(0).toUpperCase() + building.slice(1).replace('-', ' '));
}

function getPrettyDepartmentName(department) {
  const mapping = {
    'ece': 'ECE',
    'it-department': 'IT Department',
    'first-year': 'First Year',
    'staffroom': 'Staff Room',
    'labs': 'Labs'
  };
  if (!department) return '-';
  return mapping[department] || (department.charAt(0).toUpperCase() + department.slice(1).replace('-', ' '));
}

function initClassroomsPage() {
  // Building selector handlers (segmented control)
  document.querySelectorAll('.building-tab').forEach(input => {
    input.addEventListener('change', (e) => {
      const building = e.target.getAttribute('data-building');
      if (e.target.checked) selectBuilding(building);
    });
  });

  // Floor dropdown handler
  const floorSelect = document.getElementById('floor-select');
  if (floorSelect) {
    floorSelect.addEventListener('change', (e) => {
      const floor = e.target.value;
      if (floor) selectFloor(floor);
    });
  }

  // Department dropdown handler
  const deptSelect = document.getElementById('department-select');
  if (deptSelect) {
    deptSelect.addEventListener('change', (e) => {
      const dept = e.target.value;
      if (dept) selectDepartment(dept);
    });
  }

  // Search functionality
  const searchInput = document.getElementById('classroom-search');
  if (searchInput) {
    searchInput.addEventListener('input', (e) => {
      searchClassrooms(e.target.value);
    });
  }

  // Type filter handler
  const filterPopup = document.getElementById('type-filter');
  if (filterPopup) {
    filterPopup.querySelectorAll('button[data-filter-value]').forEach(btn => {
      btn.addEventListener('click', () => {
        currentSelection.filter = btn.getAttribute('data-filter-value');
        const q = document.getElementById('classroom-search')?.value || '';
        if (q.trim()) {
          searchClassrooms(q);
        } else {
          updateClassroomsGrid();
        }
        const toggle = document.getElementById('filter-toggle');
        if (toggle) toggle.checked = false;
      });
    });
  }

  // Initialize with engineering building
  selectBuilding('engineering');

  // Initialize indoor navigation controls on this page
  initIndoorNavigation();
}
// select  building
function selectBuilding(building) {
  currentSelection.building = building;
  
  // Reflect selected radio
  document.querySelectorAll('.building-tab').forEach(input => {
    const tabBuilding = input.getAttribute('data-building');
    input.checked = tabBuilding === building;
  });
  
  // Reset floor and department selections
  currentSelection.floor = Object.keys(classroomData[building])[0];
  currentSelection.department = null;
  
  // Populate floor dropdown
  updateFloorDropdown(building);
  selectFloor(currentSelection.floor);
}
// update floor dropdown
function updateFloorDropdown(building) {
  const floorSelect = document.getElementById('floor-select');
  if (!floorSelect) return;
  const availableFloors = Object.keys(classroomData[building]);
  floorSelect.innerHTML = '<option value="">Select floor</option>' +
    availableFloors.map(f => `<option value="${f}">${f === 'ground' ? 'Ground' : f}</option>`).join('');
  floorSelect.value = currentSelection.floor || '';
}

function selectFloor(floor) {
  currentSelection.floor = floor;
  
  // Reflect selected radio
  document.querySelectorAll('.floor-tab').forEach(input => {
    const tabFloor = input.getAttribute('data-floor');
    input.checked = tabFloor === floor;
  });

  // Update department dropdown
  updateDepartmentDropdown();
  
  // Select first department
  const departments = Object.keys(classroomData[currentSelection.building][floor]);
  if (departments.length > 0) {
    currentSelection.department = departments[0];
    selectDepartment(currentSelection.department);
  }
}

function updateDepartmentDropdown() {
  const deptSelect = document.getElementById('department-select');
  if (!deptSelect) return;
  const departments = Object.keys(classroomData[currentSelection.building][currentSelection.floor] || {});
  deptSelect.innerHTML = '<option value="">Select department</option>' +
    departments.map(dept => `<option value="${dept}">${getPrettyDepartmentName(dept)}</option>`).join('');
  deptSelect.value = currentSelection.department || '';
}

function selectDepartment(department) {
  currentSelection.department = department;
  
  // Reflect selected department in dropdown
  const deptSelect = document.getElementById('department-select');
  if (deptSelect) deptSelect.value = department;

  // Update classrooms grid
  updateClassroomsGrid();
}
// classroom grid
function updateClassroomsGrid() {
  const grid = document.getElementById('classrooms-grid');
  const classrooms = classroomData[currentSelection.building][currentSelection.floor][currentSelection.department];
  
  if (!classrooms || classrooms.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No classrooms found for this selection.</div>';
    return;
  }

  const filtered = classrooms.filter((label) => matchFilter(label, currentSelection.filter));
  if (filtered.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No rooms match the selected filter.</div>';
    return;
  }

  grid.innerHTML = filtered.map(classroom => {
    const type = classifyType(classroom);
    const icon = type === 'Lab' ? '💻' : type === 'Staff Room' ? '👥' : type.startsWith('Washroom') ? '🚻' : '🏫';
    
    return `
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4" onclick="showClassroomDetails('${classroom}', '${type}')">
        <div class="text-center">
          <div class="text-3xl mb-2">${icon}</div>
          <h3 class="font-semibold text-[#0d47a1]">${classroom}</h3>
          <p class="text-sm text-gray-600">${type}</p>
          <p class="text-xs text-gray-500 mt-1">${currentSelection.building} • ${currentSelection.floor} • ${currentSelection.department}</p>
        </div>
      </div>
    `;
  }).join('');
  
  // Update navigation info
  updateNavigationInfo();
}

// Update navigation information display
function updateNavigationInfo() {
  const navBuilding = document.getElementById('nav-building');
  const navFloor = document.getElementById('nav-floor');
  const navDepartment = document.getElementById('nav-department');
  
  if (navBuilding) {
    navBuilding.textContent = getPrettyBuildingName(currentSelection.building);
  }
  if (navFloor) {
    navFloor.textContent = currentSelection.floor ? (currentSelection.floor === 'ground' ? 'Ground' : currentSelection.floor.toUpperCase()) : '-';
  }
  if (navDepartment) {
    navDepartment.textContent = getPrettyDepartmentName(currentSelection.department);
  }
}
// classroom details
function showClassroomDetails(classroom, type) {
  const modal = document.getElementById('classroom-modal');
  const title = document.getElementById('modal-title');
  const content = document.getElementById('modal-content');
  
  title.textContent = `${classroom} - ${type}`;
  
  // Generate detailed content based on classroom type
  const isLab = type === 'Lab';
  const capacity = isLab ? Math.floor(Math.random() * 30) + 20 : Math.floor(Math.random() * 50) + 30;
  const equipment = isLab ? ['Computers', 'Projector', 'Whiteboard', 'Lab Equipment'] : ['Projector', 'Whiteboard', 'Audio System', 'Air Conditioning'];
  
  content.innerHTML = `
    <div class="space-y-4">
      <div class="grid grid-cols-2 gap-4">
        <div class="bg-blue-50 p-3 rounded-lg">
          <h4 class="font-semibold text-[#0d47a1]">Capacity</h4>
          <p class="text-lg">${capacity} seats</p>
        </div>
        <div class="bg-green-50 p-3 rounded-lg">
          <h4 class="font-semibold text-[#0d47a1]">Type</h4>
          <p class="text-lg">${type}</p>
        </div>
      </div>
      
      <div class="bg-gray-50 p-3 rounded-lg">
        <h4 class="font-semibold text-[#0d47a1] mb-2">Equipment</h4>
        <div class="flex flex-wrap gap-2">
          ${equipment.map(item => `<span class="bg-white px-2 py-1 rounded text-sm">${item}</span>`).join('')}
        </div>
      </div>
      
      <div class="bg-yellow-50 p-3 rounded-lg">
        <h4 class="font-semibold text-[#0d47a1] mb-2">Location</h4>
        <p>Building: ${getPrettyBuildingName(currentSelection.building)}</p>
        <p>Floor: ${currentSelection.floor}</p>
        <p>Department: ${getPrettyDepartmentName(currentSelection.department)}</p>
      </div>
    </div>
  `;
  
  modal.classList.remove('hidden');
}

function closeClassroomModal() {
  document.getElementById('classroom-modal').classList.add('hidden');
}

// Helpers: classification and filtering
function classifyType(label) {
  const l = label.toLowerCase();
  if (l.includes('washroom (boys)') || (l.includes('washroom') && l.includes('boys'))) return 'Washroom (Boys)';
  if (l.includes('washroom (girls)') || (l.includes('washroom') && l.includes('girls'))) return 'Washroom (Girls)';
  if (l.includes('washroom')) return 'Washroom';
  if (l.includes('staff room') || l.includes('hod cabin') || l.includes('chamber')) return 'Staff Room';
  if (l.includes('lab') || l.includes('library')) return 'Lab';
  return 'Classroom';
}

function matchFilter(label, filter) {
  if (!filter || filter === 'all') return true;
  const type = classifyType(label);
  if (filter === 'classroom') return type === 'Classroom';
  if (filter === 'lab') return type === 'Lab';
  if (filter === 'staffroom') return type === 'Staff Room';
  if (filter === 'washroom-boys') return type === 'Washroom (Boys)';
  if (filter === 'washroom-girls') return type === 'Washroom (Girls)';
  return true;
}

function searchClassrooms(query) {
  if (!query.trim()) {
    updateClassroomsGrid();
    return;
  }
  
  const results = [];
  const searchQuery = query.toLowerCase();
  
  // Search through all buildings, floors, departments, and classrooms
  Object.keys(classroomData).forEach(building => {
    Object.keys(classroomData[building]).forEach(floor => {
      Object.keys(classroomData[building][floor]).forEach(department => {
        classroomData[building][floor][department].forEach(classroom => {
          if (matchFilter(classroom, currentSelection.filter) && (classroom.toLowerCase().includes(searchQuery) || 
              department.toLowerCase().includes(searchQuery) ||
              building.toLowerCase().includes(searchQuery) ||
              floor.toLowerCase().includes(searchQuery))) {
            results.push({
              building,
              floor,
              department,
              classroom,
              type: classifyType(classroom)
            });
          }
        });
      });
    });
  });
  
  // Display search results
  const grid = document.getElementById('classrooms-grid');
  if (results.length === 0) {
    grid.innerHTML = '<div class="col-span-full text-center text-gray-500 py-8">No classrooms found matching your search.</div>';
    return;
  }
  
  grid.innerHTML = results.map(result => {
    const icon = result.type === 'Lab' ? '🔬' : result.type === 'Staff Room' ? '👥' : result.type.startsWith('Washroom') ? '🚻' : '🏫';
    return `
      <div class="bg-white rounded-lg shadow-md hover:shadow-lg transition-shadow cursor-pointer p-4" onclick="showClassroomDetails('${result.classroom}', '${result.type}')">
        <div class="text-center">
          <div class="text-3xl mb-2">${icon}</div>
          <h3 class="font-semibold text-[#0d47a1]">${result.classroom}</h3>
          <p class="text-sm text-gray-600">${result.type}</p>
          <p class="text-xs text-gray-500 mt-1">${result.building} • ${result.floor} • ${result.department}</p>
        </div>
      </div>
    `;
  }).join('');
}
// photo container
function createPhoto(url, altText, className, fallbackText) {
  const container = document.createElement("div");
  container.className = "photo-container";

  const img = document.createElement("img");
  img.src = url;
  img.alt = altText;
  img.className = className;

  img.onerror = function () {
    img.style.display = "none";
    const fallback = document.createElement("div");
    fallback.className = "photo-fallback";
    fallback.innerText = fallbackText;
    container.appendChild(fallback);
  };

  container.appendChild(img);
  return container;
}

function renderFacultyList(facultyArray) {
  const facultyContainer = document.getElementById("faculty-container");

  facultyArray.forEach(f => {
    const card = document.createElement("div");
    card.className = "faculty-card";

    // photo (or initials fallback)
    const initials = f.name.split(" ").map(n => n[0]).join("").slice(0, 2);
    const photoBox = createPhoto(f.photo || "", f.name, "faculty-photo", initials);

    // faculty info
    const info = document.createElement("div");
    info.className = "faculty-info";
    info.innerHTML = `
      <h3>${f.name}</h3>
      <p><strong>Qualification:</strong> ${f.qualification}</p>
      <p><strong>Specialization:</strong> ${f.specialization}</p>
    `;

    card.appendChild(photoBox);
    card.appendChild(info);
    facultyContainer.appendChild(card);
  });
}

// call render function (guard if data not present)
try {
  if (typeof faculty !== 'undefined' && Array.isArray(faculty)) {
    renderFacultyList(faculty);
  }
} catch (_) {}


// ---------- Public navigation helpers for Chatbot integration ----------
window.campusNav = {
  listBuildings: function () {
    return Object.keys(classroomData);
  },
  listFloors: function (building) {
    if (!building || !classroomData[building]) return [];
    return Object.keys(classroomData[building]);
  },
  listDepartments: function (building, floor) {
    if (!building || !floor) return [];
    return Object.keys((classroomData[building] && classroomData[building][floor]) || {});
  },
  getRooms: function (building, floor, department) {
    if (!building || !floor || !department) return [];
    const rooms = (((classroomData[building] || {})[floor] || {})[department]) || [];
    return Array.isArray(rooms) ? rooms.slice() : [];
  },
  searchRooms: function (query) {
    const q = (query || '').toLowerCase();
    const results = [];
    if (!q) return results;
    Object.keys(classroomData).forEach(b => {
      Object.keys(classroomData[b]).forEach(f => {
        Object.keys(classroomData[b][f]).forEach(d => {
          classroomData[b][f][d].forEach(r => {
            const hit = r.toLowerCase().includes(q) || b.toLowerCase().includes(q) || f.toLowerCase().includes(q) || d.toLowerCase().includes(q);
            if (hit) results.push({ building: b, floor: f, department: d, room: r });
          });
        });
      });
    });
    return results;
  },
  summarizeSelection: function (opts) {
    const b = opts.building || currentSelection.building;
    const f = opts.floor || currentSelection.floor;
    const d = opts.department || currentSelection.department;
    const rooms = this.getRooms(b, f, d).slice(0, 10);
    if (!rooms.length) {
      return `No rooms found for ${getPrettyBuildingName(b)} • ${f} • ${getPrettyDepartmentName(d)}`;
    }
    const list = rooms.map((r, i) => `${i + 1}. ${r}`).join('\n');
    return `Showing ${rooms.length} rooms for ${getPrettyBuildingName(b)} • ${f} • ${getPrettyDepartmentName(d)}:\n${list}`;
  },
  summarizeSearch: function (query) {
    const results = this.searchRooms(query).slice(0, 10);
    if (!results.length) return `No matches for "${query}"`;
    const list = results.map((x, i) => `${i + 1}. ${x.room} — ${getPrettyBuildingName(x.building)} • ${x.floor} • ${getPrettyDepartmentName(x.department)}`).join('\n');
    return `Top matches for "${query}":\n${list}`;
  },
  // Heuristic intent resolver that considers the entire classroomData
  resolveIntent: function (text) {
    const t = (text || '').toLowerCase();
    const buildingAliases = {
      'engineering': 'engineering', 'engg': 'engineering', 'main': 'engineering',
      'it': 'it-mba', 'it/mba': 'it-mba', 'mba': 'it-mba',
      'uni': 'uni', 'university': 'uni',
      'diploma': 'diploma', 'pharmacy': 'pharmacy', 'sims': 'sims',
      'junior': 'junior-college', 'junior college': 'junior-college'
    };
    const floorAliases = { 'ground': 'ground', 'g': 'ground', '0': 'ground', 'first': '1st', '1st': '1st', 'second': '2nd', '2nd': '2nd', 'third': '3rd', '3rd': '3rd', '4th': '4th', '5th': '5th' };
    const normalize = (s) => (s || '').toLowerCase();

    let building, floor, department, query;
    // building
    Object.keys(buildingAliases).forEach(k => { if (t.includes(k)) building = buildingAliases[k]; });
    // floor
    Object.keys(floorAliases).forEach(k => { if (t.includes(k)) floor = floorAliases[k]; });
    // detect department by name presence against master set aggregated from data
    const deptSet = new Set();
    Object.keys(classroomData).forEach(b => {
      Object.keys(classroomData[b]).forEach(f => {
        Object.keys(classroomData[b][f]).forEach(d => deptSet.add(d));
      });
    });
    deptSet.forEach(d => { if (t.includes(normalize(d))) department = d; });
    // common department synonyms
    const deptAliases = { 'computer': 'computer', 'comp': 'computer', 'mechanical': 'mechanical', 'mech': 'mechanical', 'ece': 'ece', 'civil': 'civil', 'electrical': 'electrical', 'mechatronics': 'mechatronics', 'structural': 'structural', 'it department': 'it-department', 'first year': 'first-year' };
    Object.keys(deptAliases).forEach(k => { if (t.includes(k)) department = deptAliases[k]; });

    // direct room number or keywords to use as search query
    const numMatch = t.match(/\b([a-z]?-?\d{2,3})\b/);
    if (numMatch) query = numMatch[1];
    if (!query && (t.includes('washroom') || t.includes('toilet'))) {
      if (t.includes('boys')) query = 'washroom (boys)';
      else if (t.includes('girls')) query = 'washroom (girls)';
      else query = 'washroom';
    }
    if (!query && (t.includes('lab') || t.includes('library') || t.includes('hod') || t.includes('seminar') || t.includes('classroom'))) {
      // keep the whole text as query for broader search
      query = text;
    }

    return { building, floor, department, query };
  },
  navigateTo: function (opts) {
    const options = opts || {};

    // Ensure we are on the classrooms page first
    const go = () => {
      // Helpers for fuzzy matching
      const normalize = (s) => (s || '').toString().trim().toLowerCase();
      const buildingAliases = {
        'engineering': 'engineering', 'engg': 'engineering',
        'it': 'it-mba', 'it/mba': 'it-mba', 'mba': 'it-mba',
        'uni': 'uni', 'university': 'uni',
        'diploma': 'diploma', 'pharmacy': 'pharmacy',
        'sims': 'sims', 'junior': 'junior-college', 'junior college': 'junior-college'
      };
      const floorAliases = { 'ground': 'ground', '0': 'ground', 'g': 'ground', 'first': '1st', '1st': '1st', 'second': '2nd', '2nd': '2nd', 'third': '3rd', '3rd': '3rd', '4th': '4th', '5th': '5th' };

      let b = options.building;
      if (b && !classroomData[b]) b = buildingAliases[normalize(b)];
      if (!b || !classroomData[b]) b = currentSelection.building || Object.keys(classroomData)[0];
      selectBuilding(b);

      let f = options.floor;
      if (f && !classroomData[b][f]) f = floorAliases[normalize(f)];
      if (!f || !classroomData[b][f]) f = Object.keys(classroomData[b])[0];
      selectFloor(f);

      let d = options.department;
      const availableDepts = Object.keys(classroomData[b][f] || {});
      if (d) {
        const dn = normalize(d);
        let exact = availableDepts.find(x => normalize(x) === dn);
        if (!exact) exact = availableDepts.find(x => normalize(x).includes(dn));
        d = exact || availableDepts[0];
      } else {
        d = availableDepts[0];
      }
      if (d) selectDepartment(d);

      if (typeof options.query === 'string') {
        const input = document.getElementById('classroom-search');
        if (input) input.value = options.query;
        searchClassrooms(options.query);
      } else {
        updateClassroomsGrid();
      }
    };

    if (!document.getElementById('classrooms-grid')) {
      if (typeof window.loadPage === 'function') {
        window.loadPage('classrooms');
        setTimeout(go, 0);
      } else {
        go();
      }
    } else {
      go();
    }
  }
};

// ----- Indoor Navigation (Engineering building) -----
function initIndoorNavigation() {
  const imgEl = document.getElementById('indoor-floor-img');
  const canvas = document.getElementById('indoor-overlay');
  const wrap = document.getElementById('indoor-plan-wrap');
  const floorSel = document.getElementById('indoor-floor-select');
  const startInput = document.getElementById('indoor-start-input');
  const endInput = document.getElementById('indoor-end-input');
  const startList = document.getElementById('indoor-start-list');
  const endList = document.getElementById('indoor-end-list');
  // Manual POI controls removed in automatic mode
  const drawBtn = document.getElementById('indoor-draw-route');
  const clearBtn = document.getElementById('indoor-clear-route');
  const changeFloorBtn = document.getElementById('indoor-change-floor');
  const nextStepBtn = document.getElementById('indoor-next-step');
  const previousStepBtn = document.getElementById('indoor-previous-step');
  const stepInfo = document.getElementById('navigation-step-info');
  const stepCounter = document.getElementById('step-counter');
  const stepDescription = document.getElementById('step-description');
  const scanBtn = document.getElementById('indoor-scan-text');
  const ocrOut = document.getElementById('indoor-ocr-output');
  if (!imgEl || !canvas || !wrap || !floorSel || !startInput || !endInput) return;

  const floorToImage = {
    ground: './Ground Floor(Engg. Building).png',
    first: './1st Floor(Engg. Building).png',
    second: './2nd Floor(Engg. Building).png'
  };

  function normalizeFloorKey(key) {
    if (!key) return 'ground';
    const k = String(key).toLowerCase();
    if (k === '1st' || k === 'first') return '1st';
    if (k === '2nd' || k === 'second') return '2nd';
    if (k === '3rd' || k === 'third') return '3rd';
    if (k === '4th' || k === 'fourth') return '4th';
    if (k === '5th' || k === 'fifth') return '5th';
    if (k === 'ground' || k === 'g' || k === '0') return 'ground';
    return k;
  }

  // Room coordinates on floor plans (as percentages)
  const roomCoordinates = {
    'ground': {
      '020 - Washroom (Boys)': { xPct: 15, yPct: 55 },
      '016 - Manufacturing Science Lab': { xPct: 10, yPct: 65 },
      '017 - Thermal Lab 2 / Staff Room': { xPct: 10, yPct: 60 },
      '018 - Tutorial Room': { xPct: 10, yPct: 50 },
      '019 - Machine Lab / Staff Room': { xPct: 10, yPct: 45 },
      '021 - Metallurgy Lab / Staff Room': { xPct: 10, yPct: 40 },
      '022 - Fluid Mechanics Lab': { xPct: 10, yPct: 30 },
      '023 - Geotechnical Engineering Lab': { xPct: 10, yPct: 25 },
      '024 - Seminar Hall': { xPct: 8, yPct: 15 },
      '025 - Seminar Hall': { xPct: 8, yPct: 10 },
      '026 - Staff Room': { xPct: 12, yPct: 20 },
      '027 - Thermal Lab 1': { xPct: 10, yPct: 35 },
      '028 - Engineering Chemistry Lab / Staff Room': { xPct: 10, yPct: 70 },
      '001 - Director Cabin (Dr. M. V. Nagarhalli)': { xPct: 85, yPct: 90 },
      '005 - Student Section': { xPct: 85, yPct: 85 },
      '006 - Dean Academics': { xPct: 85, yPct: 80 },
      '007 - Department Office (Dr. D.B. Kshirsagar)': { xPct: 85, yPct: 75 },
      '008 - IoT and CG Lab': { xPct: 90, yPct: 65 },
      '009 - AI and ML Lab': { xPct: 90, yPct: 60 },
      '010 - Analog and Digital Communication Lab / Staff Room': { xPct: 90, yPct: 55 },
      '011 - Washroom': { xPct: 90, yPct: 50 },
      '012 - Tutorial Room': { xPct: 90, yPct: 45 },
      '013 - Test Measurement Lab': { xPct: 90, yPct: 40 },
      '014 - Staff Room': { xPct: 90, yPct: 35 },
      '029 - Research Lab / Dr. M. A. Sayyad': { xPct: 90, yPct: 30 },
      '030 - ES and DSP Lab': { xPct: 85, yPct: 25 },
      '031 - Printed Circuit Board Lab': { xPct: 85, yPct: 20 },
      '032 - Project Lab / Prof. N. Y. Siddiqui': { xPct: 85, yPct: 15 },
      '033 - Prof. Shailesh Kulkarni': { xPct: 90, yPct: 20 },
      '034 - PG Lab': { xPct: 90, yPct: 15 },
      '035 - Electronics Lab / Prof. S. V. Chaudhari': { xPct: 90, yPct: 10 },
      '036 - Prof. N. K. Darwante': { xPct: 85, yPct: 10 },
      '037 - Department Library': { xPct: 85, yPct: 45 },
      '038 - BEE Lab / Staff Room': { xPct: 88, yPct: 70 },
      '039 - Tutorial Room': { xPct: 88, yPct: 75 },
      '040 - Electrical Machine Lab 1': { xPct: 88, yPct: 80 },
      '041 - Electrical Machine Lab 1': { xPct: 88, yPct: 85 },
      '042 - Reprographic Facility (Xerox)': { xPct: 85, yPct: 50 },
      '043 - Office College of Engineering / Registrar': { xPct: 85, yPct: 55 }
    },
    '1st': {
      '109 - HOD Cabin': { xPct: 15, yPct: 85 },
      '110 - Manufacturing Lab 1': { xPct: 15, yPct: 80 },
      '111 - Conference Hall': { xPct: 12, yPct: 60 },
      '112 - Conference Hall': { xPct: 12, yPct: 55 },
      '113 - Chamber / Staff Room': { xPct: 10, yPct: 50 },
      '114 - Chamber / Staff Room': { xPct: 10, yPct: 45 },
      '115 - Classroom': { xPct: 10, yPct: 40 },
      '116 - Washroom (Boys)': { xPct: 10, yPct: 35 },
      '117 - Washroom (Girls)': { xPct: 10, yPct: 25 },
      '118 - Tutorial Room': { xPct: 10, yPct: 20 },
      '119 - Manufacturing Lab 2': { xPct: 10, yPct: 15 },
      '120 - Manufacturing Lab 3': { xPct: 10, yPct: 10 },
      '121 - CAD Lab': { xPct: 10, yPct: 30 },
      '122 - CAD Lab': { xPct: 10, yPct: 65 },
      '123 - Manufacturing Design Lab': { xPct: 15, yPct: 75 },
      '124 - Workshop': { xPct: 10, yPct: 5 },
      '125 - Workshop': { xPct: 12, yPct: 70 },
      '126 - Workshop': { xPct: 12, yPct: 65 },
      '201 - HOD Cabin': { xPct: 85, yPct: 85 },
      '202 - Research Lab / Dr. S.K.Parkale': { xPct: 90, yPct: 70 },
      '203 - IoT and CG Lab': { xPct: 90, yPct: 65 },
      '204 - AI and ML Lab': { xPct: 90, yPct: 60 },
      '205 - Analog and Digital Communication Lab / Staff Room': { xPct: 90, yPct: 55 },
      '206 - Washroom (Boys)': { xPct: 90, yPct: 50 },
      '207 - Washroom (Girls)': { xPct: 85, yPct: 50 },
      '208 - Tutorial Room': { xPct: 85, yPct: 45 },
      '209 - Test Measurement Lab': { xPct: 85, yPct: 40 },
      '210 - Staff Room': { xPct: 85, yPct: 35 },
      '211 - ES and DSP Lab': { xPct: 85, yPct: 30 },
      '212 - Printed Circuit Board Lab': { xPct: 85, yPct: 25 },
      '213 - Project Lab / Prof. N. Y. Siddiqui': { xPct: 85, yPct: 20 },
      '214 - PG Lab': { xPct: 85, yPct: 15 },
      '215 - Electronics Lab / Prof. S. V. Chaudhari': { xPct: 85, yPct: 10 },
      '216 - Department Library': { xPct: 88, yPct: 60 },
      '217 - BEE Lab / Staff Room': { xPct: 88, yPct: 75 },
      '218 - Tutorial Room': { xPct: 88, yPct: 80 }
    },
    '2nd': {
      '239 - Staff Room': { xPct: 10, yPct: 50 },
      '240 - Staff Room': { xPct: 10, yPct: 45 }
    }
  };

  // Anchor points per floor for default routing (lobby and stairs in percentages)
  const floorAnchors = {
    ground: { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } },
    first:  { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } },
    second: { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } },
    '1st':  { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } },
    '2nd':  { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } },
    '3rd':  { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } },
    '4th':  { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } },
    '5th':  { lobby: { xPct: 50, yPct: 50 }, stairs: { xPct: 50, yPct: 60 } }
  };

  // Persisted POIs per floor: { name, xPct, yPct }
  function loadPOIs(floor) {
    try { return JSON.parse(localStorage.getItem('indoorPois_' + floor)) || []; } catch (_) { return []; }
  }
  function savePOIs(floor, pois) {
    try { localStorage.setItem('indoorPois_' + floor, JSON.stringify(pois)); } catch (_) {}
  }

  let pendingPOIName = '';

  function setFloorImage(floorKey) {
    const fk = normalizeFloorKey(floorKey);
    const src = floorToImage[fk] || floorToImage.ground;
    imgEl.src = src;
    // keep the UI floor selector in sync
    if (floorSel) floorSel.value = fk;
    // when image loads/reflow, resize canvas
    requestAnimationFrame(resizeCanvas);
    clearRoute();
  }

  function resizeCanvas() {
    const rect = wrap.getBoundingClientRect();
    canvas.width = rect.width;
    canvas.height = rect.height;
    // after resize, re-draw any existing route
    if (_currentPath && _currentPath.length) drawPath(_currentPath);
  }

  window.addEventListener('resize', resizeCanvas);
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(resizeCanvas);
  imgEl.addEventListener('load', resizeCanvas);

  function getActiveFloorKey() {
    return normalizeFloorKey(floorSel.value || 'ground');
  }

  // Build a comprehensive index of all rooms/labs across all buildings
  function buildComprehensiveIndex() {
    const list = [];
    Object.keys(classroomData).forEach(building => {
      Object.keys(classroomData[building]).forEach(floor => {
        Object.keys(classroomData[building][floor]).forEach(dept => {
          classroomData[building][floor][dept].forEach(name => {
            list.push({ name, building, floor, department: dept });
          });
        });
      });
    });
    return list;
  }

  const comprehensiveIndex = buildComprehensiveIndex();

  function populateFromIndex() {
    const startOpts = comprehensiveIndex.map((p) => `<option value="${p.name}"></option>`).join('');
    const endOpts = startOpts;
    if (startList) startList.innerHTML = startOpts;
    if (endList) endList.innerHTML = endOpts;
  }

  function resolveByName(name) {
    if (!name) return null;
    const q = name.toLowerCase().trim();
    return comprehensiveIndex.find(p => p.name.toLowerCase() === q)
        || comprehensiveIndex.find(p => p.name.toLowerCase().includes(q));
  }

  function addPoiAt(xClient, yClient) {
    // Manual POI adding disabled for auto navigation; keep for fallback if needed
    if (!pendingPOIName) return;
  }

  function drawMarkers() {
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    const floorKey = getActiveFloorKey();
    // Draw anchors (stairs and lobby) for user reference
    const anchors = floorAnchors[floorKey];
    ctx.font = '12px Arial, sans-serif';
    ctx.textBaseline = 'middle';
    // stairs
    const sx = (anchors.stairs.xPct / 100) * canvas.width;
    const sy = (anchors.stairs.yPct / 100) * canvas.height;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(180,0,120,0.95)';
    ctx.arc(sx, sy, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.strokeText('Stairs', sx + 8, sy);
    ctx.fillStyle = '#000'; ctx.fillText('Stairs', sx + 8, sy);
    // lobby
    const lx = (anchors.lobby.xPct / 100) * canvas.width;
    const ly = (anchors.lobby.yPct / 100) * canvas.height;
    ctx.beginPath();
    ctx.fillStyle = 'rgba(13,71,161,0.95)';
    ctx.arc(lx, ly, 6, 0, Math.PI * 2);
    ctx.fill();
    ctx.lineWidth = 3; ctx.strokeStyle = 'rgba(255,255,255,0.9)';
    ctx.strokeText('Lobby', lx + 8, ly);
    ctx.fillStyle = '#000'; ctx.fillText('Lobby', lx + 8, ly);
  }

  let _currentPath = [];
  function clearRoute() {
    _currentPath = [];
    navigationSteps = [];
    currentStepIndex = 0;
    updateNextStepButton();
    drawMarkers();
  }

  // Keep drawings inside the visible floor area
  const DRAW_PADDING = 10;
  function clamp(v, min, max) {
    return Math.max(min, Math.min(max, v));
  }
  function clampPoint(p) {
    return {
      x: clamp(p.x, DRAW_PADDING, canvas.width - DRAW_PADDING),
      y: clamp(p.y, DRAW_PADDING, canvas.height - DRAW_PADDING)
    };
  }

  function drawArrow(ctx, fromX, fromY, toX, toY) {
    const headLength = 12;
    // Clamp end points to ensure arrowhead stays inside the canvas
    const from = clampPoint({ x: fromX, y: fromY });
    const to = clampPoint({ x: toX, y: toY });
    const dx = to.x - from.x;
    const dy = to.y - from.y;
    const angle = Math.atan2(dy, dx);
    ctx.beginPath();
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle - Math.PI / 6),
      to.y - headLength * Math.sin(angle - Math.PI / 6)
    );
    ctx.moveTo(to.x, to.y);
    ctx.lineTo(
      to.x - headLength * Math.cos(angle + Math.PI / 6),
      to.y - headLength * Math.sin(angle + Math.PI / 6)
    );
    ctx.stroke();
  }

  function drawPath(points) {
    const ctx = canvas.getContext('2d');
    drawMarkers(); // keep dots
    if (!points || points.length < 2) return;

    // Clamp all points to remain inside a padded rect
    const clamped = points.map(clampPoint);

    // Clip to padded rectangle so nothing renders outside the floor
    ctx.save();
    ctx.beginPath();
    ctx.rect(
      DRAW_PADDING,
      DRAW_PADDING,
      Math.max(0, canvas.width - 2 * DRAW_PADDING),
      Math.max(0, canvas.height - 2 * DRAW_PADDING)
    );
    ctx.clip();

    ctx.lineWidth = 4;
    ctx.strokeStyle = 'rgba(0,180,120,0.95)';
    ctx.lineJoin = 'round';
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(clamped[0].x, clamped[0].y);
    for (let i = 1; i < clamped.length; i++) {
      ctx.lineTo(clamped[i].x, clamped[i].y);
    }
    ctx.stroke();

    // Shorten last segment so the arrowhead doesn’t escape the bounds
    const n = clamped.length;
    const headLength = 12;
    const from = clamped[n - 2];
    const to = clamped[n - 1];
    const vx = to.x - from.x;
    const vy = to.y - from.y;
    const len = Math.hypot(vx, vy) || 1;
    const endX = to.x - (headLength * vx) / len;
    const endY = to.y - (headLength * vy) / len;
    drawArrow(ctx, from.x, from.y, endX, endY);

    ctx.restore();
  }

  function computeShortArrowAt(centerPct) {
    const cx = (centerPct.xPct / 100) * canvas.width;
    const cy = (centerPct.yPct / 100) * canvas.height;
    const offset = 40; // 40px to the right
    return [ { x: cx - offset/2, y: cy }, { x: cx + offset/2, y: cy } ];
  }

  // Compute route between two anchors on current canvas
  function computeRouteBetween(aPct, bPct) {
    const a = { x: (aPct.xPct / 100) * canvas.width, y: (aPct.yPct / 100) * canvas.height };
    const b = { x: (bPct.xPct / 100) * canvas.width, y: (bPct.yPct / 100) * canvas.height };
    const midY = (a.y + b.y) / 2;
    const mid = { x: (a.x + b.x) / 2, y: midY };
    return [a, mid, b];
  }

  // Helper: convert percentage point to canvas px
  function pctToPx(pt) {
    return { x: (pt.xPct / 100) * canvas.width, y: (pt.yPct / 100) * canvas.height };
  }

  // Doorway on corridor centerline for a room
  function doorwayPctForRoom(roomPct, floorKey) {
    const fk = normalizeFloorKey(floorKey);
    const anchors = floorAnchors[fk];
    const hallwayYPct = anchors.lobby.yPct;
    return { xPct: roomPct.xPct, yPct: hallwayYPct };
  }

  // Orthogonal hallway route: doorway -> corridor center -> doorway
  function computeDoorToDoorPolyline(aPct, bPct, floorKey) {
    const fk = normalizeFloorKey(floorKey);
    const anchors = floorAnchors[fk];
    if (!anchors) return computeRouteBetween(aPct, bPct);
    const Adoor = pctToPx(doorwayPctForRoom(aPct, fk));
    const Bdoor = pctToPx(doorwayPctForRoom(bPct, fk));
    // Draw only along corridor, from doorway to doorway
    return [Adoor, Bdoor];
  }

  // Start doorway -> along corridor -> stairs node (then up)
  function computeDoorToStairsPolyline(roomPct, floorKey) {
    const fk = normalizeFloorKey(floorKey);
    const anchors = floorAnchors[fk];
    if (!anchors) return [];
    const hallwayYPct = anchors.lobby.yPct;
    const stairs = anchors.stairs;
    const startDoor = pctToPx(doorwayPctForRoom(roomPct, fk));
    const stairsDoor = pctToPx({ xPct: stairs.xPct, yPct: hallwayYPct });
    const stairsNode = pctToPx({ xPct: stairs.xPct, yPct: stairs.yPct });
    return [startDoor, stairsDoor, stairsNode];
  }

  // From stairs node down to corridor center then to destination doorway
  function computeStairsToDoorPolyline(floorKey, destPct) {
    const fk = normalizeFloorKey(floorKey);
    const anchors = floorAnchors[fk];
    if (!anchors) return [];
    const hallwayYPct = anchors.lobby.yPct;
    const stairs = anchors.stairs;
    const stairsNode = pctToPx({ xPct: stairs.xPct, yPct: stairs.yPct });
    const stairsDoor = pctToPx({ xPct: stairs.xPct, yPct: hallwayYPct });
    const destDoor = pctToPx(doorwayPctForRoom(destPct, fk));
    return [stairsNode, stairsDoor, destDoor];
  }

  // Get room coordinates from lookup
  function getRoomCoordinates(floorKey, roomName) {
    const floor = normalizeFloorKey(floorKey);
    const floorRooms = roomCoordinates[floor];
    if (!floorRooms) return null;
    return floorRooms[roomName] || null;
  }

  // Compute route from a room to stairs or between rooms
  function computeRoomRoute(startRoomName, destRoomName, floorKey) {
    const fk = normalizeFloorKey(floorKey);
    const startCoords = getRoomCoordinates(fk, startRoomName);
    const destCoords = getRoomCoordinates(fk, destRoomName);
    
    // If we have coordinates for both rooms, compute direct route
    if (startCoords && destCoords) {
      return computeDoorToDoorPolyline(startCoords, destCoords, fk);
    }
    
    // If only start room, route to stairs
    if (startCoords && !destRoomName) {
      const anchors = floorAnchors[fk];
      if (!anchors) return [];
      const stairs = anchors.stairs;
      const stairsCoords = { xPct: stairs.xPct, yPct: stairs.yPct };
      // doorway -> corridor -> stairs
      return computeDoorToStairsPolyline(startCoords, fk);
    }
    
    // If only dest room, route from stairs
    if (destCoords && !startRoomName) {
      const anchors = floorAnchors[fk];
      if (!anchors) return [];
      // stairs -> corridor -> doorway
      return computeStairsToDoorPolyline(fk, destCoords);
    }
    
    // Fallback: use stairs-based routing
    const isRight = guessRoomSide(destRoomName || startRoomName);
    return computeStairsToSideRoute(fk, isRight);
  }

  function computeStairsToSideRoute(floorKey, destIsRightSide) {
    const fk = normalizeFloorKey(floorKey);
    const anchors = floorAnchors[fk];
    if (!anchors) return [];
    const stairs = anchors.stairs;
    const lobby = anchors.lobby;
    // Determine right/left based on lobby.x (center) and desired side
    const sideX = destIsRightSide ? 85 : 15; // percent near edges
    const side = { xPct: sideX, yPct: lobby.yPct };
    return computeRouteBetween(stairs, side);
  }

  function routeAcrossFloors(startItem, destItem) {
    // Calculate navigation steps for step-by-step navigation
    navigationSteps = calculateNavigationSteps(startItem, destItem);
    currentStepIndex = 0;
    updateNextStepButton();
    
    // Show the first step immediately
    if (navigationSteps.length > 0) {
      const firstStep = navigationSteps[0];
      setFloorImage(firstStep.floor);
      
      // Draw the route for the first step
      setTimeout(() => {
        if (firstStep.route) {
          _currentPath = firstStep.route();
          drawPath(_currentPath);
        }
      }, 150);
      
      console.log('Navigation Step:', firstStep.description);
    }
  }

  function guessRoomSide(roomName) {
    // simple heuristic: if room number ends with 0-4 -> left, 5-9 -> right
    const m = (roomName || '').match(/\b(\d{2,3})\b/);
    if (!m) return true; // default to right
    const last = parseInt(m[1][m[1].length - 1], 10);
    return last >= 5;
  }

  // Events
  floorSel.addEventListener('change', () => {
    setFloorImage(getActiveFloorKey());
  });

  // Manual POI adding disabled (automatic index mode)

  // click to place POI when pending
  // Map click no-op in automatic mode

  drawBtn?.addEventListener('click', () => {
    const startItem = resolveByName(startInput?.value || '');
    const destItem = resolveByName(endInput?.value || '');
    if (!startItem || !destItem) { alert('Select both current location and destination.'); return; }
    routeAcrossFloors(startItem, destItem);
  });

  clearBtn?.addEventListener('click', () => {
    clearRoute();
  });

  changeFloorBtn?.addEventListener('click', () => {
    const s = resolveByName(startInput?.value || '');
    const d = resolveByName(endInput?.value || '');
    if (s && d && normalizeFloorKey(s.floor) !== normalizeFloorKey(d.floor)) {
      // Toggle between source and destination floor
      const current = getActiveFloorKey();
      const next = current === normalizeFloorKey(s.floor) ? d.floor : s.floor;
      setFloorImage(next);
    }
  });

  // Step-by-step navigation logic
  let navigationSteps = [];
  let currentStepIndex = 0;

  function calculateNavigationSteps(start, destination) {
    const startFloor = normalizeFloorKey(start.floor);
    const destFloor = normalizeFloorKey(destination.floor);
    const startBuilding = start.building;
    const destBuilding = destination.building;
    
    // If different buildings, we need to handle inter-building navigation
    if (startBuilding !== destBuilding) {
      return calculateInterBuildingSteps(start, destination);
    }
    
    // Same building navigation
    return calculateIntraBuildingSteps(start, destination);
  }

  function calculateIntraBuildingSteps(start, destination) {
    const startFloor = normalizeFloorKey(start.floor);
    const destFloor = normalizeFloorKey(destination.floor);
    
    // Define floor order for each building
    const floorOrder = getFloorOrder(start.building);
    const startIndex = floorOrder.indexOf(startFloor);
    const destIndex = floorOrder.indexOf(destFloor);
    
    if (startIndex === -1 || destIndex === -1) return [];
    
    const steps = [];
    
    // If same floor: direct route
    if (startIndex === destIndex) {
      steps.push({
        floor: startFloor,
        action: 'direct',
        description: `Navigate to ${destination.name}`,
        route: () => {
          const fk = normalizeFloorKey(startFloor);
          return computeRoomRoute(start.name, destination.name, fk);
        }
      });
      return steps;
    }
    
    // Different floors: multi-step navigation
    const isGoingUp = destIndex > startIndex;
    
    // Step 1: Start location to stairs on current floor
    steps.push({
      floor: startFloor,
      action: 'to_stairs',
      description: `Go from ${start.name} to stairs on ${getFloorDisplayName(startFloor)}`,
      route: () => {
        const fk = normalizeFloorKey(startFloor);
        return computeRoomRoute(start.name, null, fk);
      }
    });
    
    // Intermediate floors (if going up multiple floors)
    if (isGoingUp) {
      for (let i = startIndex + 1; i < destIndex; i++) {
        steps.push({
          floor: floorOrder[i],
          action: 'climb_stairs',
          description: `Climb stairs to ${getFloorDisplayName(floorOrder[i])}`,
          route: () => {
            const fk = normalizeFloorKey(floorOrder[i]);
            return computeStairsToSideRoute(fk, true); // Show stairs area
          }
        });
      }
    } else {
      // Going down floors
      for (let i = startIndex - 1; i > destIndex; i--) {
        steps.push({
          floor: floorOrder[i],
          action: 'descend_stairs',
          description: `Go down stairs to ${getFloorDisplayName(floorOrder[i])}`,
          route: () => {
            const fk = normalizeFloorKey(floorOrder[i]);
            return computeStairsToSideRoute(fk, true); // Show stairs area
          }
        });
      }
    }
    
    // Final step: stairs to destination on target floor
    steps.push({
      floor: destFloor,
      action: 'to_destination',
      description: `Go from stairs to ${destination.name} on ${getFloorDisplayName(destFloor)}`,
      route: () => {
        const fk = normalizeFloorKey(destFloor);
        return computeRoomRoute(null, destination.name, fk);
      }
    });
    
    return steps;
  }

  function calculateInterBuildingSteps(start, destination) {
    const steps = [];
    
    // Step 1: Go to building exit/entrance
    steps.push({
      floor: normalizeFloorKey(start.floor),
      action: 'to_exit',
      description: `Go from ${start.name} to ${start.building} building exit`,
      route: () => {
        const fk = normalizeFloorKey(start.floor);
        return computeRoomRoute(start.name, null, fk);
      }
    });
    
    // Step 2: Navigate to destination building
    steps.push({
      floor: normalizeFloorKey(destination.floor),
      action: 'to_destination',
      description: `Go to ${destination.building} building and find ${destination.name}`,
      route: () => {
        const fk = normalizeFloorKey(destination.floor);
        return computeRoomRoute(null, destination.name, fk);
      }
    });
    
    return steps;
  }

  function getFloorOrder(building) {
    // Define floor order for each building
    const buildingFloorOrders = {
      'engineering': ['ground', '1st', '2nd'],
      'it-mba': ['ground', '1st', '2nd', '3rd', '4th', '5th'],
      'uni': ['ground'],
      'diploma': ['ground']
    };
    
    return buildingFloorOrders[building] || ['ground'];
  }

  function getFloorDisplayName(floorKey) {
    const floorNames = {
      'ground': 'Ground Floor',
      'first': '1st Floor',
      'second': '2nd Floor',
      '1st': '1st Floor',
      '2nd': '2nd Floor',
      '3rd': '3rd Floor',
      '4th': '4th Floor',
      '5th': '5th Floor'
    };
    return floorNames[floorKey] || floorKey;
  }

  function updateNextStepButton() {
    if (!nextStepBtn || !previousStepBtn) return;
    
    if (navigationSteps.length === 0) {
      nextStepBtn.textContent = '➡️ Next Step';
      nextStepBtn.disabled = true;
      previousStepBtn.textContent = '⬅️ Previous Step';
      previousStepBtn.disabled = true;
      
      // Hide step info
      if (stepInfo) stepInfo.classList.add('hidden');
      return;
    }
    
    // Show step info
    if (stepInfo) stepInfo.classList.remove('hidden');
    
    // Update step counter and description
    if (stepCounter && stepDescription && navigationSteps[currentStepIndex]) {
      const currentStep = navigationSteps[currentStepIndex];
      stepCounter.textContent = `Step ${currentStepIndex + 1} of ${navigationSteps.length}`;
      stepDescription.textContent = currentStep.description;
    }
    
    // Update Previous Step button
    if (currentStepIndex <= 0) {
      previousStepBtn.textContent = '⬅️ Previous Step';
      previousStepBtn.disabled = true;
    } else {
      previousStepBtn.textContent = '⬅️ Previous Step';
      previousStepBtn.disabled = false;
    }
    
    // Update Next Step button
    if (currentStepIndex >= navigationSteps.length - 1) {
      nextStepBtn.textContent = '✅ Complete';
      nextStepBtn.disabled = true;
    } else {
      nextStepBtn.textContent = '➡️ Next Step';
      nextStepBtn.disabled = false;
    }
  }

  nextStepBtn?.addEventListener('click', () => {
    if (navigationSteps.length === 0 || currentStepIndex >= navigationSteps.length - 1) {
      return;
    }
    
    currentStepIndex++;
    const nextStep = navigationSteps[currentStepIndex];
    setFloorImage(nextStep.floor);
    
    // Draw the route for this step
    setTimeout(() => {
      if (nextStep.route) {
        _currentPath = nextStep.route();
        drawPath(_currentPath);
      }
    }, 150);
    
    // Show step description
    if (nextStep.description) {
      console.log('Navigation Step:', nextStep.description);
    }
    
    updateNextStepButton();
  });

  previousStepBtn?.addEventListener('click', () => {
    if (navigationSteps.length === 0 || currentStepIndex <= 0) {
      return;
    }
    
    currentStepIndex--;
    const previousStep = navigationSteps[currentStepIndex];
    setFloorImage(previousStep.floor);
    
    // Draw the route for this step
    setTimeout(() => {
      if (previousStep.route) {
        _currentPath = previousStep.route();
        drawPath(_currentPath);
      }
    }, 150);
    
    // Show step description
    if (previousStep.description) {
      console.log('Navigation Step:', previousStep.description);
    }
    
    updateNextStepButton();
  });

  function previewFloorForInputs() {
    const s = resolveByName(startInput?.value || '');
    const d = resolveByName(endInput?.value || '');
    if (s) { setFloorImage(s.floor); return; }
    if (d) { setFloorImage(d.floor); return; }
  }

  startInput?.addEventListener('input', previewFloorForInputs);
  endInput?.addEventListener('input', previewFloorForInputs);

  // Basic OCR using Tesseract.js CDN (loads only when needed)
  scanBtn?.addEventListener('click', async () => {
    try {
      if (!window.Tesseract) {
        await new Promise((resolve, reject) => {
          const s = document.createElement('script');
          s.src = 'https://unpkg.com/tesseract.js@5.0.3/dist/tesseract.min.js';
          s.onload = resolve; s.onerror = reject; document.body.appendChild(s);
        });
      }
      const dataUrl = await imageToDataURL(imgEl);
      const { data } = await window.Tesseract.recognize(dataUrl, 'eng', { logger: () => {} });
      if (ocrOut) ocrOut.value = (data && data.text) ? data.text.trim() : 'No text detected.';
    } catch (e) {
      if (ocrOut) ocrOut.value = 'OCR failed: ' + (e && e.message ? e.message : e);
    }
  });

  async function imageToDataURL(img) {
    return new Promise((resolve) => {
      const c = document.createElement('canvas');
      c.width = img.naturalWidth; c.height = img.naturalHeight;
      const ctx = c.getContext('2d');
      ctx.drawImage(img, 0, 0);
      resolve(c.toDataURL('image/png'));
    });
  }

  // boot
  setFloorImage(getActiveFloorKey());
  populateFromIndex();
}

