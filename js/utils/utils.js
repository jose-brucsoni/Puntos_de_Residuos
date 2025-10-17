/**
 * MÓDULO DE UTILIDADES
 * Funciones de utilidad generales
 * ========================================
 */

export function initUtils() {
    const utils = {
        /**
         * Inicializar utilidades
         */
        init() {
            this.setupGlobalUtils();
            this.initLazyLoading();
            this.initTooltips();
            this.initCopyToClipboard();
            
            return this;
        },

        /**
         * Configurar utilidades globales
         */
        setupGlobalUtils() {
            // Agregar utilidades al objeto window para uso global
            window.Utils = {
                debounce: this.debounce,
                throttle: this.throttle,
                formatDate: this.formatDate,
                formatNumber: this.formatNumber,
                generateId: this.generateId,
                copyToClipboard: this.copyToClipboard,
                showNotification: this.showNotification,
                getQueryParam: this.getQueryParam,
                setQueryParam: this.setQueryParam,
                smoothScroll: this.smoothScroll,
                isElementInViewport: this.isElementInViewport,
                getElementOffset: this.getElementOffset
            };
        },

        /**
         * Inicializar lazy loading
         */
        initLazyLoading() {
            const images = document.querySelectorAll('img[data-src]');
            
            if (images.length === 0) return;
            
            const imageObserver = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        const img = entry.target;
                        img.src = img.dataset.src;
                        img.classList.remove('lazy');
                        img.classList.add('loaded');
                        imageObserver.unobserve(img);
                    }
                });
            });
            
            images.forEach(img => {
                imageObserver.observe(img);
            });
        },

        /**
         * Inicializar tooltips
         */
        initTooltips() {
            const tooltipElements = document.querySelectorAll('[data-tooltip]');
            
            tooltipElements.forEach(element => {
                element.addEventListener('mouseenter', (event) => {
                    this.showTooltip(event.target, event.target.dataset.tooltip);
                });
                
                element.addEventListener('mouseleave', () => {
                    this.hideTooltip();
                });
            });
        },

        /**
         * Inicializar copy to clipboard
         */
        initCopyToClipboard() {
            const copyElements = document.querySelectorAll('[data-copy]');
            
            copyElements.forEach(element => {
                element.addEventListener('click', () => {
                    const text = element.dataset.copy;
                    this.copyToClipboard(text);
                });
            });
        },

        /**
         * Mostrar tooltip
         */
        showTooltip(element, text) {
            this.hideTooltip(); // Remover tooltip existente
            
            const tooltip = document.createElement('div');
            tooltip.className = 'tooltip';
            tooltip.textContent = text;
            tooltip.id = 'tooltip';
            
            document.body.appendChild(tooltip);
            
            const rect = element.getBoundingClientRect();
            const tooltipRect = tooltip.getBoundingClientRect();
            
            tooltip.style.position = 'absolute';
            tooltip.style.top = `${rect.top - tooltipRect.height - 8}px`;
            tooltip.style.left = `${rect.left + (rect.width - tooltipRect.width) / 2}px`;
            tooltip.style.zIndex = '9999';
            
            // Agregar estilos
            tooltip.style.cssText += `
                background-color: #333;
                color: white;
                padding: 4px 8px;
                border-radius: 4px;
                font-size: 12px;
                white-space: nowrap;
                pointer-events: none;
            `;
        },

        /**
         * Ocultar tooltip
         */
        hideTooltip() {
            const tooltip = document.getElementById('tooltip');
            if (tooltip) {
                tooltip.remove();
            }
        },

        /**
         * Debounce - retrasar ejecución de función
         */
        debounce(func, wait, immediate = false) {
            let timeout;
            return function executedFunction(...args) {
                const later = () => {
                    timeout = null;
                    if (!immediate) func(...args);
                };
                const callNow = immediate && !timeout;
                clearTimeout(timeout);
                timeout = setTimeout(later, wait);
                if (callNow) func(...args);
            };
        },

        /**
         * Throttle - limitar ejecución de función
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
         * Formatear fecha
         */
        formatDate(date, options = {}) {
            const defaultOptions = {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            };
            
            const formatOptions = { ...defaultOptions, ...options };
            return new Intl.DateTimeFormat('es-ES', formatOptions).format(new Date(date));
        },

        /**
         * Formatear número
         */
        formatNumber(number, options = {}) {
            const defaultOptions = {
                minimumFractionDigits: 0,
                maximumFractionDigits: 2
            };
            
            const formatOptions = { ...defaultOptions, ...options };
            return new Intl.NumberFormat('es-ES', formatOptions).format(number);
        },

        /**
         * Generar ID único
         */
        generateId(prefix = 'id') {
            return `${prefix}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },

        /**
         * Copiar texto al portapapeles
         */
        async copyToClipboard(text) {
            try {
                await navigator.clipboard.writeText(text);
                this.showNotification('Texto copiado al portapapeles', 'success');
                return true;
            } catch (err) {
                // Fallback para navegadores que no soportan clipboard API
                const textArea = document.createElement('textarea');
                textArea.value = text;
                document.body.appendChild(textArea);
                textArea.select();
                document.execCommand('copy');
                document.body.removeChild(textArea);
                this.showNotification('Texto copiado al portapapeles', 'success');
                return true;
            }
        },

        /**
         * Mostrar notificación
         */
        showNotification(message, type = 'info', duration = 3000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.textContent = message;
            
            // Estilos
            notification.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                padding: 12px 16px;
                border-radius: 4px;
                color: white;
                font-weight: 500;
                z-index: 10000;
                transform: translateX(100%);
                transition: transform 0.3s ease;
                max-width: 300px;
                word-wrap: break-word;
            `;
            
            // Colores según tipo
            const colors = {
                success: '#4CAF50',
                error: '#F44336',
                warning: '#FF9800',
                info: '#2196F3'
            };
            
            notification.style.backgroundColor = colors[type] || colors.info;
            
            document.body.appendChild(notification);
            
            // Animar entrada
            setTimeout(() => {
                notification.style.transform = 'translateX(0)';
            }, 100);
            
            // Remover después de la duración
            setTimeout(() => {
                notification.style.transform = 'translateX(100%)';
                setTimeout(() => {
                    if (notification.parentNode) {
                        notification.parentNode.removeChild(notification);
                    }
                }, 300);
            }, duration);
        },

        /**
         * Obtener parámetro de URL
         */
        getQueryParam(name, url = window.location.href) {
            const urlObj = new URL(url);
            return urlObj.searchParams.get(name);
        },

        /**
         * Establecer parámetro de URL
         */
        setQueryParam(name, value, url = window.location.href) {
            const urlObj = new URL(url);
            urlObj.searchParams.set(name, value);
            return urlObj.toString();
        },

        /**
         * Scroll suave a elemento
         */
        smoothScroll(target, options = {}) {
            const defaultOptions = {
                behavior: 'smooth',
                block: 'start',
                inline: 'nearest'
            };
            
            const scrollOptions = { ...defaultOptions, ...options };
            
            if (typeof target === 'string') {
                const element = document.querySelector(target);
                if (element) {
                    element.scrollIntoView(scrollOptions);
                }
            } else if (target instanceof Element) {
                target.scrollIntoView(scrollOptions);
            }
        },

        /**
         * Verificar si elemento está en viewport
         */
        isElementInViewport(element) {
            const rect = element.getBoundingClientRect();
            return (
                rect.top >= 0 &&
                rect.left >= 0 &&
                rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
                rect.right <= (window.innerWidth || document.documentElement.clientWidth)
            );
        },

        /**
         * Obtener offset de elemento
         */
        getElementOffset(element) {
            const rect = element.getBoundingClientRect();
            return {
                top: rect.top + window.pageYOffset,
                left: rect.left + window.pageXOffset,
                width: rect.width,
                height: rect.height
            };
        },

        /**
         * Validar email
         */
        isValidEmail(email) {
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            return emailRegex.test(email);
        },

        /**
         * Validar teléfono
         */
        isValidPhone(phone) {
            const phoneRegex = /^[\d\s\-\+\(\)]+$/;
            return phoneRegex.test(phone) && phone.replace(/\D/g, '').length >= 10;
        },

        /**
         * Sanitizar HTML
         */
        sanitizeHTML(html) {
            const temp = document.createElement('div');
            temp.textContent = html;
            return temp.innerHTML;
        },

        /**
         * Obtener datos de localStorage
         */
        getStorageData(key, defaultValue = null) {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (error) {
                console.error('Error al obtener datos de localStorage:', error);
                return defaultValue;
            }
        },

        /**
         * Establecer datos en localStorage
         */
        setStorageData(key, value) {
            try {
                localStorage.setItem(key, JSON.stringify(value));
                return true;
            } catch (error) {
                console.error('Error al establecer datos en localStorage:', error);
                return false;
            }
        },

        /**
         * Remover datos de localStorage
         */
        removeStorageData(key) {
            try {
                localStorage.removeItem(key);
                return true;
            } catch (error) {
                console.error('Error al remover datos de localStorage:', error);
                return false;
            }
        }
    };

    return utils.init();
}
