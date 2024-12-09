/* Magic Mirror
 * Module: MagicMirror-8x8-Module
 *
 * MIT Licensed.
 */

Module.register('MMM-8x8', {
  defaults: {
    iconsPerPage: 20
  },
  loaded: false,
  prop: {
    icons: [],
    pageIndex: 0,
    lastPageIndex: 0,
    catIconsCount: 0,
    currentIcon: null,
    selectedIcon: null,
    categories: [],
    iconAnimationIndex: 0,
    currentCategoryName: null,
    playAnimation: false,
    isLoading: true,
    UPDATE_DOM_ANIMATION_TRANSITION: 0,
  },
  getStyles: function () {
    return [`${this.name}.css`, 'spinkit.css', 'font-awesome.css']
  },
  start: function () {
    Log.info('Starting module: ' + this.name)
    this.update()
    this.initProps()
    setInterval(
      this.update.bind(this),
      500
    );
  },
  update: function () {
    if(this.prop.playAnimation) {
      this.prop.iconAnimationIndex += 1
      if(this.prop.iconAnimationIndex > 100) {
        this.prop.iconAnimationIndex = 0
      }
      console.log(this.prop.iconAnimationIndex)
      this.updateDom()
    }
  },
  initProps: function () {
    this.sendGetCategories()
    this.sendGetCurrentIcon()
  },
  // --- I/O ----------------------------------------------------------------------------------------
  sendGetCurrentIcon: function() {
    this.sendSocketNotification("8x8_GET_ICON")
  },
  sendGetCategories: function() {
    this.sendSocketNotification('8x8_GET_CATEGORIES')
  },
  sendUpdateIcon: function() {
    this.sendSocketNotification('8x8_UPDATE_ICON', this.prop.selectedIcon);
  },
  refreshCurrentPageIcons: function () {
    
    console.log('refreshCurrentPageIcons', this.prop)

    this.prop.isLoading = true;
    this.updateDom(this.prop.UPDATE_DOM_ANIMATION_TRANSITION)

    const startIndex = this.config.iconsPerPage * this.prop.pageIndex
    const endIndex = startIndex + this.config.iconsPerPage - 1
    
    this.sendSocketNotification('8x8_GET_CAT_ICONS', { 
      category: this.prop.currentCategoryName,
      startIndex, 
      endIndex
    });
  },
  setCurrentCategory: function (categoryName) {

    console.log('setCurrentCategory', categoryName)

    this.prop.currentCategoryName = categoryName
    this.prop.icons = []
    this.prop.pageIndex = 0
    this.prop.lastPageIndex = 0
    this.prop.catIconsCount = 0

    this.sendSocketNotification('8x8_GET_CAT_DETAILS', this.prop.currentCategoryName)

  },
  socketNotificationReceived: function (notification, payload) {
    try {
      console.log('socketNotificationReceived', notification, payload)
      if(notification === "8x8_GET_ICON_RESP") {
        if(payload != null) {
          this.prop.currentIcon = payload
        } 
      } else if(notification === "8x8_UPDATE_ICON_RESP") {
        this.prop.selectedIcon = null
        this.sendGetCurrentIcon()
      } else if(notification === "8x8_GET_ICONS_RESP") {
        if(payload != null && Array.isArray(payload)) {
          this.prop.icons = payload
        } 
      } else if(notification === "8x8_GET_CAT_DETAILS_RESP") {
        if(payload != null) {
          this.prop.selectedIcon = null
          this.prop.iconAnimationIndex = 0
          this.prop.catIconsCount = payload.iconsCount
          this.prop.lastPageIndex = Math.ceil(this.prop.catIconsCount / this.config.iconsPerPage) - 1
          this.refreshCurrentPageIcons()
        } 
      } else if(notification === "8x8_GET_CATEGORIES_RESP") {
        if(payload != null) {
          this.prop.categories = payload
        } 
      }
    } catch (e) {
      console.error(e)
    } finally {
      this.prop.isLoading = false;
      this.updateDom(this.prop.UPDATE_DOM_ANIMATION_TRANSITION)
    }
  },
  // --- DOM ---------------------------------------------------------------------------------------
  buildCatNavBar: function () {

    console.log('buildCatNavBar', this.prop)

    const catNavDivWrapper = document.createElement('div')
    catNavDivWrapper.className = 'catNavBarWrapper'

    const catNavDiv = document.createElement('div')
    catNavDiv.className = 'catNavBar'
    this.prop.categories?.forEach(catName => {
      let switchCatButton = document.createElement('button');
      switchCatButton.textContent = catName;

      if(catName === this.prop.currentCategoryName) {
        console.log(catName === this.prop.currentCategoryName, catName, this.prop.currentCategoryName)
        switchCatButton.className = "currentCatNav-action"
      }

      switchCatButton.onclick = function () {
        this.setCurrentCategory(catName);
      }.bind(this);
      catNavDiv.appendChild(switchCatButton)
    })

    catNavDivWrapper.appendChild(catNavDiv)

    return catNavDivWrapper
  },
  buildIconPreview: function (icon, selectable, size) {

    if(icon == null) {
      icon = {
        id: 0,
        name: "",
        category_name: "",
        isAnimation: false,
        body: {
          icons: [[[],[],[],[],[],[],[],[]]]
        }
      }
    }

    const gridContainer = document.createElement('div');
    gridContainer.className = 'iconPreview ' + 'iconPreview-' + size;

    let index = 0
    if(icon.isAnimation) {
      index = this.prop.iconAnimationIndex % icon.body.icons.length
    }

    const leds = icon.body.icons[index]

    let row = 0
    for (let i = 0; i < 64; i++) {
      const col = i % 8
      if(i!== 0 && col === 0) {
        row += 1
      }
      const cell = document.createElement('div');
      cell.className = "icon-cell-" + size
      cell.style.backgroundColor = '#' + leds[row][col]
      if(leds[row][col] == null || leds[row][col] === "000000" ) {
        cell.className += " icon-cell-hidden"
      }
      gridContainer.appendChild(cell);
    }

    if(selectable) {
      gridContainer.onclick = function () {
        this.prop.selectedIcon = icon
        this.updateDom()
      }.bind(this);
    }

    return gridContainer
  },
  buildPreview: function () {
    let previewsDiv = document.createElement('div');
    previewsDiv.className = 'iconPreviewPage';

    this.prop.icons != null && this.prop.icons.forEach(i => {
      previewsDiv.appendChild(this.buildIconPreview(i, true, 'small'))
    });

    return previewsDiv

  },
  buildCurrentIconPreview: function (icon) {
    let currentIconPreviewsDiv = document.createElement('div');
    currentIconPreviewsDiv.className = 'currentIconPreview'
    if(this.prop.currentIcon == null) {
        let loadingDiv = document.createElement('div');
        loadingDiv.className = 'sk-pulse'
        currentIconPreviewsDiv.appendChild(loadingDiv) 
    } else {
      currentIconPreviewsDiv.appendChild(this.buildIconPreview(icon, false, 'medium'))
    }
    return currentIconPreviewsDiv
  },
  buildTopPanel: function () {
    let topDiv = document.createElement('div');
    topDiv.className = 'top-panel'

    let setCurrentIconButton = document.createElement('button');
    setCurrentIconButton.className = 'fa-solid fa-circle-chevron-right upload-action';
    setCurrentIconButton.disabled = this.prop.selectedIcon == null
    setCurrentIconButton.onclick = function () {
        this.prop.isLoading = true;
        this.updateDom(this.prop.UPDATE_DOM_ANIMATION_TRANSITION)
        this.sendUpdateIcon()
    }.bind(this);

    if(this.prop.selectedIcon != null) {
      topDiv.appendChild(this.buildCurrentIconPreview(this.prop.selectedIcon))
      topDiv.appendChild(setCurrentIconButton);
    }
    topDiv.appendChild(this.buildCurrentIconPreview(this.prop.currentIcon))

    return topDiv

  },
  buildCatIcons: function () {
    let previewDiv = document.createElement('div');
    previewDiv.className = 'catIcons'

    let prevIconPageButton = document.createElement('button');
    prevIconPageButton.className = 'fa-solid fa-chevron-left pageNav-action';
    prevIconPageButton.disabled = this.prop.pageIndex === 0
    prevIconPageButton.onclick = function () {
        this.prop.pageIndex = this.prop.pageIndex - 1;
        this.refreshCurrentPageIcons();
    }.bind(this);

    let nextIconPageButton = document.createElement('button');
    nextIconPageButton.className = 'fa-solid fa-chevron-right pageNav-action';
    nextIconPageButton.disabled = this.prop.pageIndex === this.prop.lastPageIndex
    nextIconPageButton.onclick = function () {
        this.prop.pageIndex = this.prop.pageIndex + 1;
        this.refreshCurrentPageIcons();
    }.bind(this);

    previewDiv.appendChild(prevIconPageButton)
    previewDiv.appendChild(this.buildPreview())
    previewDiv.appendChild(nextIconPageButton)

    return previewDiv
  },
  getDom: function () {

    console.log('getDom', this.prop)

    let moduleDiv = document.createElement('div');
    moduleDiv.className = 'MM8x8';

    if(this.prop.isLoading) {
        let loadingDiv = document.createElement('div');
        loadingDiv.className = 'sk-pulse'
        moduleDiv.appendChild(loadingDiv) 
        return moduleDiv
    }

    let playPauseAnimationButton = document.createElement('button');
    playPauseAnimationButton.className = 'playAnimation-action pageNav-action';
    if(this.prop.playAnimation) {
      playPauseAnimationButton.className += ' fa-solid fa-circle-pause';
    } else {
      playPauseAnimationButton.className += ' fa-solid fa-circle-play';
    }
    playPauseAnimationButton.onclick = function () {
        this.prop.playAnimation = !this.prop.playAnimation
        this.updateDom(this.prop.UPDATE_DOM_ANIMATION_TRANSITION)
    }.bind(this);
    moduleDiv.appendChild(playPauseAnimationButton)

    moduleDiv.appendChild(this.buildTopPanel())
    moduleDiv.appendChild(this.buildCatNavBar())
    moduleDiv.appendChild(this.buildCatIcons())

    return moduleDiv
  },
})
