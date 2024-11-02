const bossDrops = {
  "Toublek": ["bow_aa_t3_mythicbeast_003_TraitExtract", "staff_a_t3_mythicbeast_003_TraitExtract"],
  "Karnix": ["sword_a_t2_nomal_001_TraitExtract", "bow_aa_t5_boss_002_TraitExtract"]
  // "Toublek": ["", ""],
  // "Toublek": ["", ""],
  // "Toublek": ["", ""],
  // "Toublek": ["", ""],
}

let traitMapping = {}

async function loadTraitMapping() {
  try {
    const response = await fetch('./idStatus.json');
    if (!response.ok) {
      throw new Error('Erro ao carregar idStatus.json');
    }
    const data = await response.json();
    traitMapping = data.result.data;
  } catch (error) {
    console.error('Erro ao carregar mapeamento de status:', error);
  }
}

function getBackgroundColor(grade) {
  switch (grade) {
    case 1: return '#B7B7B7';
    case 2: return '#52BE72';
    case 3: return '#61A9F1';
    case 4: return '#A979CB';
    default: return '#FFFFFF';
  }
}

async function main(categoryFilter, searchQuery, bossFilter, selectedRegions) {
  await loadTraitMapping();

  const [region1, region2] = selectedRegions;

  const region1Data = await fetchAuctionHouseData(region1);
  const region2Data = await fetchAuctionHouseData(region2);

  const region1Map = Object.fromEntries(region1Data.map(item => [item.id, item]));
  const region2Map = Object.fromEntries(region2Data.map(item => [item.id, item]));

  generate(region1Map, region2Map, categoryFilter, searchQuery, bossFilter, [region1, region2]);
}

async function fetchAuctionHouseData(region) {
  const apiUrl = `https://questlog.gg/throne-and-liberty/api/trpc/actionHouse.getAuctionHouse?input=${encodeURIComponent(`{"language":"pt","regionId":"${region}"}`)}`;
  const proxyUrl = `https://frosty-breeze-a53c.danielgomesmoura.workers.dev?url=${encodeURIComponent(apiUrl)}`;

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

function generate(saFMap, naeEMap, categoryFilter = '', searchQuery = '', bossFilter = '', selectedRegions) {
  let htmlContent = '';

  const filteredKeys = Object.keys(saFMap).filter(id => {
    const item = saFMap[id];
    const isCategoryMatch = !categoryFilter || item.mainCategory === categoryFilter;
    const isSearchMatch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase());
    const isBossMatch = !bossFilter || (bossDrops[bossFilter] && bossDrops[bossFilter].includes(id));
    return isCategoryMatch && isSearchMatch && isBossMatch;
  });

  filteredKeys.forEach(id => {
    const itemSaF = saFMap[id];
    const itemNaeE = naeEMap[id];
    const itemImg = itemSaF.icon.replace(/\.[^.]*$/, '');
    const backgroundColor = getBackgroundColor(itemSaF.grade);

    htmlContent += `
      <div class="card mb-3 shadow-sm">
        <div class="row g-0">
          <div class="col-md-10 w-100">
            <div class="card-header text-white d-flex align-items-center p-0" style="background-color: ${backgroundColor};">
              <img src="https://cdn.questlog.gg/throne-and-liberty${itemImg}.webp" class="img-fluid rounded" alt="${itemSaF.name}" style="max-height: 100px;">
              <div>
                <h2 class="h6 mb-0">${itemSaF.name}</h2>
                <h2 class="h6 mb-0">${itemSaF.id}</h2>
              </div>
            </div>
            <div class="card-body">
    `;

    for (const traitId in itemSaF.traitIds) {
      const traitKey = itemSaF.traitIds[traitId];
      const traitInfo = traitMapping[traitKey] || { name: 'Desconhecido' };
      const traitName = traitInfo.name;

      const traitItemSaF = itemSaF.traitItems.find(item => item.traitId === parseInt(traitId));
      const minPriceSaF = traitItemSaF ? traitItemSaF.minPrice : '-';
      const inStockSaF = traitItemSaF ? traitItemSaF.inStock : '0';

      const traitItemNaeE = itemNaeE ? itemNaeE.traitItems.find(item => item.traitId === parseInt(traitId)) : null;
      const minPriceNaeE = traitItemNaeE ? traitItemNaeE.minPrice : '-';
      const inStockNaeE = traitItemNaeE ? traitItemNaeE.inStock : '0';

      htmlContent += `
        <div class="row align-items-center mb-3 justify-content-around">
          <div class="col-4 col-md-3">
            <strong>${traitName}</strong>
          </div>
          <div class="col-4 col-md-3">
            <span class="fw-light" style="padding: 2px 10px; font-size: 0.75rem;; border: 1px solid #ccc; border-radius: 100px">${selectedRegions[0] ? selectedRegions[0].toUpperCase() : 'Null'}</span>
            <span>${minPriceSaF}</span>
            <img class="luc ms-1" src="https://cdn.questlog.gg/throne-and-liberty/common/lucent.webp" alt="luc" width="14">
            <span>(${inStockSaF})</span>
          </div>
          <div class="col-4 col-md-3">
            <span class="fw-light" style="padding: 2px 10px; font-size: 0.75rem;; border: 1px solid #ccc; border-radius: 100px" style="border: 1px solid #000">${selectedRegions[1] ? selectedRegions[1].toUpperCase() : 'Null'}</span>
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

// document.getElementById('categoryFilter').addEventListener('change', async () => {
//   const selectedCheckboxes = Array.from(document.querySelectorAll('#checkbox-region input[type="checkbox"]:checked'));
  
//   const categoryFilter = document.getElementById('categoryFilter').value;
//   const searchQuery = document.getElementById('searchInput').value;
//   const selectedRegions = selectedCheckboxes.map(checkbox => checkbox.id);

//   await main(categoryFilter, searchQuery, bossFilter, selectedRegions);
// });

// document.getElementById('searchInput').addEventListener('input', async () => {
//   const selectedCheckboxes = Array.from(document.querySelectorAll('#checkbox-region input[type="checkbox"]:checked'));
  
//   const categoryFilter = document.getElementById('categoryFilter').value;
//   const searchQuery = document.getElementById('searchInput').value;
//   const selectedRegions = selectedCheckboxes.map(checkbox => checkbox.id);

//   await main(categoryFilter, searchQuery, bossFilter, selectedRegions);
// });

// document.getElementById('bossFilter').addEventListener('change', async () => {
//   const selectedCheckboxes = Array.from(document.querySelectorAll('#checkbox-region input[type="checkbox"]:checked'));
  
//   const categoryFilter = document.getElementById('categoryFilter').value;
//   const searchQuery = document.getElementById('searchInput').value;
//   const bossFilter = document.getElementById('bossFilter').value;
//   const selectedRegions = selectedCheckboxes.map(checkbox => checkbox.id);

//   await main(categoryFilter, searchQuery, bossFilter, selectedRegions);
// });

document.getElementById('checkbox-region').addEventListener('change', async (event) => {
  const selectedCheckboxes = Array.from(document.querySelectorAll('#checkbox-region input[type="checkbox"]:checked'));

  if (selectedCheckboxes.length > 2) {
    event.target.checked = false;
    alert("Você pode selecionar no máximo duas regiões.");
    return;
  }
});

document.getElementById('filter').addEventListener('click', async () => {
  const selectedCheckboxes = Array.from(document.querySelectorAll('#checkbox-region input[type="checkbox"]:checked'));
  
  const categoryFilter = document.getElementById('categoryFilter').value;
  const searchQuery = document.getElementById('searchInput').value;
  const bossFilter = document.getElementById('bossFilter').value;
  const selectedRegions = selectedCheckboxes.map(checkbox => checkbox.id);
  
  await main(categoryFilter, searchQuery, bossFilter, selectedRegions);
})

document.getElementById('clean-filter').addEventListener('click', async () => {
  main(categoryFilter = '', searchQuery = '', bossFilter = '', ["nae-e", "sa-f"])
})

main(categoryFilter = '', searchQuery = '', bossFilter = '', ["nae-e", "sa-f"])