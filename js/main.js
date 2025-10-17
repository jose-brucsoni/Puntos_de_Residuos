/**
 * ARCHIVO PRINCIPAL DE JAVASCRIPT
 * Puntos de Residuos - Proyecto Web
 * ========================================
 */

// Importar módulos
import { initNavigation } from './components/navigation.js';
import { initForms } from './components/forms.js';
import { initModals } from './components/modals.js';
import { initAnimations } from './utils/animations.js';
import { initUtils } from './utils/utils.js';

// Configuración global
const CONFIG = {
    debug: true,
    apiUrl: '/api',
    version: '1.0.0'
};

// Clase principal de la aplicación
class App {
    constructor() {
        this.config = CONFIG;
        this.modules = {};
        this.isInitialized = false;
    }

    /**
     * Inicializar la aplicación
     */
    async init() {
        try {
            if (this.isInitialized) {
                console.warn('La aplicación ya ha sido inicializada');
                return;
            }

            this.log('Iniciando aplicación...');

            // Inicializar módulos
            await this.initModules();

            // Configurar eventos globales
            this.setupGlobalEvents();

            // Marcar como inicializada
            this.isInitialized = true;

            this.log('Aplicación inicializada correctamente');
        } catch (error) {
            console.error('Error al inicializar la aplicación:', error);
        }
    }

    /**
     * Inicializar todos los módulos
     */
    async initModules() {
        const modules = [
            { name: 'navigation', init: initNavigation },
            { name: 'forms', init: initForms },
            { name: 'modals', init: initModals },
            { name: 'animations', init: initAnimations },
            { name: 'utils', init: initUtils }
        ];

        for (const module of modules) {
            try {
                this.modules[module.name] = await module.init();
                this.log(`Módulo ${module.name} inicializado`);
            } catch (error) {
                console.error(`Error al inicializar módulo ${module.name}:`, error);
            }
        }
    }

    /**
     * Configurar eventos globales
     */
    setupGlobalEvents() {
        // Evento de carga completa
        window.addEventListener('load', () => {
            this.log('Página completamente cargada');
        });

        // Evento de redimensionamiento
        window.addEventListener('resize', this.debounce(() => {
            this.log('Ventana redimensionada');
            this.handleResize();
        }, 250));

        // Evento de scroll
        window.addEventListener('scroll', this.throttle(() => {
            this.handleScroll();
        }, 16));

        // Evento de clic global
        document.addEventListener('click', (event) => {
            this.handleGlobalClick(event);
        });
    }

    /**
     * Manejar redimensionamiento de ventana
     */
    handleResize() {
        // Lógica para manejar redimensionamiento
        if (this.modules.animations) {
            this.modules.animations.handleResize();
        }
    }

    /**
     * Manejar scroll
     */
    handleScroll() {
        // Lógica para manejar scroll
        if (this.modules.animations) {
            this.modules.animations.handleScroll();
        }
    }

    /**
     * Manejar clics globales
     */
    handleGlobalClick(event) {
        // Lógica para manejar clics globales
        const target = event.target;
        
        // Cerrar modales al hacer clic fuera
        if (target.classList.contains('modal-backdrop')) {
            this.closeAllModals();
        }
    }

    /**
     * Cerrar todos los modales
     */
    closeAllModals() {
        if (this.modules.modals) {
            this.modules.modals.closeAll();
        }
    }

    /**
     * Obtener módulo por nombre
     */
    getModule(name) {
        return this.modules[name] || null;
    }

    /**
     * Función de utilidad: debounce
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
    }

    /**
     * Función de utilidad: throttle
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
    }

    /**
     * Log con configuración de debug
     */
    log(message, ...args) {
        if (this.config.debug) {
            console.log(`[App] ${message}`, ...args);
        }
    }
}

// Crear instancia global de la aplicación
window.App = new App();

// Inicializar cuando el DOM esté listo
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.App.init();
    });
} else {
    window.App.init();
}

// Exportar para uso en módulos
export default window.App;
