const generateFieldsButton = document.getElementById('generateFields');
const shuffleButton = document.getElementById('shuffleBtn');
const teamListDiv = document.getElementById('team-list');
const resultDiv = document.getElementById('result');

/**
 * createFiels()
 * 
 * フィールドを生成する
 */ 
const createFields = () => {
    const countField = document.getElementById('teamCount');
    // 値を取得し、数値に変換
    const teamCount = Number(countField.value)
    console.log(teamCount);
    teamListDiv.innerHTML = ''; // 前回のフィールドをクリア
    resultDiv.innerHTML = ''; // 前回の結果をクリア

    if (teamCount && teamCount > 0) {
        // チーム名入力フィールドを生成
        for (var i = 1; i <= teamCount; i++) {
            const div = document.createElement('div');
            div.classList.add('flex', 'mb-4');
            const input = document.createElement('input');
            input.type = "text";
            input.id = `teamName${i}`;
            input.classList.add('flex-1', 'p-2', 'border', 'border-gray-300', 'rounded');
            input.placeholder = `チーム名${i}`;
            div.appendChild(input);
            teamListDiv.appendChild(div);
        }
        // シャッフルボタンを有効化
        shuffleButton.disabled = false;
    } else {
        alert('チーム数を正しく入力してください');
        shuffleButton.disabled = true;
    }
}

/**
 * createFiels()
 * 
 * チームをシャッフルする
 */ 
const shuffleTeams = () => {
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
}