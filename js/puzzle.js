const board = document.getElementById('game-board');
const statusEl = document.getElementById('status');

const EMOJIS = ['img/photo57.jpg', 'img/photo57.jpg', 'img/photo51.jpg', 'img/photo51.jpg', 'img/photo22.jpg', 'img/photo22.jpg', 'img/photo45.jpg', 'img/photo45.jpg', 'img/photo56.jpg', 'img/photo56.jpg', 'img/photo58.jpg', 'img/photo58.jpg'];
let first = null, lock = false, matched = 0;

function createCard(emoji) {
  const card = document.createElement('div');
  card.className = 'card';
  const front = document.createElement('div');
  front.className = 'front';
  front.textContent = '❔';
  const back = document.createElement('div');
  back.className = 'back';
  const imgEl = document.createElement('img');
  imgEl.src = emoji;
  imgEl.alt = 'memory image';
  back.appendChild(imgEl);
  
  card.appendChild(front); card.appendChild(back);
  card.addEventListener('click', () => flip(card, emoji));
  return card;
}

function setup() {
  const arr = [...EMOJIS].sort(() => Math.random() - 0.5);
  arr.forEach(e => board.appendChild(createCard(e)));
  statusEl.textContent = 'แตะการ์ดเพื่อจับคู่ให้ครบ ✨';
}
setup();

function flip(card, emoji) {
  if (lock || card.classList.contains('flipped')) return;
  card.classList.add('flipped');
  if (!first) { first = { card, emoji }; return; }
  lock = true;
  if (first.emoji === emoji) {
    matched += 2;
    setTimeout(() => {
      lock = false; first = null;
      if (matched === EMOJIS.length) {
        statusEl.textContent = 'เย้! จับคู่ครบแล้ว 💞';
      }
    }, 350);
  } else {
    setTimeout(() => {
      first.card.classList.remove('flipped');
      card.classList.remove('flipped');
      first = null; lock = false;
    }, 650);
  }
}
