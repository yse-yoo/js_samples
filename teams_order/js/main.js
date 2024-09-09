const generateFieldsButton = document.getElementById('generateFields');
const shuffleButton = document.getElementById('shuffleBtn');
const teamListDiv = document.getElementById('team-list');
const resultDiv = document.getElementById('result');

// フィールドを生成する
generateFieldsButton.addEventListener('click', function () {
    const teamCount = parseInt(document.getElementById('teamCount').value);
    teamListDiv.innerHTML = ''; // 前回のフィールドをクリア
    resultDiv.innerHTML = ''; // 前回の結果をクリア

    if (teamCount && teamCount > 0) {
        // チーム名入力フィールドを生成
        for (let i = 1; i <= teamCount; i++) {
            const inputField = document.createElement('div');
            inputField.classList.add('flex', 'mb-4');
            inputField.innerHTML = `<input type="text" id="teamName${i}" class="flex-1 p-2 border border-gray-300 rounded" placeholder="チーム名${i}">`;
            teamListDiv.appendChild(inputField);
        }

        // シャッフルボタンを有効化
        shuffleButton.disabled = false;
    } else {
        alert('チーム数を正しく入力してください');
        shuffleButton.disabled = true;
    }
});

// チーム名をシャッフルする
shuffleButton.addEventListener('click', function () {
    const teamNames = [];
    const teamCount = parseInt(document.getElementById('teamCount').value);

    // チーム名を配列に格納
    for (let i = 1; i <= teamCount; i++) {
        const teamName = document.getElementById(`teamName${i}`).value;
        if (teamName) {
            teamNames.push(teamName);
        }
    }

    // チーム名が入力されていない場合は警告
    if (teamNames.length === 0) {
        alert('少なくとも1つのチーム名を入力してください');
        return;
    }

    // チーム名をシャッフル
    const shuffledTeams = teamNames.sort(() => Math.random() - 0.5);

    // 結果を表示
    resultDiv.innerHTML = `<p>発表順:</p><ol class="list-decimal list-inside">${shuffledTeams.map(team => `<li>${team}</li>`).join('')}</ol>`;
});