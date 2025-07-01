const teamListDiv = document.getElementById('team-list');
const addBulkBtn = document.getElementById('addBulkBtn');
const bulkInput = document.getElementById('bulkInput');
const clearBtn = document.getElementById('clearBtn');
const startRouletteBtn = document.getElementById('startRouletteBtn');
const winnerDiv = document.getElementById('winner');

/**
 * テキストボックスを追加
 */
const addTeamField = (value = '') => {
    const div = document.createElement('div');
    div.classList.add('flex', 'mb-2', 'gap-2');

    const input = document.createElement('input');
    input.type = "text";
    input.classList.add('flex-1', 'p-2', 'border', 'border-gray-300', 'rounded');
    input.placeholder = `チーム名（Enterで追加）`;
    input.value = value;

    // エンターで次追加
    input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter') {
            e.preventDefault();
            addTeamField();
        }
    });

    // 削除ボタン
    const deleteBtn = document.createElement('button');
    deleteBtn.textContent = '削除';
    deleteBtn.classList.add('bg-red-500', 'text-white', 'px-2', 'rounded', 'hover:bg-red-600');
    deleteBtn.onclick = () => div.remove();

    div.appendChild(input);
    div.appendChild(deleteBtn);
    teamListDiv.appendChild(div);

    input.focus();
};

/**
 * 初期表示に1つ追加
 */
window.addEventListener('DOMContentLoaded', () => {
    addTeamField();
});

/**
 * 一括追加ボタンのクリック処理
 */
addBulkBtn.addEventListener('click', () => {
    const names = bulkInput.value
        .split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');
    bulkInput.value = '';

    // 空欄を削除
    const inputs = teamListDiv.querySelectorAll('input');
    inputs.forEach(input => {
        if (input.value.trim() === '') {
            input.closest('div').remove();
        }
    });

    for (const name of names) {
        addTeamField(name);
    }
});

/**
 * 一括削除（クリア）
 */
clearBtn.addEventListener('click', () => {
    teamListDiv.innerHTML = '';
    $('#result').fadeOut(200, () => {
        $('#result').html('');
    });
    winnerDiv.innerHTML = '';
});

/**
 * ルーレット風 当選アニメーション
 */
startRouletteBtn.addEventListener('click', () => {
    const teamNames = [];
    const inputs = teamListDiv.querySelectorAll('input');

    inputs.forEach(input => {
        const name = input.value.trim();
        if (name) teamNames.push(name);
    });

    if (teamNames.length === 0) {
        winnerDiv.textContent = 'チームがありません';
        return;
    }

    let index = 0;
    let count = 0;
    const maxCount = 20 + Math.floor(Math.random() * 10); // 回転回数

    winnerDiv.classList.remove('text-4xl'); // リセット

    const interval = setInterval(() => {
        winnerDiv.textContent = teamNames[index];
        index = (index + 1) % teamNames.length;
        count++;

        if (count >= maxCount) {
            clearInterval(interval);
            const finalWinner = teamNames[(index - 1 + teamNames.length) % teamNames.length];
            winnerDiv.innerHTML = `<span class="text-4xl">🎉 ${finalWinner} 🎉</span>`;
        }
    }, 100);
});
