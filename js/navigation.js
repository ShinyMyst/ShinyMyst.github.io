// This function handles screen and question navigation.
function navigate(direction) {
    if (direction === 'next') {
        if (game.screenIndex === 0) {
            game.introMusic.pause();
            game.introMusic.currentTime = 0;

            game.titleScreen.classList.remove('active');
            game.gameScreen.classList.add('active');
            game.screenIndex = 1;
            game.questionIndex = 0;
            showQuestion();
        } else {
            game.questionIndex++;
            showQuestion();
        }
    } else {
        game.questionIndex--;
        if (game.questionIndex < 0) {
            game.musicToggleButton.textContent = 'Play Music';

            game.questionIndex = -1;
            game.gameScreen.classList.remove('active');
            game.titleScreen.classList.add('active');
            game.screenIndex = 0;
            game.nextButton.textContent = 'Start Game';
            return;
        }
        showQuestion();
    }

    if (game.questionIndex >= game.questions.length) {
        game.introMusic.pause();
        game.introMusic.currentTime = 0;

        game.gameScreen.innerHTML = `<h1>Thanks for playing!</h1>`;
        game.nextButton.style.display = 'none';
        game.prevButton.style.display = 'none';
        return;
    }

    game.prevButton.style.display = (game.questionIndex <= 0 && game.screenIndex === 1) ? 'none' : 'block';
    game.nextButton.textContent = (game.screenIndex === 0) ? 'Start Game' : 'Next';
    game.nextButton.style.display = (game.questionIndex >= game.questions.length - 1 && game.screenIndex !== 0) ? 'none' : 'block';
}

// This function builds and displays the current question.
function showQuestion() {
    const q = game.questions[game.questionIndex];

    // Clear the game screen content
    game.gameScreen.innerHTML = '';

    const h1 = document.createElement('h1');
    h1.textContent = q.question;
    game.gameScreen.appendChild(h1);

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

    game.gameScreen.appendChild(container);
    game.gameScreen.appendChild(game.wrongXContainer);
    game.gameScreen.appendChild(game.wrongBtn);
    game.gameScreen.appendChild(game.nextButton);
    game.gameScreen.appendChild(game.prevButton);

    game.wrongXContainer.innerHTML = '';
    game.wrongCount = 0;
}

// This function creates a single answer box element.
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