const uri = "http://172.16.2.75/NMB/api/menu/list.php";
async function fetchMenuData() {
    try {
        const response = await fetch(uri);
        const data = await response.json();
        console.log(data)
        displayMenuData(data);
    } catch (error) {
        console.error('Error fetching the menu data:', error);
    }
}

function displayMenuData(menuItems) {
    const menuList = document.getElementById('menu-list');
    menuItems.forEach(item => {
        const menuItemDiv = document.createElement('div');
        menuItemDiv.classList.add('bg-white', 'p-6', 'rounded-lg', 'shadow-lg', 'hover:shadow-2xl', 'transition-shadow', 'duration-300');

        menuItemDiv.innerHTML = `
            <h2 class="text-2xl font-semibold mb-2">${item.name}</h2>
            <p class="text-gray-600 mb-4">${item.category}</p>
            <p class="text-lg font-bold text-green-600">¥${item.price}</p>
        `;
        menuList.appendChild(menuItemDiv);
    });
}

// ページが読み込まれたらデータを取得
fetchMenuData();