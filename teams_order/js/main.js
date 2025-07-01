const shuffleButton = document.getElementById('shuffleBtn');
const teamListDiv = document.getElementById('team-list');
const addBulkBtn = document.getElementById('addBulkBtn');
const bulkInput = document.getElementById('bulkInput');

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

    shuffleButton.disabled = false;
    input.focus();
};

/**
 * 初期表示に1つ追加
 */
window.addEventListener('DOMContentLoaded', () => {
    addTeamField();
});

/**
 * 「一括追加」ボタンのクリック処理
 */
addBulkBtn.addEventListener('click', () => {
    const names = bulkInput.value
        .split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');
    bulkInput.value = '';

    // ✅ 既存の空欄だけのinputを削除（または全部クリアでもOK）
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
 * チームをシャッフル
 */
const shuffleTeams = () => {
    const teamNames = [];
    const inputs = teamListDiv.querySelectorAll('input');

    inputs.forEach(input => {
        const name = input.value.trim();
        if (name) teamNames.push(name);
    });

    if (teamNames.length === 0) {
        return;
    }

    const shuffled = teamNames.sort(() => Math.random() - 0.5);

    const html = `
        <ol class="list-decimal list-inside space-y-1 text-lg">
            ${shuffled.map(name => `<li>${name}</li>`).join('')}
        </ol>
    `;

    // jQueryでフェードアウト → 内容変更 → フェードイン
    $('#result').fadeOut(0, function () {
        $(this).html(html).fadeIn(1000);
    });
};

const clearBtn = document.getElementById('clearBtn');

clearBtn.addEventListener('click', () => {
    // チームリスト全削除
    teamListDiv.innerHTML = '';
    // シャッフルボタン無効化
    shuffleButton.disabled = true;
    // 結果を消す（任意）
    $('#result').fadeOut(200, () => {
        $('#result').html('');
    });
});
