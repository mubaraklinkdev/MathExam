document.addEventListener('DOMContentLoaded', () => {
    const multiplicationContainer = document.getElementById('multiplication-container');
    const divisionContainer = document.getElementById('division-container');
    const form = document.getElementById('exam-form');
    const refreshBtn = document.getElementById('refresh-btn');
    const modal = document.getElementById('result-modal');
    const overlay = document.getElementById('overlay');
    const scoreDisplay = document.getElementById('score-display');
    const feedbackMessage = document.getElementById('feedback-message');
    const closeModalBtn = document.getElementById('close-modal');

    let questions = {
        multiplication: [],
        division: []
    };

    function getRandomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    function generateQuestions() {
        questions.multiplication = [];
        questions.division = [];
        multiplicationContainer.innerHTML = '';
        divisionContainer.innerHTML = '';

        // Generate 5 Multiplication Questions
        for (let i = 0; i < 5; i++) {
            // Example: 345 * 50 (3 digit * 2 digit)
            const num1 = getRandomInt(100, 999);
            const num2 = getRandomInt(10, 99);
            const answer = num1 * num2;

            questions.multiplication.push({ num1, num2, answer, id: `mult_${i}` });

            const card = document.createElement('div');
            card.className = 'question-card';
            card.innerHTML = `
                <div class="question-text">${num1} × ${num2} = </div>
                <div class="input-group">
                    <input type="number" id="mult_${i}" required placeholder="?">
                    <span class="feedback-icon" id="icon_mult_${i}"></span>
                </div>
            `;
            multiplicationContainer.appendChild(card);
        }

        // Generate 5 Division Questions
        for (let i = 0; i < 5; i++) {
            // Example: 2345 / 61 (4 digit / 2 digit)
            // Constraint: Remainder max 10

            const divisor = getRandomInt(20, 99); // 2 digit divisor
            const quotient = getRandomInt(20, 150); // Result size
            const remainder = getRandomInt(0, 10); // Constraint: Remainder <= 10

            const dividend = (divisor * quotient) + remainder;

            questions.division.push({ dividend, divisor, quotient, remainder, id: `div_${i}` });

            const card = document.createElement('div');
            card.className = 'question-card';
            card.innerHTML = `
                <div class="question-text">${dividend} ÷ ${divisor} = </div>
                <div class="division-inputs">
                    <div class="input-group">
                        <label>Q:</label>
                        <input type="number" id="div_q_${i}" required placeholder="Quotient">
                    </div>
                    <div class="input-group">
                        <label>R:</label>
                        <input type="number" id="div_r_${i}" required placeholder="Rem" value="0">
                    </div>
                    <span class="feedback-icon" id="icon_div_${i}"></span>
                </div>
            `;
            divisionContainer.appendChild(card);
        }
    }

    function checkAnswers(e) {
        e.preventDefault();
        let score = 0;
        let totalQuestions = 10;

        // Check Multiplication
        questions.multiplication.forEach(q => {
            const input = document.getElementById(q.id);
            const userVal = parseInt(input.value);
            const card = input.closest('.question-card');
            const icon = document.getElementById(`icon_${q.id}`);

            if (userVal === q.answer) {
                score++;
                card.classList.add('correct');
                card.classList.remove('incorrect');
                icon.textContent = '✅';
            } else {
                card.classList.add('incorrect');
                card.classList.remove('correct');
                icon.textContent = '❌';
                // Optional: Show correct answer? Maybe not for an exam, but helpful for review.
                // Let's keep it simple for now.
            }
        });

        // Check Division
        questions.division.forEach(q => {
            const inputQ = document.getElementById(`div_q_${q.id.split('_')[1]}`);
            const inputR = document.getElementById(`div_r_${q.id.split('_')[1]}`);
            const userQ = parseInt(inputQ.value);
            const userR = parseInt(inputR.value);
            const card = inputQ.closest('.question-card');
            const icon = document.getElementById(`icon_${q.id}`);

            if (userQ === q.quotient && userR === q.remainder) {
                score++;
                card.classList.add('correct');
                card.classList.remove('incorrect');
                icon.textContent = '✅';
            } else {
                card.classList.add('incorrect');
                card.classList.remove('correct');
                icon.textContent = '❌';
            }
        });

        showResults(score, totalQuestions);
    }

    function showResults(score, total) {
        scoreDisplay.textContent = `${score}/${total}`;

        if (score === total) {
            feedbackMessage.textContent = "Perfect Score! You're a Math Master! 🌟";
        } else if (score >= total * 0.8) {
            feedbackMessage.textContent = "Great job! Keep it up! 🎉";
        } else if (score >= total * 0.5) {
            feedbackMessage.textContent = "Good effort! Practice makes perfect. 💪";
        } else {
            feedbackMessage.textContent = "Don't give up! Try again. 📚";
        }

        modal.classList.remove('hidden');
        overlay.classList.remove('hidden');
    }

    function closeResults() {
        modal.classList.add('hidden');
        overlay.classList.add('hidden');
    }

    // Event Listeners
    form.addEventListener('submit', checkAnswers);

    refreshBtn.addEventListener('click', () => {
        form.reset();
        // Remove feedback styles
        document.querySelectorAll('.question-card').forEach(c => {
            c.classList.remove('correct', 'incorrect');
        });
        document.querySelectorAll('.feedback-icon').forEach(i => i.textContent = '');
        generateQuestions();
    });

    closeModalBtn.addEventListener('click', closeResults);
    overlay.addEventListener('click', closeResults);

    // Initial Generation
    generateQuestions();
});
