const questions = gameQuestions;
const titleScreen = document.getElementById('title-screen');
const gameScreen = document.getElementById('game-screen');
const nextButton = document.getElementById('next-btn');
const prevButton = document.getElementById('prev-btn');

let screenIndex = 0;
let questionIndex = -1;

// Create the audio element once when the page loads
const clickSound = new Audio('correct.mp3');

// Initialize navigation
nextButton.addEventListener('click', () => navigate('next'));
prevButton.addEventListener('click', () => navigate('prev'));

function navigate(direction) {
  if (direction === 'next') {
    if (screenIndex === 0) {
      // Start the game
      titleScreen.classList.remove('active');
      gameScreen.classList.add('active');
      screenIndex = 1;
      questionIndex = 0;
      // After starting, show the first question
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
      questionIndex = -1;
      gameScreen.classList.remove('active');
      titleScreen.classList.add('active');
      screenIndex = 0;
      prevButton.style.display = 'none';
      nextButton.textContent = 'Start Game';
      return;
    }
    showQuestion(questionIndex);
  }

  // Handle end of game
  if (questionIndex >= questions.length) {
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
  gameScreen.innerHTML = '';

  const h1 = document.createElement('h1');
  h1.textContent = q.question;
  gameScreen.appendChild(h1);

  const container = document.createElement('div');
  container.classList.add('answers-container');

  if (q.answers.length <= 4) {
    container.classList.add('one-col');
    q.answers.forEach((ans, i) => {
      createAnswerBox(container, ans, i);
    });
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
      if (firstColIndex < q.answers.length) {
        createAnswerBox(container, q.answers[firstColIndex], firstColIndex);
      }

      const secondColIndex = row + rowCount;
      if (secondColIndex < q.answers.length) {
        createAnswerBox(container, q.answers[secondColIndex], secondColIndex);
      }
    }
  }

  gameScreen.appendChild(container);
  gameScreen.appendChild(nextButton);
  gameScreen.appendChild(prevButton);
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

  // Reset the audio to the start before playing
  clickSound.currentTime = 0;
  clickSound.play();
}