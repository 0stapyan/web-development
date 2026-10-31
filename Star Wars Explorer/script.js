document.getElementById('fetch-planets').addEventListener('click', async () => {
    await fetchData('planets');
});

document.getElementById('fetch-people').addEventListener('click', async () => {
    await fetchData('people');
});

async function fetchData(type) {
    try {
        const response = await fetch(`https://swapi.dev/api/${type}/`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const data = await response.json();
        renderData(data.results, type);
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

function renderData(items, type) {
    const listContainer = document.getElementById('list-container');
    listContainer.innerHTML = '';  // Clear previous content
    items.forEach(item => {
        const div = document.createElement('div');
        div.classList.add('item');
        div.innerHTML = type === 'planets' ? item.name : item.name;
        listContainer.appendChild(div);
    });
}
