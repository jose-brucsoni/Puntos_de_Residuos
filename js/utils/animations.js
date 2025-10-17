/**
 * MÓDULO DE ANIMACIONES
 * Maneja animaciones y efectos visuales
 * ========================================
 */

export function initAnimations() {
    const animations = {
        // Configuración
        config: {
            duration: 300,
            easing: 'ease-out',
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        },

        // Estado
        observers: new Map(),
        animatedElements: new Set(),

        /**
         * Inicializar animaciones
         */
        init() {
            this.setupStyles();
            this.initScrollAnimations();
            this.initHoverAnimations();
            this.initClickAnimations();
            this.bindEvents();
            
            return this;
        },

        /**
         * Configurar estilos CSS
         */
        setupStyles() {
            const style = document.createElement('style');
            style.textContent = `
                /* Animaciones de entrada */
                .animate-fade-in {
                    opacity: 0;
                    transform: translateY(20px);
                    transition: all 0.6s ease-out;
                }
                
                .animate-fade-in.animated {
                    opacity: 1;
                    transform: translateY(0);
                }
                
                .animate-slide-left {
                    opacity: 0;
                    transform: translateX(-30px);
                    transition: all 0.6s ease-out;
                }
                
                .animate-slide-left.animated {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .animate-slide-right {
                    opacity: 0;
                    transform: translateX(30px);
                    transition: all 0.6s ease-out;
                }
                
                .animate-slide-right.animated {
                    opacity: 1;
                    transform: translateX(0);
                }
                
                .animate-scale-up {
                    opacity: 0;
                    transform: scale(0.9);
                    transition: all 0.6s ease-out;
                }
                
                .animate-scale-up.animated {
                    opacity: 1;
                    transform: scale(1);
                }
                
                /* Animaciones de hover */
                .hover-lift {
                    transition: transform 0.3s ease, box-shadow 0.3s ease;
                }
                
                .hover-lift:hover {
                    transform: translateY(-5px);
                    box-shadow: var(--shadow-lg);
                }
                
                .hover-scale {
                    transition: transform 0.3s ease;
                }
                
                .hover-scale:hover {
                    transform: scale(1.05);
                }
                
                .hover-rotate {
                    transition: transform 0.3s ease;
                }
                
                .hover-rotate:hover {
                    transform: rotate(5deg);
                }
                
                /* Animaciones de click */
                .click-bounce {
                    transition: transform 0.1s ease;
                }
                
                .click-bounce:active {
                    transform: scale(0.95);
                }
                
                /* Animaciones de carga */
                .loading-spinner {
                    display: inline-block;
                    width: 20px;
                    height: 20px;
                    border: 2px solid #f3f3f3;
                    border-top: 2px solid var(--color-primary);
                    border-radius: 50%;
                    animation: spin 1s linear infinite;
                }
                
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
                
                .loading-dots::after {
                    content: '';
                    animation: dots 1.5s steps(4, end) infinite;
                }
                
                @keyframes dots {
                    0%, 20% { content: ''; }
                    40% { content: '.'; }
                    60% { content: '..'; }
                    80%, 100% { content: '...'; }
                }
                
                /* Animaciones de texto */
                .text-reveal {
                    overflow: hidden;
                }
                
                .text-reveal .text-line {
                    display: inline-block;
                    transform: translateY(100%);
                    transition: transform 0.6s ease;
                }
                
                .text-reveal.animated .text-line {
                    transform: translateY(0);
                }
                
                /* Animaciones de progreso */
                .progress-bar {
                    width: 100%;
                    height: 4px;
                    background-color: #e0e0e0;
                    border-radius: 2px;
                    overflow: hidden;
                }
                
                .progress-fill {
                    height: 100%;
                    background-color: var(--color-primary);
                    width: 0%;
                    transition: width 0.6s ease;
                }
                
                .progress-fill.animated {
                    width: 100%;
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * Inicializar animaciones de scroll
         */
        initScrollAnimations() {
            const elements = document.querySelectorAll('[data-animate]');
            
            if (elements.length === 0) return;
            
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        this.triggerAnimation(entry.target);
                    }
                });
            }, {
                threshold: this.config.threshold,
                rootMargin: this.config.rootMargin
            });
            
            elements.forEach(element => {
                observer.observe(element);
                this.animatedElements.add(element);
            });
            
            this.observers.set('scroll', observer);
        },

        /**
         * Inicializar animaciones de hover
         */
        initHoverAnimations() {
            const hoverElements = document.querySelectorAll('[data-hover]');
            
            hoverElements.forEach(element => {
                const animationType = element.dataset.hover;
                element.classList.add(`hover-${animationType}`);
            });
        },

        /**
         * Inicializar animaciones de click
         */
        initClickAnimations() {
            const clickElements = document.querySelectorAll('[data-click]');
            
            clickElements.forEach(element => {
                const animationType = element.dataset.click;
                element.classList.add(`click-${animationType}`);
            });
        },

        /**
         * Vincular eventos
         */
        bindEvents() {
            // Redimensionamiento de ventana
            window.addEventListener('resize', this.debounce(() => {
                this.handleResize();
            }, 250));
            
            // Scroll
            window.addEventListener('scroll', this.throttle(() => {
                this.handleScroll();
            }, 16));
        },

        /**
         * Disparar animación
         */
        triggerAnimation(element) {
            const animationType = element.dataset.animate;
            const delay = parseInt(element.dataset.delay) || 0;
            
            setTimeout(() => {
                element.classList.add('animated');
                
                // Emitir evento personalizado
                this.emitEvent('animation:triggered', {
                    element,
                    animationType
                });
            }, delay);
        },

        /**
         * Animar elemento específico
         */
        animateElement(element, animationType, options = {}) {
            const {
                duration = this.config.duration,
                delay = 0,
                callback = null
            } = options;
            
            element.style.transitionDuration = `${duration}ms`;
            element.classList.add(`animate-${animationType}`);
            
            setTimeout(() => {
                element.classList.add('animated');
                
                if (callback) {
                    setTimeout(callback, duration);
                }
            }, delay);
        },

        /**
         * Animar lista de elementos secuencialmente
         */
        animateSequence(elements, animationType, options = {}) {
            const {
                stagger = 100,
                duration = this.config.duration
            } = options;
            
            elements.forEach((element, index) => {
                this.animateElement(element, animationType, {
                    ...options,
                    delay: index * stagger
                });
            });
        },

        /**
         * Animar texto línea por línea
         */
        animateText(element, options = {}) {
            const {
                delay = 100,
                duration = 600
            } = options;
            
            const text = element.textContent;
            const words = text.split(' ');
            
            element.innerHTML = '';
            element.classList.add('text-reveal');
            
            words.forEach((word, index) => {
                const span = document.createElement('span');
                span.textContent = word + ' ';
                span.className = 'text-line';
                span.style.transitionDelay = `${index * delay}ms`;
                element.appendChild(span);
            });
            
            setTimeout(() => {
                element.classList.add('animated');
            }, 100);
        },

        /**
         * Animar barra de progreso
         */
        animateProgress(element, percentage, options = {}) {
            const {
                duration = 1000,
                delay = 0
            } = options;
            
            const progressFill = element.querySelector('.progress-fill');
            if (!progressFill) return;
            
            setTimeout(() => {
                progressFill.style.transitionDuration = `${duration}ms`;
                progressFill.style.width = `${percentage}%`;
                progressFill.classList.add('animated');
            }, delay);
        },

        /**
         * Crear spinner de carga
         */
        createSpinner(options = {}) {
            const {
                size = 'medium',
                color = 'var(--color-primary)',
                text = ''
            } = options;
            
            const spinner = document.createElement('div');
            spinner.className = 'loading-spinner';
            spinner.style.width = size === 'small' ? '16px' : size === 'large' ? '32px' : '20px';
            spinner.style.height = spinner.style.width;
            spinner.style.borderTopColor = color;
            
            if (text) {
                const container = document.createElement('div');
                container.className = 'loading-container';
                container.style.display = 'flex';
                container.style.alignItems = 'center';
                container.style.gap = '8px';
                
                container.appendChild(spinner);
                container.appendChild(document.createTextNode(text));
                
                return container;
            }
            
            return spinner;
        },

        /**
         * Manejar redimensionamiento
         */
        handleResize() {
            // Recalcular animaciones si es necesario
            this.observers.forEach(observer => {
                observer.disconnect();
            });
            
            this.initScrollAnimations();
        },

        /**
         * Manejar scroll
         */
        handleScroll() {
            // Lógica adicional de scroll si es necesaria
        },

        /**
         * Limpiar animaciones
         */
        cleanup() {
            this.observers.forEach(observer => {
                observer.disconnect();
            });
            
            this.observers.clear();
            this.animatedElements.clear();
        },

        /**
         * Utilidad: debounce
         */
        debounce(func, wait) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    clearTimeout(timeout);
                    func(...args);
                };
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
            };
        },

        /**
         * Utilidad: throttle
         */
        throttle(func, limit) {
            let inThrottle;
            return function(...args) {
                if (!inThrottle) {
                    func.apply(this, args);
                    inThrottle = true;
                    setTimeout(() => inThrottle = false, limit);
                }
            };
        },

        /**
         * Emitir evento personalizado
         */
        emitEvent(eventName, detail) {
            const event = new CustomEvent(eventName, { detail });
            document.dispatchEvent(event);
        }
    };

    return animations.init();
}
