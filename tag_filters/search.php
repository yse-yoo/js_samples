<?php
header('Content-Type: application/json');

$query = $_GET['q'] ?? '';
$mockData = ['JavaScript', 'TypeScript', 'React', 'Next.js', 'TailwindCSS', 'Node.js', 'Python', 'FastAPI'];

if (empty($query)) {
    echo json_encode([]);
    exit;
}

$results = array_filter($mockData, function ($tag) use ($query) {
    return stripos($tag, $query) !== false;
});

echo json_encode(array_values($results));
