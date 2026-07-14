<?php

$items = [
    [
        'id' => 1,
        'title' => 'Next.js 入門',
        'description' => 'Next.js App Routerを使ったWebアプリ開発の基礎',
        'tags' => ['JavaScript', 'TypeScript', 'React', 'Next.js'],
    ],
    [
        'id' => 2,
        'title' => 'TailwindCSS レイアウト',
        'description' => 'TailwindCSSを使ったレスポンシブデザイン',
        'tags' => ['HTML', 'CSS', 'TailwindCSS'],
    ],
    [
        'id' => 3,
        'title' => 'Node.js API開発',
        'description' => 'Node.jsとExpressを使ったREST APIの作成',
        'tags' => ['JavaScript', 'Node.js', 'Express', 'API'],
    ],
    [
        'id' => 4,
        'title' => 'Python FastAPI入門',
        'description' => 'FastAPIを使った高速なAPIサーバー開発',
        'tags' => ['Python', 'FastAPI', 'API'],
    ],
    [
        'id' => 5,
        'title' => 'Reactコンポーネント設計',
        'description' => '再利用しやすいReactコンポーネントの設計方法',
        'tags' => ['JavaScript', 'TypeScript', 'React'],
    ],
    [
        'id' => 6,
        'title' => 'PHPとMySQL',
        'description' => 'PHP PDOを使ったデータベース操作',
        'tags' => ['PHP', 'MySQL', 'Database'],
    ],
    [
        'id' => 7,
        'title' => 'Next.jsとGemini API',
        'description' => 'Next.jsからGemini APIを利用するAIアプリ開発',
        'tags' => ['TypeScript', 'Next.js', 'API', 'Gemini'],
    ],
    [
        'id' => 8,
        'title' => '画像アップロード機能',
        'description' => 'Webアプリで画像ファイルをアップロードする方法',
        'tags' => ['JavaScript', 'PHP', 'FileUpload'],
    ],
];

/*
 * 一覧データからタグを重複なしで取得
 */
$allTags = [];

foreach ($items as $item) {
    foreach ($item['tags'] as $tag) {
        $allTags[] = $tag;
    }
}

$allTags = array_values(array_unique($allTags));
sort($allTags);

?>
<!DOCTYPE html>
<html lang="ja">

<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0">

    <title>タグ検索</title>

    <script src="https://cdn.tailwindcss.com"></script>
</head>

<body class="min-h-screen bg-gray-100">

    <main class="max-w-5xl mx-auto px-4 py-10">

        <header class="mb-8">
            <h1 class="text-3xl font-bold text-gray-800">
                教材一覧
            </h1>

            <p class="mt-2 text-gray-600">
                タグを選択して教材を絞り込みます。
            </p>
        </header>

        <section class="bg-white rounded-lg shadow p-6 mb-8">

            <label
                for="tagInput"
                class="block text-sm font-medium text-gray-700 mb-2">
                タグ検索
            </label>

            <div
                id="searchArea"
                class="relative">
                <div class="flex gap-2">

                    <input
                        type="text"
                        id="tagInput"
                        placeholder="タグを入力..."
                        autocomplete="off"
                        class="flex-1 px-4 py-2 border border-gray-300 rounded-lg
                               focus:outline-none focus:ring-2 focus:ring-blue-500">

                    <button
                        type="button"
                        id="searchBtn"
                        class="px-5 py-2 bg-blue-600 text-white rounded-lg
                               hover:bg-blue-700">
                        検索
                    </button>

                    <button
                        type="button"
                        id="clearBtn"
                        class="px-5 py-2 bg-gray-500 text-white rounded-lg
                               hover:bg-gray-600">
                        クリア
                    </button>

                </div>

                <ul
                    id="suggestionList"
                    class="absolute top-full left-0 z-20 mt-1
                           w-full bg-white border border-gray-200
                           rounded-lg shadow-lg hidden overflow-hidden"></ul>
            </div>

            <div
                id="selectedTags"
                class="flex flex-wrap gap-2 mt-4"></div>

            <p
                id="resultCount"
                class="mt-4 text-sm text-gray-600">
                <?= count($items) ?>件表示中
            </p>

        </section>

        <section
            id="itemList"
            class="grid grid-cols-1 md:grid-cols-2 gap-5">

            <?php foreach ($items as $item): ?>

                <article
                    class="item-card bg-white rounded-lg shadow p-6"
                    data-tags='<?= htmlspecialchars(
                                    json_encode(
                                        $item['tags'],
                                        JSON_UNESCAPED_UNICODE
                                    ),
                                    ENT_QUOTES,
                                    'UTF-8'
                                ) ?>'>

                    <h2 class="text-xl font-bold text-gray-800">
                        <?= htmlspecialchars(
                            $item['title'],
                            ENT_QUOTES,
                            'UTF-8'
                        ) ?>
                    </h2>

                    <p class="mt-2 text-gray-600">
                        <?= htmlspecialchars(
                            $item['description'],
                            ENT_QUOTES,
                            'UTF-8'
                        ) ?>
                    </p>

                    <div class="flex flex-wrap gap-2 mt-4">

                        <?php foreach ($item['tags'] as $tag): ?>

                            <button
                                type="button"
                                class="item-tag px-3 py-1 text-sm
                                       bg-blue-100 text-blue-700 rounded-full
                                       hover:bg-blue-200"
                                data-tag="<?= htmlspecialchars(
                                                $tag,
                                                ENT_QUOTES,
                                                'UTF-8'
                                            ) ?>">
                                <?= htmlspecialchars(
                                    $tag,
                                    ENT_QUOTES,
                                    'UTF-8'
                                ) ?>
                            </button>

                        <?php endforeach; ?>

                    </div>

                </article>

            <?php endforeach; ?>

        </section>

        <p
            id="emptyMessage"
            class="hidden bg-white rounded-lg shadow p-8
                   text-center text-gray-500">
            条件に一致する教材がありません。
        </p>

    </main>

    <script>
        const allTags = <?= json_encode(
                            $allTags,
                            JSON_UNESCAPED_UNICODE |
                                JSON_HEX_TAG |
                                JSON_HEX_AMP |
                                JSON_HEX_APOS |
                                JSON_HEX_QUOT
                        ) ?>;
    </script>

    <script src="js/app.js"></script>

</body>

</html>