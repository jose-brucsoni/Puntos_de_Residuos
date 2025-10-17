/**
 * MÓDULO DE NAVEGACIÓN
 * Maneja la navegación principal del sitio
 * ========================================
 */

export function initNavigation() {
    const navigation = {
        // Elementos del DOM
        elements: {
            nav: null,
            menuToggle: null,
            menuItems: null,
            mobileMenu: null
        },

        // Estado
        isOpen: false,
        isMobile: false,

        /**
         * Inicializar navegación
         */
        init() {
            this.cacheElements();
            this.bindEvents();
            this.checkMobile();
            this.setupActiveLinks();
            
            return this;
        },

        /**
         * Cachear elementos del DOM
         */
        cacheElements() {
            this.elements.nav = document.querySelector('.main-nav');
            this.elements.menuToggle = document.querySelector('.menu-toggle');
            this.elements.menuItems = document.querySelectorAll('.nav-item');
            this.elements.mobileMenu = document.querySelector('.mobile-menu');
        },

        /**
         * Vincular eventos
         */
        bindEvents() {
            // Toggle del menú móvil
            if (this.elements.menuToggle) {
                this.elements.menuToggle.addEventListener('click', () => {
                    this.toggleMobileMenu();
                });
            }

            // Cerrar menú al hacer clic en un enlace
            this.elements.menuItems.forEach(item => {
                item.addEventListener('click', () => {
                    if (this.isMobile && this.isOpen) {
                        this.closeMobileMenu();
                    }
                });
            });

            // Cerrar menú al hacer clic fuera
            document.addEventListener('click', (event) => {
                if (this.isOpen && !this.elements.nav.contains(event.target)) {
                    this.closeMobileMenu();
                }
            });

            // Redimensionamiento de ventana
            window.addEventListener('resize', () => {
                this.checkMobile();
            });
        },

        /**
         * Verificar si es móvil
         */
        checkMobile() {
            this.isMobile = window.innerWidth < 768;
            
            if (!this.isMobile && this.isOpen) {
                this.closeMobileMenu();
            }
        },

        /**
         * Toggle del menú móvil
         */
        toggleMobileMenu() {
            if (this.isOpen) {
                this.closeMobileMenu();
            } else {
                this.openMobileMenu();
            }
        },

        /**
         * Abrir menú móvil
         */
        openMobileMenu() {
            if (!this.elements.mobileMenu) return;

            this.isOpen = true;
            this.elements.mobileMenu.classList.add('active');
            this.elements.menuToggle.classList.add('active');
            document.body.classList.add('menu-open');

            // Animar elementos del menú
            this.animateMenuItems();
        },

        /**
         * Cerrar menú móvil
         */
        closeMobileMenu() {
            if (!this.elements.mobileMenu) return;

            this.isOpen = false;
            this.elements.mobileMenu.classList.remove('active');
            this.elements.menuToggle.classList.remove('active');
            document.body.classList.remove('menu-open');
        },

        /**
         * Animar elementos del menú
         */
        animateMenuItems() {
            const items = this.elements.mobileMenu.querySelectorAll('.nav-item');
            items.forEach((item, index) => {
                item.style.animationDelay = `${index * 0.1}s`;
                item.classList.add('animate-in');
            });
        },

        /**
         * Configurar enlaces activos
         */
        setupActiveLinks() {
            const currentPath = window.location.pathname;
            
            this.elements.menuItems.forEach(item => {
                const link = item.querySelector('a');
                if (link && link.getAttribute('href') === currentPath) {
                    item.classList.add('active');
                }
            });
        },

        /**
         * Scroll suave a sección
         */
        smoothScrollTo(target) {
            const element = document.querySelector(target);
            if (element) {
                element.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        },

        /**
         * Actualizar navegación en scroll
         */
        updateOnScroll() {
            const scrollY = window.scrollY;
            const nav = this.elements.nav;

            if (scrollY > 100) {
                nav.classList.add('scrolled');
            } else {
                nav.classList.remove('scrolled');
            }
        }
    };

    return navigation.init();
}
