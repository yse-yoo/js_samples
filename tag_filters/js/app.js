const selectedTags = new Set();

let currentIndex = -1;
let currentSuggestions = [];

const input = document.getElementById('tagInput');
const searchBtn = document.getElementById('searchBtn');
const clearBtn = document.getElementById('clearBtn');

const searchArea = document.getElementById('searchArea');
const suggestionList = document.getElementById('suggestionList');
const selectedTagsContainer = document.getElementById('selectedTags');

const itemList = document.getElementById('itemList');
const itemCards = document.querySelectorAll('.item-card');
const itemTagButtons = document.querySelectorAll('.item-tag');

const resultCount = document.getElementById('resultCount');
const emptyMessage = document.getElementById('emptyMessage');

/**
 * 入力文字に一致するタグを取得する
 */
const getMatchedTags = (query) => {
    const normalizedQuery = query.trim().toLowerCase();

    if (normalizedQuery === '') {
        return allTags.filter((tag) => {
            return !selectedTags.has(tag);
        });
    }

    return allTags.filter((tag) => {
        const normalizedTag = tag.toLowerCase();

        return (
            normalizedTag.includes(normalizedQuery) &&
            !selectedTags.has(tag)
        );
    });
};

/**
 * タグ候補を表示する
 */
const renderSuggestions = () => {
    currentSuggestions = getMatchedTags(input.value);
    currentIndex = -1;

    suggestionList.innerHTML = '';

    currentSuggestions.forEach((tag, index) => {
        const listItem = document.createElement('li');

        listItem.textContent = tag;
        listItem.dataset.index = String(index);

        listItem.className = [
            'suggestion-item',
            'px-4',
            'py-2',
            'cursor-pointer',
            'hover:bg-blue-100',
        ].join(' ');

        listItem.addEventListener('mousedown', (event) => {
            event.preventDefault();
            addTag(tag);
        });

        suggestionList.appendChild(listItem);
    });

    suggestionList.classList.toggle(
        'hidden',
        currentSuggestions.length === 0
    );
};

/**
 * キーボードで選択中の候補を強調する
 */
const updateHighlight = () => {
    const suggestionItems = suggestionList.querySelectorAll(
        '.suggestion-item'
    );

    suggestionItems.forEach((item, index) => {
        item.classList.toggle(
            'bg-blue-200',
            index === currentIndex
        );
    });

    if (
        currentIndex >= 0 &&
        suggestionItems[currentIndex]
    ) {
        suggestionItems[currentIndex].scrollIntoView({
            block: 'nearest',
        });
    }
};

/**
 * 選択タグを追加する
 */
const addTag = (tag) => {
    if (!tag || selectedTags.has(tag)) {
        return;
    }

    selectedTags.add(tag);

    input.value = '';
    currentIndex = -1;
    currentSuggestions = [];

    suggestionList.innerHTML = '';
    suggestionList.classList.add('hidden');

    renderSelectedTags();
    filterItems();

    input.focus();
};

/**
 * 選択タグを削除する
 */
const removeTag = (tag) => {
    selectedTags.delete(tag);

    renderSelectedTags();
    filterItems();
};

/**
 * 選択済みタグを表示する
 */
const renderSelectedTags = () => {
    selectedTagsContainer.innerHTML = '';

    selectedTags.forEach((tag) => {
        const tagElement = document.createElement('span');

        tagElement.className = [
            'inline-flex',
            'items-center',
            'px-3',
            'py-1',
            'bg-blue-600',
            'text-white',
            'rounded-full',
            'text-sm',
        ].join(' ');

        const tagText = document.createElement('span');
        tagText.textContent = tag;

        const removeButton = document.createElement('button');

        removeButton.type = 'button';
        removeButton.textContent = '×';
        removeButton.className = [
            'ml-2',
            'font-bold',
            'hover:text-gray-200',
        ].join(' ');

        removeButton.setAttribute(
            'aria-label',
            `${tag}を削除`
        );

        removeButton.addEventListener('click', () => {
            removeTag(tag);
        });

        tagElement.appendChild(tagText);
        tagElement.appendChild(removeButton);

        selectedTagsContainer.appendChild(tagElement);
    });
};

/**
 * 選択されたタグを使って一覧を絞り込む
 *
 * 現在はAND検索
 * 選択したタグをすべて含む項目だけを表示する
 */
const filterItems = () => {
    const selectedTagArray = Array.from(selectedTags);

    let visibleCount = 0;

    itemCards.forEach((card) => {
        const itemTags = JSON.parse(card.dataset.tags);

        const isMatched = selectedTagArray.every((selectedTag) => {
            return itemTags.includes(selectedTag);
        });

        card.classList.toggle('hidden', !isMatched);

        if (isMatched) {
            visibleCount += 1;
        }
    });

    resultCount.textContent = `${visibleCount}件表示中`;

    emptyMessage.classList.toggle(
        'hidden',
        visibleCount !== 0
    );

    itemList.classList.toggle(
        'hidden',
        visibleCount === 0
    );
};

/**
 * タグ選択をすべて解除する
 */
const clearTags = () => {
    selectedTags.clear();

    input.value = '';
    currentIndex = -1;
    currentSuggestions = [];

    suggestionList.innerHTML = '';
    suggestionList.classList.add('hidden');

    renderSelectedTags();
    filterItems();

    input.focus();
};

/**
 * 入力内容が変わったときに候補を表示する
 */
input.addEventListener('input', () => {
    renderSuggestions();
});

/**
 * 入力欄を選択したときに全候補を表示する
 */
input.addEventListener('focus', () => {
    renderSuggestions();
});

/**
 * キーボード操作
 */
input.addEventListener('keydown', (event) => {
    const suggestionItems = suggestionList.querySelectorAll(
        '.suggestion-item'
    );

    if (event.key === 'ArrowDown') {
        event.preventDefault();

        if (suggestionItems.length === 0) {
            return;
        }

        currentIndex =
            (currentIndex + 1) %
            suggestionItems.length;

        updateHighlight();
        return;
    }

    if (event.key === 'ArrowUp') {
        event.preventDefault();

        if (suggestionItems.length === 0) {
            return;
        }

        currentIndex =
            (
                currentIndex -
                1 +
                suggestionItems.length
            ) %
            suggestionItems.length;

        updateHighlight();
        return;
    }

    if (event.key === 'Enter') {
        event.preventDefault();

        if (
            currentIndex >= 0 &&
            currentSuggestions[currentIndex]
        ) {
            addTag(currentSuggestions[currentIndex]);
            return;
        }

        const exactTag = allTags.find((tag) => {
            return (
                tag.toLowerCase() ===
                input.value.trim().toLowerCase()
            );
        });

        if (exactTag) {
            addTag(exactTag);
            return;
        }

        renderSuggestions();
        return;
    }

    if (event.key === 'Escape') {
        currentIndex = -1;
        suggestionList.classList.add('hidden');
    }
});

/**
 * 検索ボタン
 */
searchBtn.addEventListener('click', () => {
    const query = input.value.trim();

    if (query === '') {
        renderSuggestions();
        input.focus();
        return;
    }

    const exactTag = allTags.find((tag) => {
        return tag.toLowerCase() === query.toLowerCase();
    });

    if (exactTag) {
        addTag(exactTag);
        return;
    }

    renderSuggestions();
    input.focus();
});

/**
 * クリアボタン
 */
clearBtn.addEventListener('click', clearTags);

/**
 * 一覧内のタグをクリックして検索条件に追加する
 */
itemTagButtons.forEach((button) => {
    button.addEventListener('click', () => {
        addTag(button.dataset.tag);
    });
});

/**
 * 検索欄以外をクリックしたら候補を閉じる
 */
document.addEventListener('click', (event) => {
    if (!searchArea.contains(event.target)) {
        suggestionList.classList.add('hidden');
    }
});