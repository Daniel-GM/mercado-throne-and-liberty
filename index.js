async function main(categoryFilter, searchQuery) {
  const saF = await fetchAuctionHouseData("sa-f")
  const naeE = await fetchAuctionHouseData("nae-e")

  const saFMap = Object.fromEntries(saF.map(item => [item.id, item]))
  const naeEMap = Object.fromEntries(naeE.map(item => [item.id, item]))

  generate(saFMap, naeEMap, categoryFilter, searchQuery)
}

async function fetchAuctionHouseData(region) {
  const proxyUrl = `./proxy.php?region=${region}`

  try {
    const response = await fetch(proxyUrl, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      }
    })

    if (!response.ok) {
      throw new Error(`Erro na requisição: ${response.status}`)
    }

    const data = await response.json()
    return data.result.data
  } catch (error) {
    console.error('Erro ao buscar dados:', error)
  }
}

function generate(saFMap, naeEMap, categoryFilter = '', searchQuery = '') {
  let htmlContent = '';

  const filteredKeys = Object.keys(saFMap).filter(id => {
    const item = saFMap[id];
    const isCategoryMatch = !categoryFilter || item.mainCategory === categoryFilter;
    const isSearchMatch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    return isCategoryMatch && isSearchMatch;
  });

  filteredKeys.forEach(id => {
    const itemSaF = saFMap[id];
    const itemNaeE = naeEMap[id];
    const itemImg = itemSaF.icon.replace(/\.[^.]*$/, '');

    htmlContent += `
      <div class="card mb-3 shadow-sm">
        <div class="row g-0">
          <div class="col-md-2 d-flex align-items-center justify-content-center p-3">
            <img src="https://cdn.questlog.gg/throne-and-liberty${itemImg}.webp" class="img-fluid rounded" alt="${itemSaF.name}" style="max-height: 100px;">
          </div>
          <div class="col-md-10">
            <div class="card-header bg-primary text-white">
              <h2 class="h6 mb-0">${itemSaF.name}</h2>
            </div>
            <div class="card-body">
    `;

    for (const traitId in itemSaF.traitIds) {
      const traitName = itemSaF.traitIds[traitId] || 'Desconhecido';
      const traitItemSaF = itemSaF.traitItems.find(item => item.traitId === parseInt(traitId));
      const minPriceSaF = traitItemSaF ? traitItemSaF.minPrice : '-';
      const inStockSaF = traitItemSaF ? traitItemSaF.inStock : '0';

      const traitItemNaeE = itemNaeE ? itemNaeE.traitItems.find(item => item.traitId === parseInt(traitId)) : null;
      const minPriceNaeE = traitItemNaeE ? traitItemNaeE.minPrice : '-';
      const inStockNaeE = traitItemNaeE ? traitItemNaeE.inStock : '0';

      htmlContent += `
        <div class="row align-items-center mb-2 justify-content-around">
          <div class="col-4 col-md-3">
            <strong>${traitName}</strong>
          </div>
          <div class="col-4 col-md-3">
            <span class="fw-bold">SA-F:</span>
            <span>${minPriceSaF}</span>
            <img class="luc ms-1" src="https://cdn.questlog.gg/throne-and-liberty/common/lucent.webp" alt="luc" width="14">
            <span>(${inStockSaF})</span>
          </div>
          <div class="col-4 col-md-3">
            <span class="fw-bold">NAE-E:</span>
            <span>${minPriceNaeE}</span>
            <img class="luc ms-1" src="https://cdn.questlog.gg/throne-and-liberty/common/lucent.webp" alt="luc" width="14">
            <span>(${inStockNaeE})</span>
          </div>
        </div>
      `;
    }

    htmlContent += `
            </div>
          </div>
        </div>
      </div>
    `;
  });

  document.getElementById('main').innerHTML = htmlContent;
}

document.getElementById('categoryFilter').addEventListener('change', () => {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const searchQuery = document.getElementById('searchInput').value;
  main(categoryFilter, searchQuery);
});

document.getElementById('searchInput').addEventListener('input', () => {
  const categoryFilter = document.getElementById('categoryFilter').value;
  const searchQuery = document.getElementById('searchInput').value;
  main(categoryFilter, searchQuery);
});

main(categoryFilter = '', searchQuery = '')