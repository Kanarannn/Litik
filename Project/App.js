/* ============================================================
   LITIK — app.js
   Pure frontend, no backend. Data stored in localStorage.
   Compatible with GitHub Pages (static hosting).
============================================================ */

// ── STATE ──────────────────────────────────────────────────
let currentUser = null;

// ── STORAGE HELPERS ────────────────────────────────────────
function getUsers() {
  return JSON.parse(localStorage.getItem('litik_users') || '[]');
}
function saveUsers(u) {
  localStorage.setItem('litik_users', JSON.stringify(u));
}
function getSession() {
  return JSON.parse(sessionStorage.getItem('litik_session') || 'null');
}
function saveSession(u) {
  sessionStorage.setItem('litik_session', JSON.stringify(u));
}
function getUserData(username) {
  const users = getUsers();
  return users.find(u => u.username === username) || null;
}
function updateUserData(username, patch) {
  const users = getUsers();
  const idx = users.findIndex(u => u.username === username);
  if (idx !== -1) {
    users[idx] = { ...users[idx], ...patch };
    saveUsers(users);
    if (currentUser && currentUser.username === username) {
      currentUser = users[idx];
      saveSession(currentUser);
    }
  }
}

// ── SEED DEMO USERS ────────────────────────────────────────
function seedDemoUsers() {
  if (getUsers().length === 0) {
    const demo = [
      { name: 'People',  username: 'people',  password: 'people123', bestScore: 1200, totalScore: 3000, quizzes: 4 },
      { name: 'Andi',    username: 'andi',    password: 'andi123',   bestScore: 1000, totalScore: 2500, quizzes: 3 },
      { name: 'Budi',    username: 'budi',    password: 'budi123',   bestScore: 950,  totalScore: 2000, quizzes: 2 },
      { name: 'Citra',   username: 'citra',   password: 'citra123',  bestScore: 900,  totalScore: 1800, quizzes: 2 },
      { name: 'Dewi',    username: 'dewi',    password: 'dewi123',   bestScore: 850,  totalScore: 1700, quizzes: 2 },
      { name: 'Eko',     username: 'eko',     password: 'eko123',    bestScore: 800,  totalScore: 1600, quizzes: 2 },
      { name: 'Fajar',   username: 'fajar',   password: 'fajar123',  bestScore: 750,  totalScore: 1500, quizzes: 2 },
    ];
    saveUsers(demo);
  }
}

// ── SCREEN MANAGER ─────────────────────────────────────────
function showScreen(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

function switchTab(tab) {
  const map = { home: 'screen-home', kuis: 'screen-kuis', skor: 'screen-skor', profil: 'screen-profil' };
  if (tab === 'skor') renderLeaderboard();
  if (tab === 'profil') renderProfil();
  if (tab === 'home') renderHome();
  showScreen(map[tab]);
  // update nav active state
  document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
  const btnIdx = { home: 0, kuis: 1, skor: 2, profil: 3 };
  const screen = document.getElementById(map[tab]);
  if (screen) {
    const btns = screen.querySelectorAll('.nav-btn');
    btns.forEach(b => b.classList.remove('active'));
    if (btns[btnIdx[tab]]) btns[btnIdx[tab]].classList.add('active');
  }
}

// ── AUTH ────────────────────────────────────────────────────
function doLogin() {
  const user = document.getElementById('login-user').value.trim();
  const pass = document.getElementById('login-pass').value;
  const err  = document.getElementById('login-error');
  err.textContent = '';
  if (!user || !pass) { err.textContent = 'Isi username dan password!'; return; }
  const found = getUserData(user);
  if (!found || found.password !== pass) {
    err.textContent = 'Username atau password salah.';
    return;
  }
  currentUser = found;
  saveSession(currentUser);
  renderHome();
  showScreen('screen-home');
}

function doRegister() {
  const name = document.getElementById('reg-name').value.trim();
  const user = document.getElementById('reg-user').value.trim();
  const pass = document.getElementById('reg-pass').value;
  const err  = document.getElementById('reg-error');
  err.textContent = '';
  if (!name || !user || !pass) { err.textContent = 'Semua field harus diisi!'; return; }
  if (pass.length < 6) { err.textContent = 'Password minimal 6 karakter.'; return; }
  const users = getUsers();
  if (users.find(u => u.username === user)) {
    err.textContent = 'Username sudah digunakan.';
    return;
  }
  const newUser = { name, username: user, password: pass, bestScore: 0, totalScore: 0, quizzes: 0 };
  users.push(newUser);
  saveUsers(users);
  currentUser = newUser;
  saveSession(currentUser);
  renderHome();
  showScreen('screen-home');
}

function doLogout() {
  currentUser = null;
  sessionStorage.removeItem('litik_session');
  showScreen('screen-splash');
}

// ── HOME ────────────────────────────────────────────────────
function renderHome() {
  if (!currentUser) return;
  const u = getUserData(currentUser.username) || currentUser;
  document.getElementById('display-name').textContent = u.name.split(' ')[0];
  document.getElementById('header-score').textContent = u.totalScore;
}

// ── MATERI ──────────────────────────────────────────────────
const MATERI = {
  'biner': {
    title: '🔢 Sistem Bilangan',
    content: `
      <div class="materi-section">
        <h3>📖 Pengertian</h3>
        <p>Sistem bilangan adalah cara merepresentasikan angka menggunakan simbol (digit). Ada 4 sistem yang umum digunakan dalam komputer:</p>
        <ul style="padding-left:16px;font-size:14px;line-height:2;color:var(--text)">
          <li><b>Desimal (basis 10)</b> — menggunakan digit 0–9</li>
          <li><b>Biner (basis 2)</b> — menggunakan digit 0 dan 1</li>
          <li><b>Oktal (basis 8)</b> — menggunakan digit 0–7</li>
          <li><b>Heksadesimal (basis 16)</b> — menggunakan 0–9 dan A–F</li>
        </ul>
      </div>
      <div class="materi-section">
        <h3>💡 Mengapa Biner?</h3>
        <p>Komputer bekerja dengan sinyal listrik: <b>ON (1)</b> dan <b>OFF (0)</b>. Karena itu semua data digital direpresentasikan dalam bilangan biner.</p>
        <p>Contoh penerapan: data di harddisk, instruksi processor, komunikasi jaringan — semuanya menggunakan biner!</p>
      </div>
      <div class="materi-section">
        <h3>📊 Tabel Perbandingan</h3>
        <table class="table-konversi">
          <tr><th>Desimal</th><th>Biner</th><th>Oktal</th><th>Heks</th></tr>
          <tr><td>0</td><td>0000</td><td>0</td><td>0</td></tr>
          <tr><td>1</td><td>0001</td><td>1</td><td>1</td></tr>
          <tr><td>2</td><td>0010</td><td>2</td><td>2</td></tr>
          <tr><td>5</td><td>0101</td><td>5</td><td>5</td></tr>
          <tr><td>8</td><td>1000</td><td>10</td><td>8</td></tr>
          <tr><td>10</td><td>1010</td><td>12</td><td>A</td></tr>
          <tr><td>15</td><td>1111</td><td>17</td><td>F</td></tr>
          <tr><td>16</td><td>10000</td><td>20</td><td>10</td></tr>
        </table>
      </div>
    `
  },
  'desimal-biner': {
    title: '🔄 Desimal → Biner',
    content: `
      <div class="materi-section">
        <h3>📖 Cara Konversi</h3>
        <p>Bagi bilangan desimal dengan 2 secara berulang, catat sisa baginya, lalu baca dari bawah ke atas.</p>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 13 → Biner</h3>
        <div class="code-block">
13 ÷ 2 = 6  <span class="highlight">sisa 1</span>
 6 ÷ 2 = 3  <span class="highlight">sisa 0</span>
 3 ÷ 2 = 1  <span class="highlight">sisa 1</span>
 1 ÷ 2 = 0  <span class="highlight">sisa 1</span>

Baca dari bawah → <span class="highlight-green">1101</span>
        </div>
        <p>Jadi, 13(desimal) = <b>1101</b>(biner)</p>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 10 → Biner</h3>
        <div class="code-block">
10 ÷ 2 = 5  <span class="highlight">sisa 0</span>
 5 ÷ 2 = 2  <span class="highlight">sisa 1</span>
 2 ÷ 2 = 1  <span class="highlight">sisa 0</span>
 1 ÷ 2 = 0  <span class="highlight">sisa 1</span>

Baca dari bawah → <span class="highlight-green">1010</span>
        </div>
        <p>Jadi, 10(desimal) = <b>1010</b>(biner)</p>
      </div>
      <div class="materi-section">
        <h3>📊 Tabel Referensi Cepat</h3>
        <table class="table-konversi">
          <tr><th>Desimal</th><th>Biner</th></tr>
          <tr><td>1</td><td>0001</td></tr>
          <tr><td>5</td><td>0101</td></tr>
          <tr><td>10</td><td>1010</td></tr>
          <tr><td>15</td><td>1111</td></tr>
          <tr><td>16</td><td>10000</td></tr>
          <tr><td>20</td><td>10100</td></tr>
        </table>
      </div>
    `
  },
  'biner-desimal': {
    title: '↩️ Biner → Desimal',
    content: `
      <div class="materi-section">
        <h3>📖 Cara Konversi</h3>
        <p>Kalikan setiap digit biner dengan pangkat 2 sesuai posisinya (dihitung dari kanan, mulai 0), lalu jumlahkan hasilnya.</p>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 1101 → Desimal</h3>
        <div class="code-block">
<span class="highlight">1</span>×2³ + <span class="highlight">1</span>×2² + <span class="highlight">0</span>×2¹ + <span class="highlight">1</span>×2⁰
=  8  +  4  +  0  +  1
= <span class="highlight-green">13</span>
        </div>
        <p>Jadi, 1101(biner) = <b>13</b>(desimal)</p>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 10001 → Desimal</h3>
        <div class="code-block">
<span class="highlight">1</span>×2⁴ + 0×2³ + 0×2² + 0×2¹ + <span class="highlight">1</span>×2⁰
=  16  +  0  +  0  +  0  +  1
= <span class="highlight-green">17</span>
        </div>
        <p>Jadi, 10001(biner) = <b>17</b>(desimal)</p>
      </div>
      <div class="materi-section">
        <h3>🔑 Nilai Pangkat 2</h3>
        <table class="table-konversi">
          <tr><th>Posisi</th><th>2ⁿ</th><th>Nilai</th></tr>
          <tr><td>0 (kanan)</td><td>2⁰</td><td>1</td></tr>
          <tr><td>1</td><td>2¹</td><td>2</td></tr>
          <tr><td>2</td><td>2²</td><td>4</td></tr>
          <tr><td>3</td><td>2³</td><td>8</td></tr>
          <tr><td>4</td><td>2⁴</td><td>16</td></tr>
          <tr><td>5</td><td>2⁵</td><td>32</td></tr>
        </table>
      </div>
    `
  },
  'desimal-oktal': {
    title: '8️⃣ Desimal → Oktal',
    content: `
      <div class="materi-section">
        <h3>📖 Cara Konversi</h3>
        <p>Bagi bilangan desimal dengan 8 secara berulang, catat sisa baginya, lalu baca dari bawah ke atas. Sama seperti biner, tetapi pembaginya 8.</p>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 100 → Oktal</h3>
        <div class="code-block">
100 ÷ 8 = 12  <span class="highlight">sisa 4</span>
 12 ÷ 8 =  1  <span class="highlight">sisa 4</span>
  1 ÷ 8 =  0  <span class="highlight">sisa 1</span>

Baca dari bawah → <span class="highlight-green">144</span>
        </div>
        <p>Jadi, 100(desimal) = <b>144</b>(oktal)</p>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 255 → Oktal</h3>
        <div class="code-block">
255 ÷ 8 = 31  <span class="highlight">sisa 7</span>
 31 ÷ 8 =  3  <span class="highlight">sisa 7</span>
  3 ÷ 8 =  0  <span class="highlight">sisa 3</span>

Baca dari bawah → <span class="highlight-green">377</span>
        </div>
        <p>Jadi, 255(desimal) = <b>377</b>(oktal)</p>
      </div>
      <div class="materi-section">
        <h3>📊 Tabel Referensi</h3>
        <table class="table-konversi">
          <tr><th>Desimal</th><th>Oktal</th></tr>
          <tr><td>8</td><td>10</td></tr>
          <tr><td>16</td><td>20</td></tr>
          <tr><td>64</td><td>100</td></tr>
          <tr><td>100</td><td>144</td></tr>
          <tr><td>255</td><td>377</td></tr>
        </table>
      </div>
    `
  },
  'desimal-hex': {
    title: '🔡 Desimal → Heksadesimal',
    content: `
      <div class="materi-section">
        <h3>📖 Cara Konversi</h3>
        <p>Bagi dengan 16 secara berulang. Sisa 10–15 direpresentasikan dengan huruf A–F.</p>
        <table class="table-konversi" style="margin-top:8px">
          <tr><th>Sisa</th><th>10</th><th>11</th><th>12</th><th>13</th><th>14</th><th>15</th></tr>
          <tr><td><b>Huruf</b></td><td>A</td><td>B</td><td>C</td><td>D</td><td>E</td><td>F</td></tr>
        </table>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 255 → Heks</h3>
        <div class="code-block">
255 ÷ 16 = 15  <span class="highlight">sisa 15 = F</span>
 15 ÷ 16 =  0  <span class="highlight">sisa 15 = F</span>

Baca dari bawah → <span class="highlight-green">FF</span>
        </div>
        <p>Jadi, 255(desimal) = <b>FF</b>(heks)</p>
      </div>
      <div class="materi-section">
        <h3>📝 Contoh: 200 → Heks</h3>
        <div class="code-block">
200 ÷ 16 = 12  <span class="highlight">sisa  8</span>
 12 ÷ 16 =  0  <span class="highlight">sisa 12 = C</span>

Baca dari bawah → <span class="highlight-green">C8</span>
        </div>
        <p>Jadi, 200(desimal) = <b>C8</b>(heks)</p>
      </div>
      <div class="materi-section">
        <h3>📊 Tabel Referensi</h3>
        <table class="table-konversi">
          <tr><th>Desimal</th><th>Heks</th></tr>
          <tr><td>10</td><td>A</td></tr>
          <tr><td>15</td><td>F</td></tr>
          <tr><td>16</td><td>10</td></tr>
          <tr><td>255</td><td>FF</td></tr>
          <tr><td>256</td><td>100</td></tr>
        </table>
      </div>
    `
  }
};

function showMateri(key) {
  const m = MATERI[key];
  if (!m) return;
  document.getElementById('materi-title').textContent = m.title;
  document.getElementById('materi-body').innerHTML = m.content;
  showScreen('screen-materi');
}

// ── KUIS ────────────────────────────────────────────────────
const QUESTIONS = [
  { q: 'Angka yang digunakan dalam sistem bilangan biner adalah ....', opts: ['0 dan 1', '0 sampai 7', '0 sampai 9', '0 sampai F'], ans: 0 },
  { q: 'Nilai tempat pada bilangan biner dihitung berdasarkan pangkat dari ....', opts: ['5', '8', '10', '2'], ans: 3 },
  { q: 'Hasil konversi bilangan biner 10001 ke desimal adalah ....', opts: ['15', '16', '17', '18'], ans: 2 },
  { q: 'Bilangan desimal 10 jika dikonversi ke biner menjadi ....', opts: ['1001', '1010', '1100', '1110'], ans: 1 },
  { q: 'Bilangan desimal 15 dalam bentuk biner adalah ....', opts: ['1110', '1111', '1011', '1101'], ans: 1 },
  { q: 'Bilangan Biner 1100 jika dikonversi ke desimal menjadi ....', opts: ['10', '11', '12', '13'], ans: 2 },
  { q: 'Bilangan Biner 1011 jika dikonversi ke desimal menjadi ....', opts: ['9', '10', '11', '12'], ans: 2 },
  { q: 'Contoh penerapan bilangan biner dalam kehidupan sehari-hari terdapat pada ....', opts: ['Komputer & Smartphone', 'Buku tulis', 'Penggaris', 'Pensil'], ans: 0 },
  { q: 'Bilangan desimal 13 dalam bentuk biner adalah ....', opts: ['1100', '1110', '1101', '1011'], ans: 2 },
  { q: 'Bilangan biner 1010 jika dikonversi ke desimal menjadi ....', opts: ['8', '9', '10', '11'], ans: 2 },
];

let kuisState = { idx: 0, score: 0, benar: 0, salah: 0, timer: null, timeLeft: 15 };
const LABELS = ['A', 'B', 'C', 'D'];
const PTS_PER_CORRECT = 100;

function startKuis() {
  kuisState = { idx: 0, score: 0, benar: 0, salah: 0, timer: null, timeLeft: 15 };
  showScreen('screen-kuis-active');
  renderQuestion();
}

function renderQuestion() {
  clearInterval(kuisState.timer);
  const q = QUESTIONS[kuisState.idx];
  document.getElementById('kuis-q-num').textContent = `${kuisState.idx + 1} / ${QUESTIONS.length}`;
  document.getElementById('kuis-question').textContent = q.q;
  const optsCont = document.getElementById('kuis-options');
  optsCont.innerHTML = '';
  q.opts.forEach((opt, i) => {
    const btn = document.createElement('button');
    btn.className = 'opt-btn';
    btn.innerHTML = `<span class="opt-label">${LABELS[i]}.</span> ${opt}`;
    btn.onclick = () => selectAnswer(i);
    optsCont.appendChild(btn);
  });
  startTimer();
}

function startTimer() {
  kuisState.timeLeft = 15;
  updateTimerUI(15);
  kuisState.timer = setInterval(() => {
    kuisState.timeLeft--;
    updateTimerUI(kuisState.timeLeft);
    if (kuisState.timeLeft <= 0) {
      clearInterval(kuisState.timer);
      highlightAnswer(-1); // time's up
      setTimeout(nextQuestion, 1200);
    }
  }, 1000);
}

function updateTimerUI(t) {
  document.getElementById('kuis-timer-text').textContent = t;
  const fill = document.getElementById('kuis-timer-fill');
  fill.style.width = `${(t / 15) * 100}%`;
  fill.style.background = t > 7 ? '#fbbf24' : t > 3 ? '#f97316' : '#ef4444';
}

function selectAnswer(idx) {
  clearInterval(kuisState.timer);
  highlightAnswer(idx);
  if (idx === QUESTIONS[kuisState.idx].ans) {
    kuisState.benar++;
    kuisState.score += PTS_PER_CORRECT;
  } else {
    kuisState.salah++;
  }
  setTimeout(nextQuestion, 1000);
}

function highlightAnswer(selected) {
  const btns = document.querySelectorAll('.opt-btn');
  const correct = QUESTIONS[kuisState.idx].ans;
  btns.forEach((btn, i) => {
    btn.disabled = true;
    if (i === correct) btn.classList.add('correct');
    else if (i === selected) btn.classList.add('wrong');
  });
}

function nextQuestion() {
  kuisState.idx++;
  if (kuisState.idx >= QUESTIONS.length) {
    finishKuis();
  } else {
    renderQuestion();
  }
}

function finishKuis() {
  document.getElementById('res-benar').textContent = kuisState.benar;
  document.getElementById('res-salah').textContent = kuisState.salah;
  document.getElementById('res-pts').textContent = kuisState.score;
  // Save score
  if (currentUser) {
    const u = getUserData(currentUser.username);
    const newBest = Math.max(u.bestScore || 0, kuisState.score);
    const newTotal = (u.totalScore || 0) + kuisState.score;
    const newQuizzes = (u.quizzes || 0) + 1;
    updateUserData(currentUser.username, { bestScore: newBest, totalScore: newTotal, quizzes: newQuizzes });
    document.getElementById('header-score').textContent = newTotal;
  }
  showScreen('screen-kuis-result');
}

// ── LEADERBOARD ─────────────────────────────────────────────
function renderLeaderboard() {
  const users = getUsers().sort((a, b) => (b.totalScore || 0) - (a.totalScore || 0));
  const cont = document.getElementById('leaderboard-list');
  const medals = ['🥇', '🥈', '🥉'];
  const cls = ['gold', 'silver', 'bronze'];
  cont.innerHTML = users.map((u, i) => {
    const isMe = currentUser && u.username === currentUser.username;
    const rankClass = cls[i] || '';
    const medal = medals[i] || `#${i + 1}`;
    return `
      <div class="lb-item ${rankClass} ${isMe ? 'me' : ''}">
        <div class="lb-rank">${medal}</div>
        <div class="lb-avatar">${u.name.charAt(0).toUpperCase()}</div>
        <div class="lb-info">
          <div class="lb-name">${u.name}${isMe ? ' <small style="color:var(--primary);font-size:10px">(Kamu)</small>' : ''}</div>
          <div class="lb-pts">${u.quizzes || 0} kuis selesai</div>
        </div>
        <div class="lb-score">${u.totalScore || 0} pts</div>
      </div>`;
  }).join('');
}

// ── PROFIL ──────────────────────────────────────────────────
function renderProfil() {
  if (!currentUser) return;
  const u = getUserData(currentUser.username) || currentUser;
  document.getElementById('profil-avatar').textContent = u.name.charAt(0).toUpperCase();
  document.getElementById('profil-name').textContent = u.name;
  document.getElementById('profil-username').textContent = '@' + u.username;
  document.getElementById('profil-best').textContent = u.bestScore || 0;
  document.getElementById('profil-total').textContent = u.totalScore || 0;
  document.getElementById('profil-quizzes').textContent = u.quizzes || 0;
}

// ── INIT ────────────────────────────────────────────────────
(function init() {
  seedDemoUsers();
  const session = getSession();
  if (session) {
    currentUser = session;
    renderHome();
    showScreen('screen-home');
  } else {
    showScreen('screen-splash');
  }
})();