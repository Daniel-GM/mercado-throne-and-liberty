let traitMapping = {}
let currentPage = 1
const itemsPerPage = 25
let favorites = JSON.parse(localStorage.getItem('favorites')) || []

async function loadTraitMapping(language) {
  const path = `./traits/${language}Status.json`

  try {
    const response = await fetch(path)
    if (!response.ok) {
      throw new Error(`Erro ao carregar ${language}Status.json`)
    }
    const data = await response.json()
    traitMapping = data.result.data
  } catch (error) {
    console.error('Erro ao carregar mapeamento de status:', error)
  }
}

function getBackgroundColor(grade) {
  switch (grade) {
    case 1: return '#B7B7B7'
    case 2: return '#52BE72'
    case 3: return '#61A9F1'
    case 4: return '#A979CB'
    default: return '#FFFFFF'
  }
}

function toggleFavorite(itemId) {
  let favorites = JSON.parse(localStorage.getItem('favorites')) || []

  if (favorites.includes(itemId)) {
    favorites = favorites.filter(fav => fav !== itemId)
  } else {
    favorites.push(itemId)
  }

  localStorage.setItem('favorites', JSON.stringify(favorites))
  updateFavoriteButton(itemId)
}

function updateFavoriteButton(itemId) {
  const button = document.querySelector(`.favorite-button[data-id="${itemId}"]`)
  const favorites = JSON.parse(localStorage.getItem('favorites')) || []

  if (button) {
    if (favorites.includes(itemId)) {
      button.classList.add('favorited')
      button.innerHTML = '★'
    } else {
      button.classList.remove('favorited')
      button.innerHTML = '☆'
    }
  }
}

async function main(categoryFilter, subcategoryFilter, searchQuery, bossFilter, worldbossFilter, selectedRegions, onlyFavorites) {
  const [region1, region2] = selectedRegions
  const loadingElement = document.getElementById("loading")
  loadingElement.style.display = "flex"

  const region1Data = await fetchAuctionHouseData(region1)
  const region2Data = await fetchAuctionHouseData(region2)

  const region1Map = Object.fromEntries(region1Data.map(item => [item.id, item]))
  const region2Map = Object.fromEntries(region2Data.map(item => [item.id, item]))

  generate(region1Map, region2Map, categoryFilter, subcategoryFilter, searchQuery, bossFilter, worldbossFilter, [region1, region2], onlyFavorites)
    .then(() => {
      loadingElement.style.display = "none"
    })
    .catch(error => {
      console.error("Erro na busca:", error)
      loadingElement.style.display = "none"
    })
}

async function fetchAuctionHouseData(region) {
  const language = document.getElementById('language').value
  await loadTraitMapping(language)
  const apiUrl = `https://questlog.gg/throne-and-liberty/api/trpc/actionHouse.getAuctionHouse?input=${encodeURIComponent(`{"language":"${language}","regionId":"${region}"}`)}`
  const proxyUrl = `https://frosty-breeze-a53c.danielgomesmoura.workers.dev?url=${encodeURIComponent(apiUrl)}`

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

function generatePaginationButtons(totalItems) {
  const totalPages = Math.ceil(totalItems / itemsPerPage);
  let paginationHtml = '<nav><ul class="pagination justify-content-center flex-wrap">';

  const maxPagesToShow = 3;
  const sidePages = Math.floor(maxPagesToShow / 2);

  if (totalPages <= maxPagesToShow) {
    for (let i = 1; i <= totalPages; i++) {
      paginationHtml += `
        <li class="page-item ms-2 ${i === currentPage ? 'active' : ''}">
          <button class="page-link" onclick="changePage(${i})">${i}</button>
        </li>
      `;
    }
  } else {
    paginationHtml += `
      <li class="page-item ms-2 ${currentPage === 1 ? 'active' : ''}">
        <button class="page-link" onclick="changePage(1)">1</button>
      </li>
    `;

    if (currentPage > sidePages + 2) {
      paginationHtml += `
        <li class="page-item ms-2 disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }

    let startPage = Math.max(2, currentPage - sidePages);
    let endPage = Math.min(totalPages - 1, currentPage + sidePages);

    for (let i = startPage; i <= endPage; i++) {
      paginationHtml += `
        <li class="page-item ms-2 ${i === currentPage ? 'active' : ''}">
          <button class="page-link" onclick="changePage(${i})">${i}</button>
        </li>
      `;
    }

    if (currentPage < totalPages - sidePages - 1) {
      paginationHtml += `
        <li class="page-item ms-2 disabled">
          <span class="page-link">...</span>
        </li>
      `;
    }

    paginationHtml += `
      <li class="page-item ms-2 ${currentPage === totalPages ? 'disabled' : ''}">
        <button class="page-link" onclick="changePage(${totalPages})">${totalPages}</button>
      </li>
    `;
  }

  paginationHtml += '</ul></nav>'
  document.getElementsByClassName('pagination-elipse')[0].innerHTML = paginationHtml
  document.getElementsByClassName('pagination-elipse')[1].innerHTML = paginationHtml
}

function changePage(pageNumber) {
  currentPage = pageNumber
  executeFilter()
}

function generate(saFMap, naeEMap, categoryFilter = '', subcategoryFilter = '', searchQuery = '', bossFilter = '', worldbossFilter = '', selectedRegions, onlyFavorites) {
  return new Promise((resolve, reject) => {
    try {
      let htmlContent = ''
      const favorites = JSON.parse(localStorage.getItem('favorites')) || [];

      const filteredKeys = Object.keys(saFMap).filter(id => {
        const item = saFMap[id]
        const isCategoryMatch = !categoryFilter || item.mainCategory === categoryFilter
        const isSubCategoryMatch = !subcategoryFilter || item.subCategory === subcategoryFilter || item.subSubCategory === subcategoryFilter
        const isSearchMatch = !searchQuery || item.name.toLowerCase().includes(searchQuery.toLowerCase())
        const isBossMatch = !bossFilter || (bossDrops[bossFilter] && bossDrops[bossFilter].includes(id))
        const isWorldBossMatch = !worldbossFilter || (worldbossDrops[worldbossFilter] && worldbossDrops[worldbossFilter].includes(id))
        const isFavoriteMatch = !onlyFavorites || favorites.includes(id);

        return isCategoryMatch && isSubCategoryMatch && isSearchMatch && isBossMatch && isWorldBossMatch && isFavoriteMatch
      })

      const startIndex = (currentPage - 1) * itemsPerPage
      const endIndex = startIndex + itemsPerPage
      const itemsToDisplay = filteredKeys.slice(startIndex, endIndex)

      itemsToDisplay.forEach(id => {
        const itemSaF = saFMap[id]
        const itemNaeE = naeEMap[id]
        const itemImg = itemSaF.icon.replace(/\.[^.]*$/, '')
        const backgroundColor = getBackgroundColor(itemSaF.grade)
        const isFavorite = favorites.includes(id);

        // <h2 class="h6 mb-0" style="word-break: break-all; font-size: 14px;">${itemSaF.id}</h2>
        htmlContent += `
          <div class="card mb-3 shadow-sm">
            <div class="row g-0">
              <div class="col-md-10 w-100">
                <div class="card-header text-white d-flex align-items-center p-0" style="background-color: ${backgroundColor};">
                  <img src="https://cdn.questlog.gg/throne-and-liberty${itemImg}.webp" class="img-fluid rounded" alt="${itemSaF.name}" style="max-height: 100px;">
                  <div>
                    <h2 class="h6 mb-0" style="word-break: break-all; font-size: 14px;">${itemSaF.name}</h2>
                    </div>
                    <button class="favorite-button" data-id="${id}" onclick="toggleFavorite('${id}')" style="background-color: #00000000; border: none;">
                      ${isFavorite ? '★' : '☆'}
                    </button>
                </div>
                <div class="card-body">
        `;

        for (const traitId in itemSaF.traitIds) {
          const traitKey = itemSaF.traitIds[traitId]
          const traitInfo = traitMapping[traitKey] || { name: 'Desconhecido' }
          const traitName = traitInfo.name

          const traitItemSaF = itemSaF.traitItems.find(item => item.traitId === parseInt(traitId))
          const minPriceSaF = traitItemSaF ? traitItemSaF.minPrice : '-'
          const inStockSaF = traitItemSaF ? traitItemSaF.inStock : '0'

          const traitItemNaeE = itemNaeE ? itemNaeE.traitItems.find(item => item.traitId === parseInt(traitId)) : null
          const minPriceNaeE = traitItemNaeE ? traitItemNaeE.minPrice : '-'
          const inStockNaeE = traitItemNaeE ? traitItemNaeE.inStock : '0'

          htmlContent += `
            <div class="row align-items-center mb-3 justify-content-around d-flex flex-row">
              <strong>${traitName}</strong>
              <div class="row w-100 justify-content-between">
                <div class="d-flex flex-row justify-content-between align-items-center mt-2 mr-1 p-2 price-region" style="width: 48%; border-radius: 20px">
                  <span class="fw-light" style="padding: 2px 5px; font-size: 0.75rem;; border: 1px solid #ccc; border-radius: 100px">${selectedRegions[0] ? selectedRegions[0].toUpperCase() : 'Null'}</span>
                  <div class="text-end">
                    <span>${minPriceSaF}</span>
                    <img class="luc ms-1" src="https://cdn.questlog.gg/throne-and-liberty/common/lucent.webp" alt="luc" width="14">
                    <span>(${inStockSaF})</span>
                  </div>
                </div>
                <div class="d-flex flex-row justify-content-between align-items-center mt-2 ml-1 p-2 price-region" style="width: 48%; border-radius: 20px">
                  <span class="fw-light" style="padding: 2px 5px; font-size: 0.75rem;; border: 1px solid #ccc; border-radius: 100px" style="border: 1px solid #000">${selectedRegions[1] ? selectedRegions[1].toUpperCase() : 'Null'}</span>
                  <div class="text-end">
                    <span>${minPriceNaeE}</span>
                    <img class="luc ms-1" src="https://cdn.questlog.gg/throne-and-liberty/common/lucent.webp" alt="luc" width="14">
                    <span>(${inStockNaeE})</span>
                  </div>
                </div>
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
      })

      document.getElementById('main').innerHTML = htmlContent
      generatePaginationButtons(filteredKeys.length)
      
      resolve()
    } catch (error) {
      reject(error)
    }
  })
}

main(categoryFilter = '', subcategoryFilter = '', searchQuery = '', bossFilter = '', worldbossFilter = '', ["nae-e", "sa-f"], false)