const shuffleButton = document.getElementById('shuffleBtn');
const teamListDiv = document.getElementById('team-list');
const addBulkBtn = document.getElementById('addBulkBtn');
const bulkInput = document.getElementById('bulkInput');
const clearBtn = document.getElementById('clearBtn');
const resultDiv = document.getElementById('result');
const rouletteDiv = document.getElementById('roulette');
const rouletteRing = document.getElementById('rouletteRing');
const rouletteName = document.getElementById('rouletteName');
const rouletteRound = document.getElementById('rouletteRound');
const messageDiv = document.getElementById('message');

let isDrawing = false;

const wait = (ms) => new Promise(resolve => setTimeout(resolve, ms));

const escapeHtml = (value) => {
    const div = document.createElement('div');
    div.textContent = value;
    return div.innerHTML;
};

const updateShuffleButton = () => {
    const hasTeam = [...teamListDiv.querySelectorAll('input')]
        .some(input => input.value.trim() !== '');
    shuffleButton.disabled = !hasTeam || isDrawing;
};

const addTeamField = (value = '') => {
    const div = document.createElement('div');
    div.classList.add('flex', 'gap-2');

    const input = document.createElement('input');
    input.type = 'text';
    input.classList.add(
        'min-w-0',
        'flex-1',
        'rounded-md',
        'border',
        'border-slate-300',
        'px-3',
        'py-2',
        'outline-none',
        'transition',
        'focus:border-blue-500',
        'focus:ring-4',
        'focus:ring-blue-100'
    );
    input.placeholder = 'チーム名（Enterで追加）';
    input.value = value;

    input.addEventListener('input', updateShuffleButton);
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTeamField();
        }
    });

    const deleteBtn = document.createElement('button');
    deleteBtn.type = 'button';
    deleteBtn.textContent = '削除';
    deleteBtn.classList.add(
        'shrink-0',
        'rounded-md',
        'border',
        'border-red-200',
        'bg-red-50',
        'px-3',
        'py-2',
        'font-semibold',
        'text-red-700',
        'transition',
        'hover:bg-red-100'
    );
    deleteBtn.onclick = () => {
        div.remove();
        updateShuffleButton();
    };

    div.appendChild(input);
    div.appendChild(deleteBtn);
    teamListDiv.appendChild(div);

    updateShuffleButton();
    input.focus();
};

const getTeamNames = () => [...teamListDiv.querySelectorAll('input')]
    .map(input => input.value.trim())
    .filter(Boolean);

const shuffleArray = (items) => {
    const shuffled = [...items];
    for (let i = shuffled.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
};

const renderResult = (names, currentName = '') => {
    const html = `
        <ol class="space-y-2">
            ${names.map((name, index) => `
                <li class="flex items-center gap-3 rounded-md border border-slate-200 bg-white px-3 py-3 shadow-sm">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-600 text-sm font-bold text-white">${index + 1}</span>
                    <span class="min-w-0 flex-1 break-words text-lg font-semibold text-slate-900">${escapeHtml(name)}</span>
                </li>
            `).join('')}
            ${currentName ? `
                <li class="flex items-center gap-3 rounded-md border border-blue-200 bg-blue-50 px-3 py-3">
                    <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-blue-100 text-sm font-bold text-blue-700">?</span>
                    <span class="min-w-0 flex-1 break-words text-lg font-bold text-blue-700">${escapeHtml(currentName)}</span>
                </li>
            ` : ''}
        </ol>
    `;
    resultDiv.innerHTML = html;
};

const spinRoulette = async (candidates, rank) => {
    const duration = 1200 + rank * 180;
    const start = Date.now();
    let index = Math.floor(Math.random() * candidates.length);

    rouletteRound.textContent = `${rank}番目を抽選しています`;
    rouletteName.textContent = candidates[index];

    return new Promise(resolve => {
        const timer = setInterval(() => {
            index = (index + 1 + Math.floor(Math.random() * candidates.length)) % candidates.length;
            rouletteName.textContent = candidates[index];
            rouletteName.classList.toggle('is-spinning');

            if (Date.now() - start >= duration) {
                clearInterval(timer);
                const selectedIndex = Math.floor(Math.random() * candidates.length);
                rouletteName.textContent = candidates[selectedIndex];
                rouletteName.classList.remove('is-spinning');
                resolve(selectedIndex);
            }
        }, 80);
    });
};

const shuffleTeams = async () => {
    if (isDrawing) return;

    const teamNames = getTeamNames();
    if (teamNames.length === 0) {
        messageDiv.textContent = 'チーム名を入力してください。';
        return;
    }

    isDrawing = true;
    messageDiv.textContent = '';
    updateShuffleButton();

    const remaining = shuffleArray(teamNames);
    const ordered = [];

    resultDiv.innerHTML = '';
    rouletteDiv.classList.remove('hidden');
    rouletteRing.classList.add('is-active');

    while (remaining.length > 0) {
        const rank = ordered.length + 1;
        const selectedIndex = await spinRoulette(remaining, rank);
        const [selectedName] = remaining.splice(selectedIndex, 1);

        rouletteName.textContent = selectedName;
        rouletteRound.textContent = `${rank}番目に決定`;
        ordered.push(selectedName);
        renderResult(ordered);
        await wait(450);
    }

    rouletteRound.textContent = '抽選完了';
    await wait(500);

    rouletteRing.classList.remove('is-active');
    rouletteDiv.classList.add('hidden');

    isDrawing = false;
    updateShuffleButton();
};

window.addEventListener('DOMContentLoaded', () => {
    addTeamField();
});

addBulkBtn.addEventListener('click', () => {
    const names = bulkInput.value
        .split('\n')
        .map(name => name.trim())
        .filter(Boolean);

    bulkInput.value = '';

    teamListDiv.querySelectorAll('input').forEach(input => {
        if (input.value.trim() === '') {
            input.closest('div').remove();
        }
    });

    names.forEach(addTeamField);
    updateShuffleButton();
});

shuffleButton.addEventListener('click', shuffleTeams);

clearBtn.addEventListener('click', () => {
    if (isDrawing) return;

    teamListDiv.innerHTML = '';
    resultDiv.innerHTML = '<div class="flex h-60 items-center justify-center text-sm font-medium text-slate-400">未抽選</div>';
    rouletteDiv.classList.add('hidden');
    rouletteRing.classList.remove('is-active');
    messageDiv.textContent = '';
    updateShuffleButton();
});
