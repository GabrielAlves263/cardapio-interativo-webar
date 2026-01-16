/**
 * DADOS DO CARDÁPIO
 * path: caminho do arquivo GLB para a página Three.js
 * realScale: tamanho em metros (ex: 0.1 = 10cm) para a página Three.js
 * scale: tamanho para o A-Frame (MindAR)
 */
const menuItems = [
    {
        id: "menu-1",
        title: "Tábua de Frios",
        price: "R$ 85,00",
        desc: "Seleção premium.",
        modelId: "#model-snacks",
        path: "assets/food/snacks-2.glb",
        scale: "20 20 20",
        realScale: 0.9,
        hasOffer: false, // <--- NOVO
        isVegan: false, isGlutenFree: true, isLactoseFree: false
    },
    {
        id: "menu-2",
        title: "Sanduíche",
        price: "R$ 32,90",
        desc: "Artesanal.",
        modelId: "#model-sandwich",
        path: "assets/food/sandwich.glb",
        scale: "23 23 23",
        realScale: 1.3,
        hasOffer: false, // <--- NOVO
        isVegan: true, isGlutenFree: false, isLactoseFree: false 
    },
    {
        id: "menu-3",
        title: "Pizza",
        price: "R$ 45,00",
        desc: "Marguerita.",
        modelId: "#model-pizza",
        path: "assets/food/pizza-2.glb",
        scale: "30 30 30",
        realScale: 1.2,
        hasOffer: true, // <--- OFERTA ATIVA AQUI
        isVegan: false, isGlutenFree: false, isLactoseFree: false
    },
    {
        id: "menu-4",
        title: "Café da Manhã",
        price: "R$ 25,00",
        desc: "Completo.",
        modelId: "#model-breakfast",
        path: "assets/food/breakfest-4.glb",
        scale: "4 4 4",
        realScale: 0.18,
        hasOffer: false, // <--- NOVO
        isVegan: false, isGlutenFree: false, isLactoseFree: true
    },
    {
        id: "menu-5",
        title: "Frango",
        price: "R$ 38,00",
        desc: "Frito.",
        modelId: "#model-chicken",
        path: "assets/food/chicken-fries-2.glb",
        scale: "8 8 8",
        realScale: 0.25,
        hasOffer: true, // <--- OFERTA ATIVA AQUI
        isVegan: false, isGlutenFree: false, isLactoseFree: true
    },
    {
        id: "menu-6",
        title: "Tiramisù",
        price: "R$ 18,00",
        desc: "Doce.",
        modelId: "#model-cake",
        path: "assets/food/cake-2.glb",
        scale: "4 4 4",
        realScale: 0.27,
        hasOffer: false, // <--- NOVO
        isVegan: true, isGlutenFree: false, isLactoseFree: false
    }
];
const appState = {
    filters: { vegan: false, gluten: false, lactose: false },
    selectedItem: null
};

// Cache de elementos UI
let uiElements = {};

document.addEventListener('DOMContentLoaded', () => {
    init();
});

const init = () => {
    console.log("Inicializando MindAR...");
    
    uiElements = {
        scene: document.querySelector('a-scene'),
        target: document.getElementById('target-anchor'),
        modelContainer: document.getElementById('models-container'),
        btnPlace: document.getElementById('btn-place'),
        fabLayer: document.getElementById('ui-container'),
        detailsPanel: document.getElementById('product-details'),
        scanOverlay: document.getElementById('scan-guide'),
        fabTrigger: document.getElementById('fab-trigger'),
        fabOptions: document.getElementById('fab-options'),
        fabIcon: document.getElementById('fab-icon'),
        filterButtons: document.querySelectorAll('.filter-btn'),
        pTitle: document.getElementById('p-title'),
        pPrice: document.getElementById('p-price'),
        pDesc: document.getElementById('p-desc')
    };

    setupAREvents();      
    setupUIEvents();      
    setupProductClicks(); 
    setupNavigation(); // Configura o redirecionamento
    updateMenuVisuals(); 
};

/* --- NAVEGAÇÃO PARA PÁGINA 2 (THREE.JS) --- */
const setupNavigation = () => {
    if(!uiElements.btnPlace) return;

    uiElements.btnPlace.addEventListener('click', () => {
        if (!appState.selectedItem) return;

        const item = appState.selectedItem;

        // Salva dados no navegador
        sessionStorage.setItem('ar-model-path', item.path);
        sessionStorage.setItem('ar-model-scale', item.realScale);
        
        // --- NOVA LINHA: SALVA SE TEM OFERTA ---
        // Converte o booleano para string "true" ou "false"
        sessionStorage.setItem('ar-model-offer', item.hasOffer || false);
        
        console.log("Navegando para modo mesa:", item.path, "Oferta:", item.hasOffer);

        window.location.href = 'table-mode.html';
    });
};
/* --- MINDAR: CLIQUES NO CARDÁPIO --- */
const setupProductClicks = () => {
    menuItems.forEach(item => {
        const planeEl = document.getElementById(item.id);
        if(!planeEl) return;
        
        const handleSelect = () => selectProduct(item);
        planeEl.addEventListener('click', handleSelect);
        planeEl.addEventListener('touchstart', handleSelect);
    });
};

const selectProduct = (item) => {
    appState.selectedItem = item;
    uiElements.pTitle.innerText = item.title;
    uiElements.pPrice.innerText = item.price;
    uiElements.pDesc.innerText = item.desc;
    
    if(uiElements.target.object3D.visible) {
         uiElements.detailsPanel.classList.remove('hidden');
    }
    render3DModelOnMenu(item);
};

const render3DModelOnMenu = (item) => {
    uiElements.modelContainer.innerHTML = '';
    
    const wrapperEl = document.createElement('a-entity');
    wrapperEl.setAttribute('animation', 'property: scale; from: 0 0 0; to: 1 1 1; dur: 800; easing: easeOutElastic');

    const modelEl = document.createElement('a-gltf-model');
    modelEl.setAttribute('src', item.modelId);
    modelEl.setAttribute('scale', item.scale);
    
    // Offset para a esquerda (longe dos botões)
    modelEl.setAttribute('position', '-2 0 0'); 

    wrapperEl.appendChild(modelEl);
    uiElements.modelContainer.appendChild(wrapperEl);
};

/* --- ESTADOS DE RASTREAMENTO --- */
const setupAREvents = () => {
    if (!uiElements.target) return;

    uiElements.target.addEventListener("targetFound", () => {
        uiElements.fabLayer.classList.remove('hidden');
        uiElements.scanOverlay.classList.add('hidden');
        if(appState.selectedItem) uiElements.detailsPanel.classList.remove('hidden');
    });

    uiElements.target.addEventListener("targetLost", () => {
        uiElements.fabLayer.classList.add('hidden');
        uiElements.detailsPanel.classList.add('hidden');
        uiElements.scanOverlay.classList.remove('hidden');
        
        // Reseta UI do filtro
        uiElements.fabTrigger.classList.remove('open');
        uiElements.fabOptions.classList.remove('show');
        uiElements.fabIcon.innerText = 'filter_alt';
    });
};

/* --- UI & FILTROS --- */
const setupUIEvents = () => {
    uiElements.fabTrigger.addEventListener('click', () => {
        const isOpen = uiElements.fabTrigger.classList.toggle('open');
        uiElements.fabOptions.classList.toggle('show');
        uiElements.fabIcon.innerText = isOpen ? 'close' : 'filter_alt';
    });

    uiElements.filterButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            toggleFilterState(e.currentTarget.dataset.type, e.currentTarget);
        });
    });
};

const toggleFilterState = (type, btnElement) => {
    appState.filters[type] = !appState.filters[type];
    btnElement.classList.toggle('active', appState.filters[type]);
    updateMenuVisuals();
};

const updateMenuVisuals = () => {
    const hasActiveFilters = Object.values(appState.filters).some(val => val === true);
    menuItems.forEach(item => {
        const planeEl = document.getElementById(item.id);
        if (!planeEl) return;

        if (!hasActiveFilters) {
            setPlaneStyle(planeEl, 'neutral'); return;
        }

        let isValid = true;
        if (appState.filters.vegan && !item.isVegan) isValid = false;
        if (appState.filters.gluten && !item.isGlutenFree) isValid = false;
        if (appState.filters.lactose && !item.isLactoseFree) isValid = false;

        setPlaneStyle(planeEl, isValid ? 'safe' : 'danger');
    });
};

const setPlaneStyle = (element, status) => {
    const baseMaterial = "transparent: true; alphaTest: 0.5;";
    switch (status) {
        case 'neutral':
            element.setAttribute('src', '#tex-frame-safe');
            element.setAttribute('material', `${baseMaterial} opacity: 1; color: white;`);
            break;
        case 'safe':
            element.setAttribute('src', '#tex-frame-safe');
            element.setAttribute('material', `${baseMaterial} opacity: 1; color: white;`);
            break;
        case 'danger':
            element.setAttribute('src', '#tex-frame-blocked');
            element.setAttribute('material', `${baseMaterial} opacity: 0.8; color: white;`);
            break;
    }
};