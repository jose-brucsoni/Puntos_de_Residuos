/**
 * MÓDULO DE FORMULARIOS
 * Maneja la validación y envío de formularios
 * ========================================
 */

export function initForms() {
    const forms = {
        // Configuración
        config: {
            validationRules: {
                required: {
                    pattern: /.+/,
                    message: 'Este campo es obligatorio'
                },
                email: {
                    pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: 'Ingresa un email válido'
                },
                phone: {
                    pattern: /^[\d\s\-\+\(\)]+$/,
                    message: 'Ingresa un teléfono válido'
                },
                minLength: (min) => ({
                    pattern: new RegExp(`.{${min},}`),
                    message: `Mínimo ${min} caracteres`
                }),
                maxLength: (max) => ({
                    pattern: new RegExp(`^.{0,${max}}$`),
                    message: `Máximo ${max} caracteres`
                })
            }
        },

        // Estado
        forms: new Map(),

        /**
         * Inicializar formularios
         */
        init() {
            this.cacheForms();
            this.bindEvents();
            this.setupValidation();
            
            return this;
        },

        /**
         * Cachear formularios
         */
        cacheForms() {
            const formElements = document.querySelectorAll('form[data-validate]');
            
            formElements.forEach(form => {
                const formId = form.id || `form-${Date.now()}`;
                form.id = formId;
                
                this.forms.set(formId, {
                    element: form,
                    fields: this.getFormFields(form),
                    isValid: false,
                    isSubmitting: false
                });
            });
        },

        /**
         * Obtener campos del formulario
         */
        getFormFields(form) {
            const fields = [];
            const inputs = form.querySelectorAll('input, textarea, select');
            
            inputs.forEach(input => {
                if (input.name) {
                    fields.push({
                        element: input,
                        name: input.name,
                        type: input.type,
                        rules: this.getFieldRules(input),
                        isValid: true,
                        message: ''
                    });
                }
            });
            
            return fields;
        },

        /**
         * Obtener reglas de validación del campo
         */
        getFieldRules(input) {
            const rules = [];
            const attributes = input.attributes;
            
            // Reglas basadas en atributos HTML5
            if (input.hasAttribute('required')) {
                rules.push('required');
            }
            
            if (input.type === 'email') {
                rules.push('email');
            }
            
            if (input.type === 'tel') {
                rules.push('phone');
            }
            
            // Reglas personalizadas
            if (input.hasAttribute('data-min-length')) {
                const min = parseInt(input.getAttribute('data-min-length'));
                rules.push({ type: 'minLength', value: min });
            }
            
            if (input.hasAttribute('data-max-length')) {
                const max = parseInt(input.getAttribute('data-max-length'));
                rules.push({ type: 'maxLength', value: max });
            }
            
            return rules;
        },

        /**
         * Vincular eventos
         */
        bindEvents() {
            this.forms.forEach((formData, formId) => {
                const form = formData.element;
                
                // Envío del formulario
                form.addEventListener('submit', (event) => {
                    event.preventDefault();
                    this.handleSubmit(formId);
                });
                
                // Validación en tiempo real
                formData.fields.forEach(field => {
                    field.element.addEventListener('blur', () => {
                        this.validateField(formId, field.name);
                    });
                    
                    field.element.addEventListener('input', () => {
                        this.clearFieldError(field.element);
                    });
                });
            });
        },

        /**
         * Configurar validación
         */
        setupValidation() {
            // Agregar estilos de validación
            this.addValidationStyles();
        },

        /**
         * Agregar estilos de validación
         */
        addValidationStyles() {
            const style = document.createElement('style');
            style.textContent = `
                .field-error {
                    border-color: var(--color-error) !important;
                    box-shadow: 0 0 0 2px rgba(244, 67, 54, 0.2) !important;
                }
                
                .field-success {
                    border-color: var(--color-success) !important;
                    box-shadow: 0 0 0 2px rgba(76, 175, 80, 0.2) !important;
                }
                
                .error-message {
                    color: var(--color-error);
                    font-size: var(--font-size-sm);
                    margin-top: var(--spacing-xs);
                    display: block;
                }
                
                .form-loading {
                    opacity: 0.6;
                    pointer-events: none;
                }
            `;
            document.head.appendChild(style);
        },

        /**
         * Manejar envío del formulario
         */
        async handleSubmit(formId) {
            const formData = this.forms.get(formId);
            if (!formData) return;
            
            // Validar formulario completo
            const isValid = await this.validateForm(formId);
            if (!isValid) return;
            
            // Prevenir envío múltiple
            if (formData.isSubmitting) return;
            
            formData.isSubmitting = true;
            formData.element.classList.add('form-loading');
            
            try {
                // Obtener datos del formulario
                const data = this.getFormData(formData.element);
                
                // Enviar datos
                const result = await this.submitForm(formData.element.action, data);
                
                // Manejar respuesta
                this.handleSubmitSuccess(formId, result);
                
            } catch (error) {
                this.handleSubmitError(formId, error);
            } finally {
                formData.isSubmitting = false;
                formData.element.classList.remove('form-loading');
            }
        },

        /**
         * Validar formulario completo
         */
        async validateForm(formId) {
            const formData = this.forms.get(formId);
            if (!formData) return false;
            
            let isValid = true;
            
            for (const field of formData.fields) {
                const fieldValid = await this.validateField(formId, field.name);
                if (!fieldValid) {
                    isValid = false;
                }
            }
            
            formData.isValid = isValid;
            return isValid;
        },

        /**
         * Validar campo individual
         */
        async validateField(formId, fieldName) {
            const formData = this.forms.get(formId);
            if (!formData) return false;
            
            const field = formData.fields.find(f => f.name === fieldName);
            if (!field) return true;
            
            const value = field.element.value.trim();
            let isValid = true;
            let message = '';
            
            // Aplicar reglas de validación
            for (const rule of field.rules) {
                const validation = this.applyValidationRule(rule, value);
                if (!validation.isValid) {
                    isValid = false;
                    message = validation.message;
                    break;
                }
            }
            
            // Actualizar estado del campo
            field.isValid = isValid;
            field.message = message;
            
            // Actualizar UI
            this.updateFieldUI(field, isValid, message);
            
            return isValid;
        },

        /**
         * Aplicar regla de validación
         */
        applyValidationRule(rule, value) {
            if (typeof rule === 'string') {
                const ruleConfig = this.config.validationRules[rule];
                if (ruleConfig) {
                    return {
                        isValid: ruleConfig.pattern.test(value),
                        message: ruleConfig.message
                    };
                }
            } else if (typeof rule === 'object' && rule.type) {
                const ruleConfig = this.config.validationRules[rule.type](rule.value);
                return {
                    isValid: ruleConfig.pattern.test(value),
                    message: ruleConfig.message
                };
            }
            
            return { isValid: true, message: '' };
        },

        /**
         * Actualizar UI del campo
         */
        updateFieldUI(field, isValid, message) {
            const element = field.element;
            
            // Limpiar clases anteriores
            element.classList.remove('field-error', 'field-success');
            
            // Remover mensaje de error anterior
            const existingError = element.parentNode.querySelector('.error-message');
            if (existingError) {
                existingError.remove();
            }
            
            if (isValid) {
                element.classList.add('field-success');
            } else {
                element.classList.add('field-error');
                
                // Agregar mensaje de error
                const errorElement = document.createElement('span');
                errorElement.className = 'error-message';
                errorElement.textContent = message;
                element.parentNode.appendChild(errorElement);
            }
        },

        /**
         * Limpiar error del campo
         */
        clearFieldError(element) {
            element.classList.remove('field-error');
            const errorMessage = element.parentNode.querySelector('.error-message');
            if (errorMessage) {
                errorMessage.remove();
            }
        },

        /**
         * Obtener datos del formulario
         */
        getFormData(form) {
            const formData = new FormData(form);
            const data = {};
            
            for (const [key, value] of formData.entries()) {
                data[key] = value;
            }
            
            return data;
        },

        /**
         * Enviar formulario
         */
        async submitForm(action, data) {
            const response = await fetch(action, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data)
            });
            
            if (!response.ok) {
                throw new Error(`Error ${response.status}: ${response.statusText}`);
            }
            
            return await response.json();
        },

        /**
         * Manejar éxito del envío
         */
        handleSubmitSuccess(formId, result) {
            const formData = this.forms.get(formId);
            if (!formData) return;
            
            // Mostrar mensaje de éxito
            this.showMessage('Formulario enviado correctamente', 'success');
            
            // Limpiar formulario
            formData.element.reset();
            
            // Limpiar errores
            formData.fields.forEach(field => {
                this.clearFieldError(field.element);
            });
        },

        /**
         * Manejar error del envío
         */
        handleSubmitError(formId, error) {
            console.error('Error al enviar formulario:', error);
            this.showMessage('Error al enviar el formulario. Inténtalo de nuevo.', 'error');
        },

        /**
         * Mostrar mensaje
         */
        showMessage(message, type = 'info') {
            // Implementar sistema de notificaciones
            console.log(`[${type.toUpperCase()}] ${message}`);
        }
    };

    return forms.init();
}
