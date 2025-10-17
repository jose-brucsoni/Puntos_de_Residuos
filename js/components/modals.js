/**
 * MÓDULO DE MODALES
 * Maneja la apertura, cierre y gestión de modales
 * ========================================
 */

export function initModals() {
    const modals = {
        // Estado
        activeModals: new Set(),
        zIndex: 1000,

        /**
         * Inicializar modales
         */
        init() {
            this.cacheModals();
            this.bindEvents();
            this.setupStyles();
            
            return this;
        },

        /**
         * Cachear modales
         */
        cacheModals() {
            const modalElements = document.querySelectorAll('[data-modal]');
            
            modalElements.forEach(modal => {
                this.setupModal(modal);
            });
        },

        /**
         * Configurar modal individual
         */
        setupModal(modal) {
            const modalId = modal.id || `modal-${Date.now()}`;
            modal.id = modalId;
            
            // Agregar clases base
            modal.classList.add('modal');
            
            // Crear backdrop si no existe
            if (!modal.querySelector('.modal-backdrop')) {
                const backdrop = document.createElement('div');
                backdrop.className = 'modal-backdrop';
                modal.appendChild(backdrop);
            }
            
            // Crear botón de cerrar si no existe
            if (!modal.querySelector('.modal-close')) {
                const closeBtn = document.createElement('button');
                closeBtn.className = 'modal-close';
                closeBtn.innerHTML = '&times;';
                closeBtn.setAttribute('aria-label', 'Cerrar modal');
                
                const modalContent = modal.querySelector('.modal-content');
                if (modalContent) {
                    modalContent.appendChild(closeBtn);
                }
            }
        },

        /**
         * Vincular eventos
         */
        bindEvents() {
            // Cerrar con botón X
            document.addEventListener('click', (event) => {
                if (event.target.classList.contains('modal-close')) {
                    const modal = event.target.closest('.modal');
                    this.close(modal.id);
                }
            });

            // Cerrar con backdrop
            document.addEventListener('click', (event) => {
                if (event.target.classList.contains('modal-backdrop')) {
                    const modal = event.target.closest('.modal');
                    this.close(modal.id);
                }
            });

            // Cerrar con tecla Escape
            document.addEventListener('keydown', (event) => {
                if (event.key === 'Escape') {
                    this.closeAll();
                }
            });

            // Prevenir scroll del body cuando hay modales abiertos
            this.observeModalChanges();
        },

        /**
         * Configurar estilos
         */
        setupStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .modal {
                    position: fixed;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    z-index: var(--z-modal);
                    display: none;
                    align-items: center;
                    justify-content: center;
                    padding: var(--spacing-md);
                }
                
                .modal.active {
                    display: flex;
                }
                
                .modal-backdrop {
                    position: absolute;
                    top: 0;
                    left: 0;
                    width: 100%;
                    height: 100%;
                    background-color: rgba(0, 0, 0, 0.5);
                    backdrop-filter: blur(2px);
                }
                
                .modal-content {
                    position: relative;
                    background-color: var(--color-background-white);
                    border-radius: var(--border-radius-lg);
                    box-shadow: var(--shadow-xl);
                    max-width: 90vw;
                    max-height: 90vh;
                    overflow: auto;
                    animation: modalSlideIn 0.3s ease-out;
                }
                
                .modal-close {
                    position: absolute;
                    top: var(--spacing-sm);
                    right: var(--spacing-sm);
                    background: none;
                    border: none;
                    font-size: var(--font-size-2xl);
                    cursor: pointer;
                    color: var(--color-text-light);
                    z-index: 1;
                    width: 2rem;
                    height: 2rem;
                    display: flex;
                    align-items: center;
                    justify-content: center;
                    border-radius: var(--border-radius-full);
                    transition: all var(--transition-fast);
                }
                
                .modal-close:hover {
                    background-color: var(--color-background-dark);
                    color: var(--color-text);
                }
                
                @keyframes modalSlideIn {
                    from {
                        opacity: 0;
                        transform: scale(0.9) translateY(-20px);
                    }
                    to {
                        opacity: 1;
                        transform: scale(1) translateY(0);
                    }
                }
                
                .modal-body-open {
                    overflow: hidden;
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * Observar cambios en modales
         */
        observeModalChanges() {
            const observer = new MutationObserver((mutations) => {
                mutations.forEach((mutation) => {
                    if (mutation.type === 'attributes' && mutation.attributeName === 'class') {
                        this.updateBodyClass();
                    }
                });
            });

            observer.observe(document.body, {
                attributes: true,
                attributeFilter: ['class']
            });
        },

        /**
         * Actualizar clase del body
         */
        updateBodyClass() {
            if (this.activeModals.size > 0) {
                document.body.classList.add('modal-body-open');
            } else {
                document.body.classList.remove('modal-body-open');
            }
        },

        /**
         * Abrir modal
         */
        open(modalId, options = {}) {
            const modal = document.getElementById(modalId);
            if (!modal) {
                console.error(`Modal con ID "${modalId}" no encontrado`);
                return false;
            }

            // Configurar z-index
            modal.style.zIndex = this.zIndex++;
            
            // Agregar a modales activos
            this.activeModals.add(modalId);
            
            // Mostrar modal
            modal.classList.add('active');
            
            // Configurar opciones
            if (options.closeOnBackdrop !== false) {
                modal.dataset.closeOnBackdrop = 'true';
            }
            
            // Enfocar primer elemento interactivo
            this.focusFirstElement(modal);
            
            // Emitir evento personalizado
            this.emitEvent('modal:opened', { modalId, modal });
            
            return true;
        },

        /**
         * Cerrar modal
         */
        close(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal || !this.activeModals.has(modalId)) {
                return false;
            }

            // Remover de modales activos
            this.activeModals.delete(modalId);
            
            // Ocultar modal
            modal.classList.remove('active');
            
            // Restaurar z-index
            modal.style.zIndex = '';
            
            // Emitir evento personalizado
            this.emitEvent('modal:closed', { modalId, modal });
            
            return true;
        },

        /**
         * Cerrar todos los modales
         */
        closeAll() {
            const modalsToClose = Array.from(this.activeModals);
            
            modalsToClose.forEach(modalId => {
                this.close(modalId);
            });
        },

        /**
         * Verificar si modal está abierto
         */
        isOpen(modalId) {
            return this.activeModals.has(modalId);
        },

        /**
         * Obtener modal activo más alto
         */
        getTopModal() {
            if (this.activeModals.size === 0) return null;
            
            let topModal = null;
            let topZIndex = 0;
            
            this.activeModals.forEach(modalId => {
                const modal = document.getElementById(modalId);
                const zIndex = parseInt(modal.style.zIndex) || 0;
                
                if (zIndex > topZIndex) {
                    topZIndex = zIndex;
                    topModal = modal;
                }
            });
            
            return topModal;
        },

        /**
         * Enfocar primer elemento interactivo
         */
        focusFirstElement(modal) {
            const focusableElements = modal.querySelectorAll(
                'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
            );
            
            if (focusableElements.length > 0) {
                focusableElements[0].focus();
            }
        },

        /**
         * Crear modal dinámicamente
         */
        create(options = {}) {
            const {
                id = `modal-${Date.now()}`,
                title = '',
                content = '',
                size = 'medium',
                closable = true
            } = options;

            const modal = document.createElement('div');
            modal.id = id;
            modal.className = 'modal';
            modal.setAttribute('data-modal', '');
            
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content modal-${size}">
                    ${title ? `<div class="modal-header"><h3>${title}</h3></div>` : ''}
                    <div class="modal-body">${content}</div>
                    ${closable ? '<button class="modal-close" aria-label="Cerrar modal">&times;</button>' : ''}
                </div>
            `;
            
            document.body.appendChild(modal);
            this.setupModal(modal);
            
            return modal;
        },

        /**
         * Eliminar modal
         */
        destroy(modalId) {
            const modal = document.getElementById(modalId);
            if (!modal) return false;
            
            this.close(modalId);
            modal.remove();
            
            return true;
        },

        /**
         * Emitir evento personalizado
         */
        emitEvent(eventName, detail) {
            const event = new CustomEvent(eventName, { detail });
            document.dispatchEvent(event);
        }
    };

    return modals.init();
}
