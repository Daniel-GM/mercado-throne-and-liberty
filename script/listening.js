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
    main(categoryFilter = '', searchQuery = '', bossFilter = '', ["nae-e", "sa-f"])
    cleanInputs()
})

document.getElementById('filter').addEventListener('click', async () => {
    executeFilter()
})

document.getElementById('categoryFilter').addEventListener('change', async () => {
    executeFilter()
})

document.getElementById('subcategoryFilter').addEventListener('change', async () => {
    executeFilter()
})

document.getElementById('bossFilter').addEventListener('change', async () => {
    executeFilter()
})

document.getElementById('worldbossFilter').addEventListener('change', async () => {
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

    await main(categoryFilter, subcategoryFilter, searchQuery, bossFilter, worldbossFilter, selectedRegions)
}

function cleanInputs() {
    
}