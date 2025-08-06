const questions = gameQuestions;
const titleScreen = document.getElementById('title-screen');
const gameScreen = document.getElementById('game-screen');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');

let screenIndex = 0;
let questionIndex = -1;

// Define audio elements
const introMusic = document.getElementById('intro-music');
const correctSound = new Audio('correct.mp3');
const wrongSound = new Audio('wrong.mp3');

// Get static button elements and wrong container
const musicToggleButton = document.getElementById('music-toggle-btn');
const wrongBtn = document.getElementById('wrong-btn');
const wrongXContainer = document.getElementById('wrong-x-container');

let wrongCount = 0;

// Start music on first user interaction with the button
musicToggleButton.addEventListener('click', () => {
    if (introMusic.paused) {
        introMusic.play();
        musicToggleButton.textContent = 'Stop Music';
    } else {
        introMusic.pause();
        musicToggleButton.textContent = 'Play Music';
    }
});

// Initialize navigation
nextButton.addEventListener('click', () => navigate('next'));
prevButton.addEventListener('click', () => navigate('prev'));
wrongBtn.addEventListener('click', triggerWrong);

function navigate(direction) {
  if (direction === 'next') {
    if (screenIndex === 0) {
      // Start the game
      introMusic.pause();
      introMusic.currentTime = 0;

      titleScreen.classList.remove('active');
      gameScreen.classList.add('active');
      screenIndex = 1;
      questionIndex = 0;
      showQuestion(questionIndex);
    } else {
      // Go to next question
      questionIndex++;
      showQuestion(questionIndex);
    }
  } else {
    // Go to previous question
    questionIndex--;
    if (questionIndex < 0) {
      // Return to title screen
      musicToggleButton.textContent = 'Play Music';

      questionIndex = -1;
      gameScreen.classList.remove('active');
      titleScreen.classList.add('active');
      screenIndex = 0;
      nextButton.textContent = 'Start Game';
      return;
    }
    showQuestion(questionIndex);
  }

  // Handle end of game
  if (questionIndex >= questions.length) {
    introMusic.pause();
    introMusic.currentTime = 0;

    gameScreen.innerHTML = `<h1>Thanks for playing!</h1>`;
    nextButton.style.display = 'none';
    prevButton.style.display = 'none';
    return;
  }

  // Update button visibility
  prevButton.style.display = (questionIndex <= 0 && screenIndex === 1) ? 'none' : 'block';
  nextButton.textContent = (screenIndex === 0) ? 'Start Game' : 'Next';
  nextButton.style.display = (questionIndex >= questions.length - 1 && screenIndex !== 0) ? 'none' : 'block';
}

function showQuestion(idx) {
  const q = questions[idx];

  // Clear the game screen content
  gameScreen.innerHTML = '';

  const h1 = document.createElement('h1');
  h1.textContent = q.question;
  gameScreen.appendChild(h1);

  const container = document.createElement('div');
  container.classList.add('answers-container');

  if (q.answers.length <= 4) {
    container.classList.add('one-col');
    q.answers.forEach((ans, i) => createAnswerBox(container, ans, i));
  } else {
    container.classList.add('two-col');
    const rowCount = Math.ceil(q.answers.length / 2);
    container.style.display = 'grid';
    container.style.gridTemplateColumns = '1fr 1fr';
    container.style.gridAutoRows = 'minmax(120px, auto)';
    container.style.gap = '20px';
    container.style.maxWidth = '740px';
    container.style.margin = '0 auto';

    for (let row = 0; row < rowCount; row++) {
      const firstColIndex = row;
      const secondColIndex = row + rowCount;
      if (firstColIndex < q.answers.length) {
        createAnswerBox(container, q.answers[firstColIndex], firstColIndex);
      }
      if (secondColIndex < q.answers.length) {
        createAnswerBox(container, q.answers[secondColIndex], secondColIndex);
      }
    }
  }

  gameScreen.appendChild(container);

  // Append the static buttons after the content
  gameScreen.appendChild(wrongXContainer);
  gameScreen.appendChild(wrongBtn);
  gameScreen.appendChild(nextButton);
  gameScreen.appendChild(prevButton);

  // Reset wrongs on each question
  wrongXContainer.innerHTML = '';
  wrongCount = 0;
}

function createAnswerBox(container, ans, index) {
  const box = document.createElement('div');
  box.className = 'answer-box';
  box.onclick = () => reveal(box);

  const numberCircle = document.createElement('div');
  numberCircle.className = 'number-circle';
  numberCircle.textContent = (index + 1);

  const textDiv = document.createElement('div');
  textDiv.className = 'answer-text';
  textDiv.textContent = ans.text;

  const pointsDiv = document.createElement('div');
  pointsDiv.className = 'points-box';
  pointsDiv.textContent = ans.points;

  box.appendChild(numberCircle);
  box.appendChild(textDiv);
  box.appendChild(pointsDiv);
  container.appendChild(box);
}

function reveal(el) {
  el.classList.add('revealed');
  correctSound.currentTime = 0;
  correctSound.play();
}

function triggerWrong() {
  if (wrongCount >= 3) return;

  wrongCount++;
  wrongSound.currentTime = 0;
  wrongSound.play();

  // Clear any existing Xs so only the current count of Xs shows
  wrongXContainer.innerHTML = '';

  // Add 'wrongCount' number of X images
  for (let i = 0; i < wrongCount; i++) {
    const img = document.createElement('img');
    img.src = 'wrong.webp';
    img.className = 'wrong-x';
    img.style.opacity = 0;
    wrongXContainer.appendChild(img);

    requestAnimationFrame(() => {
      img.style.opacity = 1;
    });
  }

  // After sound ends + 0.5s, fade out all Xs and then remove
  const timeout = wrongSound.duration * 1000 + 250;
  setTimeout(() => {
    const imgs = wrongXContainer.querySelectorAll('img');
    imgs.forEach(img => {
      img.style.opacity = 0;
    });

    setTimeout(() => {
      wrongXContainer.innerHTML = '';
    }, 300); // match CSS transition
  }, timeout);
}