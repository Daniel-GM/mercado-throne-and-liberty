document.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        document.getElementById('filter').click()
    }
})

document.getElementById('checkbox-region').addEventListener('change', async (event) => {
    const selectedCheckboxes = Array.from(document.querySelectorAll('#checkbox-region input[type="checkbox"]:checked'))

    if (selectedCheckboxes.length > 2) {
        event.target.checked = false
        alert("Você pode selecionar no máximo duas regiões.")
        return
    }
})

document.getElementById('clean-filter').addEventListener('click', async () => {
    cleanInputs()
    executeFilter()
})

document.getElementById('filter').addEventListener('click', async () => {
    executeFilter()
})

async function executeFilter() {
    const selectedCheckboxes = Array.from(document.querySelectorAll('#checkbox-region input[type="checkbox"]:checked'))

    const categoryFilter = document.getElementById('categoryFilter').value
    const subcategoryFilter = document.getElementById('subcategoryFilter').value
    const searchQuery = document.getElementById('searchInput').value
    const bossFilter = document.getElementById('bossFilter').value
    const worldbossFilter = document.getElementById('worldbossFilter').value
    const selectedRegions = selectedCheckboxes.map(checkbox => checkbox.id)
    const favoriteFilter = document.getElementById('favorite-filter').value;
    const onlyFavorites = favoriteFilter === 'favoritos';

    await main(categoryFilter, subcategoryFilter, searchQuery, bossFilter, worldbossFilter, selectedRegions, onlyFavorites)
}

function cleanInputs() {
    document.getElementById('categoryFilter').value = ''
    document.getElementById('subcategoryFilter').value = ''
    document.getElementById('searchInput').value = ''
    document.getElementById('bossFilter').value = ''
    document.getElementById('worldbossFilter').value = ''
    document.getElementById('favorite-filter').value = ''
}