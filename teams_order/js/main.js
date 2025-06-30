const generateFieldsButton = document.getElementById('generateFields');
const shuffleButton = document.getElementById('shuffleBtn');
const teamListDiv = document.getElementById('team-list');
const resultDiv = document.getElementById('result');

/**
 * フィールドを生成する
 */
const createFields = () => {
    const countField = document.getElementById('teamCount');
    const bulkInput = document.getElementById('bulkInput');
    const teamList = teamListDiv;
    const result = resultDiv;

    const teamCount = Number(countField.value);
    const bulkNames = bulkInput.value
        .split('\n')
        .map(name => name.trim())
        .filter(name => name !== '');

    teamList.innerHTML = '';
    result.innerHTML = '';

    const actualCount = teamCount > 0 ? teamCount : bulkNames.length;

    if (actualCount > 0) {
        for (let i = 1; i <= actualCount; i++) {
            const div = document.createElement('div');
            div.classList.add('flex', 'mb-2');

            const input = document.createElement('input');
            input.type = "text";
            input.id = `teamName${i}`;
            input.classList.add('flex-1', 'p-2', 'border', 'border-gray-300', 'rounded');
            input.placeholder = `チーム名${i}`;
            if (bulkNames[i - 1]) input.value = bulkNames[i - 1]; // 自動入力

            div.appendChild(input);
            teamList.appendChild(div);
        }
        shuffleButton.disabled = false;
    } else {
        alert('チーム数かチーム名を入力してください');
        shuffleButton.disabled = true;
    }
}

/**
 * チームをシャッフルする
 */
const shuffleTeams = () => {
    const teamNames = [];
    const inputs = document.querySelectorAll('[id^="teamName"]');

    inputs.forEach(input => {
        const name = input.value.trim();
        if (name) teamNames.push(name);
    });

    if (teamNames.length === 0) {
        alert('少なくとも1つのチーム名を入力してください');
        return;
    }

    // シャッフル
    const shuffledTeams = teamNames.sort(() => Math.random() - 0.5);

    resultDiv.innerHTML = `
        <p class="mb-2">発表順:</p>
        <ol class="list-decimal list-inside">
            ${shuffledTeams.map(team => `<li>${team}</li>`).join('')}
        </ol>
    `;
}

document.getElementById('bulkInput').addEventListener('input', () => {
    // ペースト後に自動生成
    createFields();
});