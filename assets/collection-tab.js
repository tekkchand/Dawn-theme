class CollectionTabs extends HTMLElement {
    constructor() {
      super();
      this.selectors = {
        collectionTitle: "collection-hero__title",
        collectionDesc: "collection-hero__description",
      };
      this.currentActiveTab = '';
      this.querySelectorAll('.collection-tab')
      .forEach(element => element.addEventListener('click', this.onTabClick.bind(this)));
    }

    toggleMobileMenu(event) {
      this.querySelector('.transformer-tabs ul').classList.toggle("open");
      event.preventDefault();
    }

    changeTab(event) {
      event.preventDefault();
      this.querySelectorAll('.collection-tab')
      .forEach(ele => {
        ele.classList.remove('active');
      });
      event.currentTarget.classList.add('active');
      this.toggleMobileMenu(event, this);
    }

    onTabClick(event) {
      if (event.currentTarget.classList.contains("active")) {
        this.toggleMobileMenu(event);
      } else {
        this.changeTab(event);
        var handle = event.currentTarget.getAttribute("data-handle");
        this.renderPage("/collections/" + handle, event);
      }     
    }

    renderPage(searchParams, event, updateURLHash = true) {
        this.getCollectionInfo(searchParams + '.json');
        const sections = this.getSections();
        document.getElementById('CollectionProductGrid').querySelector('.collection').classList.add('loading');
    
        sections.forEach((section) => {
          const url = `${window.location.origin}${searchParams}?section_id=${section.section}`;
          this.renderSectionFromFetch(url, section, event);
        });
    
        if (updateURLHash) this.updateURLHash(searchParams);
    }

    getCollectionInfo(url) {
        fetch(url)
          .then(response => response.text())
          .then((responseText) => {
            var data = JSON.parse(responseText);
            var cTitleDiv = document.getElementsByClassName(this.selectors.collectionTitle);
            var cDescDiv = document.getElementsByClassName(this.selectors.collectionDesc);
            if (cTitleDiv && cTitleDiv[0]) {
                cTitleDiv[0].innerHTML = data.collection.title;
            }
            if (cDescDiv && cDescDiv[0]) {
                cDescDiv[0].innerHTML = data.collection.description;
            }
          });
    }

    renderSectionFromFetch(url, section, event) {

        fetch(url)
          .then(response => response.text())
          .then((responseText) => {
            const html = responseText;
            this.renderProductGrid(html);
          });
    }

    renderProductGrid(html) {
        const innerHTML = new DOMParser()
            .parseFromString(html, 'text/html')
            .getElementById('CollectionProductGrid').innerHTML;

        document.getElementById('CollectionProductGrid').innerHTML = innerHTML;
    }

    updateURLHash(searchParams) {
        window.history.replaceState( {} , '', searchParams );
    }

    getSections() {
        return [
          {
            id: 'main-collection-product-grid',
            section: document.getElementById('main-collection-product-grid').dataset.id,
          }
        ]
    }
  }
  
  customElements.define('collection-tabs', CollectionTabs);