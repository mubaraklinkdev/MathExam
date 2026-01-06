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

    const headerScore = document.getElementById('header-score');
    const submitBtn = form.querySelector('button[type="submit"]');

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
                <div class="solution-steps" id="steps_mult_${i}">
                    <strong>Solution:</strong> ${num1} × ${num2} = ${answer}
                </div>
            `;
            multiplicationContainer.appendChild(card);
        }

        // Generate 5 Division Questions
        for (let i = 0; i < 5; i++) {
            // Constraints:
            // Divisor < 26 (so max 25)
            // Dividend < 10000

            const divisor = getRandomInt(2, 25); 
            
            // Calculate max quotient to ensure dividend < 10000
            // Dividend = divisor * quotient + remainder
            // Max Dividend = 9999
            // Max Quotient approx = 9999 / divisor
            const maxQuotient = Math.floor(9900 / divisor); // Slight buffer
            const minQuotient = 10; // Ensure it's somewhat challenging

            const quotient = getRandomInt(minQuotient, maxQuotient); 
            const remainder = getRandomInt(0, divisor - 1); 

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
                <div class="solution-steps" id="steps_div_${i}">
                    <strong>Solution:</strong> ${dividend} ÷ ${divisor} = ${quotient} R ${remainder} <br>
                    <small>(Check: ${divisor} × ${quotient} + ${remainder} = ${dividend})</small>
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
                document.getElementById(`steps_${q.id}`).classList.add('visible');
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
                document.getElementById(`steps_${q.id}`).classList.add('visible');
            }
        });

        // Disable submit button
        submitBtn.disabled = true;
        submitBtn.textContent = 'Exam Submitted';

        // Show header score
        headerScore.textContent = `Score: ${score}/${totalQuestions}`;
        headerScore.classList.remove('hidden');

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
        document.querySelectorAll('.solution-steps').forEach(s => s.classList.remove('visible'));
        document.querySelectorAll('.feedback-icon').forEach(i => i.textContent = '');

        // Reset button and header score
        submitBtn.disabled = false;
        submitBtn.textContent = 'Submit Answers';
        headerScore.classList.add('hidden');
        headerScore.textContent = '';

        generateQuestions();
    });

    closeModalBtn.addEventListener('click', closeResults);
    overlay.addEventListener('click', closeResults);

    // Initial Generation
    generateQuestions();
});
