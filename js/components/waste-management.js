/**
 * MÓDULO DE GESTIÓN DE RESIDUOS
 * Funcionalidades específicas para el sistema de residuos del Distrito 11
 * ========================================
 */

export function initWasteManagement() {
    const wasteManagement = {
        // Configuración
        config: {
            apiUrl: '/api/waste-management',
            barrios: [
                { id: 'plan-3000', name: 'Plan 3000', schedule: ['Lunes', 'Miércoles', 'Viernes'] },
                { id: 'Calle-Junin-&-21-de-Mayo', name: 'Calle Junin & 21 de Mayo', schedule: ['Martes', 'Jueves'] },
                { id: 'villa-montes', name: 'Villa Montes', schedule: ['Lunes', 'Miércoles', 'Viernes'] },
                { id: 'Calle-Quijarro', name: 'Calle Quijarro', schedule: ['Martes', 'Jueves'] },
                { id: 'villa-san-antonio', name: 'Villa San Antonio', schedule: ['Lunes', 'Miércoles', 'Viernes'] }
            ],
            tiposReporte: [
                { id: 'recojo-no-realizado', name: 'Recojo no realizado', priority: 'high' },
                { id: 'contenedor-lleno', name: 'Contenedor lleno', priority: 'medium' },
                { id: 'microbasural', name: 'Microbasural', priority: 'high' },
                { id: 'residuos-peligrosos', name: 'Residuos peligrosos', priority: 'urgent' },
                { id: 'otro', name: 'Otro', priority: 'low' }
            ]
        },

        // Estado
        currentBarrio: null,
        reports: new Map(),
        notifications: [],

        /**
         * Inicializar módulo
         */
        init() {
            this.cacheElements();
            this.bindEvents();
            this.setupNotifications();
            this.loadUserPreferences();
            
            return this;
        },

        /**
         * Cachear elementos del DOM
         */
        cacheElements() {
            this.elements = {
                barrioSelect: document.getElementById('barrio'),
                tipoReporteSelect: document.getElementById('tipo-reporte'),
                reportForm: document.querySelector('form[data-validate]'),
                notificationContainer: document.querySelector('.notifications-container') || this.createNotificationContainer()
            };
        },

        /**
         * Vincular eventos
         */
        bindEvents() {
            // Cambio de barrio
            if (this.elements.barrioSelect) {
                this.elements.barrioSelect.addEventListener('change', (e) => {
                    this.handleBarrioChange(e.target.value);
                });
            }

            // Cambio de tipo de reporte
            if (this.elements.tipoReporteSelect) {
                this.elements.tipoReporteSelect.addEventListener('change', (e) => {
                    this.handleTipoReporteChange(e.target.value);
                });
            }

            // Envío de formulario
            if (this.elements.reportForm) {
                this.elements.reportForm.addEventListener('submit', (e) => {
                    this.handleReportSubmit(e);
                });
            }

            // Botones de acción rápida
            document.addEventListener('click', (e) => {
                if (e.target.matches('[data-action="report-waste"]')) {
                    this.openQuickReport(e.target.dataset.type);
                }
                
                if (e.target.matches('[data-action="check-schedule"]')) {
                    this.showSchedule();
                }
            });
        },

        /**
         * Manejar cambio de barrio
         */
        handleBarrioChange(barrioId) {
            this.currentBarrio = this.config.barrios.find(b => b.id === barrioId);
            
            if (this.currentBarrio) {
                this.updateScheduleInfo();
                this.updateLocationServices();
            }
        },

        /**
         * Manejar cambio de tipo de reporte
         */
        handleTipoReporteChange(tipoId) {
            const tipo = this.config.tiposReporte.find(t => t.id === tipoId);
            
            if (tipo) {
                this.updatePriorityIndicator(tipo.priority);
                this.updateFormFields(tipo);
            }
        },

        /**
         * Actualizar información de horarios
         */
        updateScheduleInfo() {
            if (!this.currentBarrio) return;

            const scheduleInfo = document.querySelector('.schedule-info');
            if (scheduleInfo) {
                const days = this.currentBarrio.schedule.join(', ');
                scheduleInfo.innerHTML = `
                    <div class="schedule-card">
                        <h4>Horarios de Recolección</h4>
                        <p><strong>${this.currentBarrio.name}</strong></p>
                        <p>Días: ${days}</p>
                        <p>Horario: 6:00 - 12:00 AM</p>
                    </div>
                `;
            }
        },

        /**
         * Actualizar servicios de ubicación
         */
        updateLocationServices() {
            if (!this.currentBarrio) return;

            // Simular obtención de ubicación GPS
            if (navigator.geolocation) {
                navigator.geolocation.getCurrentPosition(
                    (position) => {
                        this.handleLocationSuccess(position);
                    },
                    (error) => {
                        this.handleLocationError(error);
                    }
                );
            }
        },

        /**
         * Manejar éxito de ubicación
         */
        handleLocationSuccess(position) {
            const { latitude, longitude } = position.coords;
            
            // Simular verificación de proximidad al barrio
            const isInBarrio = this.verifyLocationInBarrio(latitude, longitude);
            
            if (isInBarrio) {
                this.showNotification('Ubicación verificada en el barrio correcto', 'success');
            } else {
                this.showNotification('Verifica que estés en el barrio correcto', 'warning');
            }
        },

        /**
         * Manejar error de ubicación
         */
        handleLocationError(error) {
            console.warn('Error de geolocalización:', error);
            this.showNotification('No se pudo obtener la ubicación. Verifica manualmente el barrio.', 'warning');
        },

        /**
         * Verificar ubicación en barrio
         */
        verifyLocationInBarrio(lat, lng) {
            // Simulación - en un caso real se usarían coordenadas reales de los barrios
            return true;
        },

        /**
         * Actualizar indicador de prioridad
         */
        updatePriorityIndicator(priority) {
            const priorityIndicator = document.querySelector('.priority-indicator');
            if (!priorityIndicator) return;

            const priorityClasses = {
                urgent: 'priority-urgent',
                high: 'priority-high',
                medium: 'priority-medium',
                low: 'priority-low'
            };

            // Limpiar clases anteriores
            Object.values(priorityClasses).forEach(cls => {
                priorityIndicator.classList.remove(cls);
            });

            // Agregar nueva clase
            priorityIndicator.classList.add(priorityClasses[priority] || 'priority-low');
        },

        /**
         * Actualizar campos del formulario según tipo
         */
        updateFormFields(tipo) {
            const messageField = document.querySelector('textarea[name="message"]');
            if (!messageField) return;

            const placeholders = {
                'recojo-no-realizado': 'Describe cuándo se debía realizar el recojo y qué residuos quedaron sin recoger...',
                'contenedor-lleno': 'Indica la ubicación exacta del contenedor y desde cuándo está lleno...',
                'microbasural': 'Describe el tipo de residuos, tamaño del basural y ubicación exacta...',
                'residuos-peligrosos': 'Especifica el tipo de residuos peligrosos y medidas de seguridad necesarias...',
                'otro': 'Describe detalladamente el problema o situación...'
            };

            messageField.placeholder = placeholders[tipo.id] || placeholders['otro'];
        },

        /**
         * Manejar envío de reporte
         */
        async handleReportSubmit(event) {
            event.preventDefault();
            
            const formData = new FormData(event.target);
            const reportData = Object.fromEntries(formData.entries());
            
            // Agregar metadatos
            reportData.timestamp = new Date().toISOString();
            reportData.id = this.generateReportId();
            reportData.status = 'pending';
            
            try {
                // Simular envío al servidor
                await this.submitReport(reportData);
                
                // Guardar localmente
                this.reports.set(reportData.id, reportData);
                
                // Mostrar confirmación
                this.showReportConfirmation(reportData);
                
                // Limpiar formulario
                event.target.reset();
                
            } catch (error) {
                console.error('Error al enviar reporte:', error);
                this.showNotification('Error al enviar el reporte. Inténtalo de nuevo.', 'error');
            }
        },

        /**
         * Enviar reporte al servidor
         */
        async submitReport(reportData) {
            // Simulación de envío - en un caso real se haría una petición HTTP
            return new Promise((resolve) => {
                setTimeout(() => {
                    console.log('Reporte enviado:', reportData);
                    resolve({ success: true, reportId: reportData.id });
                }, 1000);
            });
        },

        /**
         * Mostrar confirmación de reporte
         */
        showReportConfirmation(reportData) {
            const tipo = this.config.tiposReporte.find(t => t.id === reportData.tipoReporte);
            const barrio = this.config.barrios.find(b => b.id === reportData.barrio);
            
            this.showNotification(
                `Reporte enviado correctamente. ID: ${reportData.id}. Tipo: ${tipo?.name || 'N/A'}. Barrio: ${barrio?.name || 'N/A'}`,
                'success'
            );
        },

        /**
         * Abrir reporte rápido
         */
        openQuickReport(type) {
            const modal = document.getElementById('contact-modal');
            if (modal) {
                // Pre-seleccionar tipo de reporte
                const tipoSelect = modal.querySelector('select[name="tipo-reporte"]');
                if (tipoSelect) {
                    tipoSelect.value = type;
                    this.handleTipoReporteChange(type);
                }
                
                // Abrir modal
                if (window.App && window.App.getModule('modals')) {
                    window.App.getModule('modals').open('contact-modal');
                }
            }
        },

        /**
         * Mostrar horarios
         */
        showSchedule() {
            const scheduleModal = this.createScheduleModal();
            document.body.appendChild(scheduleModal);
            
            if (window.App && window.App.getModule('modals')) {
                window.App.getModule('modals').open(scheduleModal.id);
            }
        },

        /**
         * Crear modal de horarios
         */
        createScheduleModal() {
            const modal = document.createElement('div');
            modal.id = 'schedule-modal';
            modal.className = 'modal';
            modal.setAttribute('data-modal', '');
            
            const scheduleHTML = this.config.barrios.map(barrio => `
                <div class="barrio-schedule-item">
                    <h4>${barrio.name}</h4>
                    <p>Días: ${barrio.schedule.join(', ')}</p>
                    <p>Horario: 6:00 - 12:00 AM</p>
                </div>
            `).join('');
            
            modal.innerHTML = `
                <div class="modal-backdrop"></div>
                <div class="modal-content">
                    <button class="modal-close" aria-label="Cerrar modal">&times;</button>
                    <div class="modal-header">
                        <h3>Horarios de Recolección por Barrio</h3>
                    </div>
                    <div class="modal-body">
                        ${scheduleHTML}
                    </div>
                </div>
            `;
            
            return modal;
        },

        /**
         * Configurar notificaciones
         */
        setupNotifications() {
            if (!this.elements.notificationContainer) {
                this.elements.notificationContainer = this.createNotificationContainer();
            }
        },

        /**
         * Crear contenedor de notificaciones
         */
        createNotificationContainer() {
            const container = document.createElement('div');
            container.className = 'notifications-container';
            container.style.cssText = `
                position: fixed;
                top: 20px;
                right: 20px;
                z-index: 10000;
                max-width: 400px;
            `;
            document.body.appendChild(container);
            return container;
        },

        /**
         * Mostrar notificación
         */
        showNotification(message, type = 'info', duration = 5000) {
            const notification = document.createElement('div');
            notification.className = `notification notification-${type}`;
            notification.style.cssText = `
                background: ${this.getNotificationColor(type)};
                color: white;
                padding: 12px 16px;
                margin-bottom: 8px;
                border-radius: 8px;
                box-shadow: 0 4px 12px rgba(0,0,0,0.15);
                animation: slideInRight 0.3s ease-out;
                position: relative;
            `;
            
            notification.innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: center;">
                    <span>${message}</span>
                    <button onclick="this.parentElement.parentElement.remove()" style="background: none; border: none; color: white; cursor: pointer; font-size: 18px;">&times;</button>
                </div>
            `;
            
            this.elements.notificationContainer.appendChild(notification);
            
            // Auto-remover después de la duración especificada
            setTimeout(() => {
                if (notification.parentNode) {
                    notification.style.animation = 'slideOutRight 0.3s ease-in';
                    setTimeout(() => {
                        if (notification.parentNode) {
                            notification.remove();
                        }
                    }, 300);
                }
            }, duration);
        },

        /**
         * Obtener color de notificación
         */
        getNotificationColor(type) {
            const colors = {
                success: '#4CAF50',
                error: '#F44336',
                warning: '#FF9800',
                info: '#2196F3'
            };
            return colors[type] || colors.info;
        },

        /**
         * Cargar preferencias del usuario
         */
        loadUserPreferences() {
            const savedBarrio = localStorage.getItem('waste-management-barrio');
            if (savedBarrio && this.elements.barrioSelect) {
                this.elements.barrioSelect.value = savedBarrio;
                this.handleBarrioChange(savedBarrio);
            }
        },

        /**
         * Guardar preferencias del usuario
         */
        saveUserPreferences() {
            if (this.currentBarrio) {
                localStorage.setItem('waste-management-barrio', this.currentBarrio.id);
            }
        },

        /**
         * Generar ID de reporte
         */
        generateReportId() {
            return `RPT-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        },

        /**
         * Obtener reportes del usuario
         */
        getUserReports() {
            return Array.from(this.reports.values());
        },

        /**
         * Obtener estadísticas
         */
        getStatistics() {
            const reports = this.getUserReports();
            const stats = {
                total: reports.length,
                byType: {},
                byBarrio: {},
                byStatus: {}
            };
            
            reports.forEach(report => {
                // Por tipo
                stats.byType[report.tipoReporte] = (stats.byType[report.tipoReporte] || 0) + 1;
                
                // Por barrio
                stats.byBarrio[report.barrio] = (stats.byBarrio[report.barrio] || 0) + 1;
                
                // Por estado
                stats.byStatus[report.status] = (stats.byStatus[report.status] || 0) + 1;
            });
            
            return stats;
        }
    };

    return wasteManagement.init();
}
