(function () {
  const BASE_URL = 'https://movie-list.alphacamp.io'
  const INDEX_URL = BASE_URL + '/api/v1/movies/'
  const POSTER_URL = BASE_URL + '/posters/'

  const data = []
  const dataPanel = document.getElementById('data-panel')

  const searchForm = document.getElementById('search')
  const searchInput = document.getElementById('search-input')

  let paginationData = []
  const ITEM_PER_PAGE = 12
  const pagination = document.getElementById('pagination')

  const modeSwitch = document.getElementById('mode-switch')
  //初始頁面為卡片模式
  let modeInitial = 'modelCards'
  //初始頁面為第一頁
  let pageInitial = 1
  //初始頁面資料為data
  let dataInitial = data
 
  //取得api資料
  axios.get(INDEX_URL)
    .then(response => {
      data.push(...response.data.results)
      // displayDataList(data)
      getTotalPages(data)
      getPageData(1, data)
    })
    .catch(err => {
      console.log(err)
    })

  //search form submit event 的事件監聽器
  searchForm.addEventListener('submit', event => {
    event.preventDefault()
    let input = searchInput.value.toLowerCase()
    let results = data.filter(
      movie => movie.title.toLowerCase().includes(input)
    )
    dataInitial = results
    pageInitial = 1
    // displayDataList(results)
    getPageData(pageInitial, results)//取出特定頁面的資料，不然搜尋完結果不會分頁，且搜尋完按頁碼資料不是帶入搜尋完的這筆
    getTotalPages(results)
  })

  //Pagination 標籤的事件監聽器
  pagination.addEventListener('click', event => {
    if (event.target.tagName === 'A') {
      pageInitial = event.target.dataset.page
      getPageData(event.target.dataset.page)
    }
  })

  //'more' '+' click 事件監聽器
  dataPanel.addEventListener('click', event => {
    if (event.target.matches('.btn-show-movie')) {
      showMoviePanel(event.target.dataset.id)
    } else if (event.target.matches('.btn-add-favorite')) {
      addFavoriteItem(event.target.dataset.id)
    }
  })

  //mode click 事件監聽器
  modeSwitch.addEventListener('click', event => {
    if (event.target.matches('.mode-cards')) {
      modeInitial = 'modelCards'
      getPageData(pageInitial, dataInitial)
    } else if (event.target.matches('.mode-list')) {
      modeInitial = 'modelList'
      getPageData(pageInitial, dataInitial)
    }
  })

  //渲染頁面
  function displayDataList (data) {
    if (modeInitial === 'modelCards') {
      modelCardsShow(data)
    } else if (modeInitial === 'modelList') {
      modelListShow(data)
    }
  }

  //渲染電影詳細資料彈出視窗
  function showMoviePanel(id) {
    const modalTitle = document.getElementById('show-movie-title')
    const modalImage = document.getElementById('show-movie-image')
    const modalDate = document.getElementById('show-movie-date')
    const modalDescription = document.getElementById('show-movie-description')
    const url = INDEX_URL + id

    axios.get(url)
    .then(response => {
      const data = response.data.results
      modalTitle.textContent = data.title
      modalImage.innerHTML = `<img src="${POSTER_URL}${data.image}" class="img-fluid" alt="Responsive image">`
      modalDate.textContent = `release at : ${data.release_date}`
      modalDescription.textContent = `${data.description}`
    })
    .catch()
  }

  //加入最愛清單
  function addFavoriteItem(id) {
    const list = JSON.parse(localStorage.getItem('favoriteMovies')) || []
    const movie = data.find(item => item.id === Number(id))

    if (list.some(item => item.id === Number(id))) {
      alert(`${movie.title} is already in your favorite list.`)
    } else {
      list.push(movie)
      alert(`Added ${movie.title} to your favorite list!`)
    }
    localStorage.setItem('favoriteMovies', JSON.stringify(list))
  }

  //取出特定頁面的資料
  function getPageData(pageNum, data) {
    paginationData = data || paginationData
    let offset = (pageNum - 1) * ITEM_PER_PAGE
    let pageData = paginationData.slice(offset, offset + ITEM_PER_PAGE)
    displayDataList(pageData)
  }

  //計算總頁數並演算 li.page-item
  function getTotalPages (data) {
    let totalPages = Math.ceil(data.length / ITEM_PER_PAGE) || 1
    let pageItemContent = ''
    for (let i = 0; i < totalPages; i++) {
      pageItemContent += `
        <li class="page-item">
          <a class="page-link" href="javadcript:;" data-page="${i + 1}">${i + 1}</a>
        </li>
      `
    }
    pagination.innerHTML = pageItemContent
  }

  //卡片模式
  function modelCardsShow (data) {
    let htmlContent = ''

    data.forEach(item => {
      htmlContent += `
        <div class="col-sm-3">
          <div class="card mb-2">
            <img class="card-img-top " src="${POSTER_URL}${item.image}" alt="Card image cap">
            <div class="card-body movie-item-body">
              <h6 class="card-title">${item.title}</h6>
              <!-- more button -->
              <button class="btn btn-primary btn-show-movie" data-id="${item.id}" data-toggle="modal" data-target="#exampleModal">more</button>
              <!-- favorite button -->
              <button class="btn btn-info btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

  //列表模式
  function modelListShow (data) {
    let htmlContent = ''

    data.forEach(item => {
      htmlContent += `
        <div class="col-12">
          <div class="list d-flex">
              <h6 class="mr-auto">${item.title}</h6>
              <!-- more button -->
              <button class="btn btn-primary mr-sm-2 btn-show-movie" data-id="${item.id}" data-toggle="modal" data-target="#exampleModal">more</button>
              <!-- favorite button -->
              <button class="btn btn-info mr-sm-2 btn-add-favorite" data-id="${item.id}">+</button>
            </div>
          </div>
        </div>
      `
    })
    dataPanel.innerHTML = htmlContent
  }

})()
