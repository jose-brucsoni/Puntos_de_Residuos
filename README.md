# Puntos de Residuos

Sistema de gestión de puntos de residuos desarrollado exclusivamente con **HTML**, **CSS** y **JavaScript** puro.

## 📋 Descripción

Este proyecto es una aplicación web para la gestión eficiente de puntos de residuos, que permite a los usuarios localizar, gestionar y optimizar la recolección de residuos en sus comunidades. El sistema incluye funcionalidades de geolocalización, analytics y notificaciones.

## 🚀 Características

- **Geolocalización**: Localiza puntos de residuos cercanos
- **Analytics**: Estadísticas detalladas de gestión
- **Notificaciones**: Alertas en tiempo real
- **Responsive Design**: Adaptable a todos los dispositivos
- **Accesibilidad**: Cumple estándares de accesibilidad web
- **Performance**: Optimizado para velocidad y eficiencia

## 🛠️ Tecnologías Utilizadas

- **HTML5**: Estructura semántica y accesible
- **CSS3**: Estilos modernos con variables CSS y Grid/Flexbox
- **JavaScript ES6+**: Funcionalidades interactivas con módulos
- **Sin dependencias**: Código puro sin frameworks externos

## 📁 Estructura del Proyecto

```
puntos-de-residuos/
├── css/                    # Estilos CSS organizados
│   ├── main.css           # Archivo principal de estilos
│   ├── components/        # Estilos de componentes
│   ├── pages/            # Estilos específicos de páginas
│   └── utilities/        # Utilidades y variables CSS
├── js/                    # JavaScript modular
│   ├── main.js           # Archivo principal de JavaScript
│   ├── components/       # Módulos de componentes
│   └── utils/           # Utilidades y helpers
├── assets/               # Recursos estáticos
│   ├── images/          # Imágenes del proyecto
│   ├── fonts/           # Fuentes personalizadas
│   └── icons/           # Iconos SVG
├── pages/               # Páginas HTML
│   ├── about.html       # Página Acerca de
│   └── contact.html     # Página de Contacto
├── docs/               # Documentación
├── index.html          # Página principal
├── package.json        # Configuración del proyecto
└── README.md          # Este archivo
```

## 🚀 Instalación y Uso

### Prerrequisitos

- Navegador web moderno (Chrome, Firefox, Safari, Edge)
- Servidor web local (opcional para desarrollo)

### Instalación

1. **Clonar el repositorio:**
   ```bash
   git clone https://github.com/jose-brucsoni/PuntosDeResiduos.git
   cd puntos-de-residuos
   ```

2. **Instalar dependencias de desarrollo (opcional):**
   ```bash
   npm install
   ```

3. **Ejecutar el proyecto:**
   
   **Opción 1 - Con npm:**
   ```bash
   npm start
   ```
   
   **Opción 2 - Servidor simple:**
   ```bash
   npm run serve
   ```
   
   **Opción 3 - Abrir directamente:**
   Abrir `index.html` en tu navegador

### Scripts Disponibles

- `npm start` - Inicia servidor de desarrollo con live-reload
- `npm run dev` - Modo desarrollo con watch
- `npm run build` - Proceso de build (para futuras mejoras)
- `npm run lint:css` - Linter para CSS
- `npm run lint:js` - Linter para JavaScript
- `npm run format` - Formatear código con Prettier
- `npm run validate:html` - Validar HTML
- `npm run optimize:images` - Optimizar imágenes

## 🎨 Sistema de Diseño

### Variables CSS

El proyecto utiliza un sistema de variables CSS para mantener consistencia:

```css
:root {
  --color-primary: #2E7D32;
  --color-secondary: #FF6F00;
  --font-primary: 'Inter', sans-serif;
  --spacing-md: 1rem;
  /* ... más variables */
}
```

### Componentes

- **Botones**: Diferentes variantes y tamaños
- **Formularios**: Validación en tiempo real
- **Modales**: Sistema de modales accesible
- **Navegación**: Menú responsive
- **Cards**: Componentes de contenido

## 📱 Responsive Design

El proyecto está optimizado para:

- **Mobile**: 320px - 767px
- **Tablet**: 768px - 1023px
- **Desktop**: 1024px+

## ♿ Accesibilidad

- Navegación por teclado
- Etiquetas ARIA apropiadas
- Contraste de colores WCAG AA
- Texto alternativo en imágenes
- Estructura semántica HTML

## 🧪 Testing

```bash
# Validar HTML
npm run validate:html

# Linter CSS
npm run lint:css

# Linter JavaScript
npm run lint:js
```

## 📦 Optimización

### Imágenes
- Formato WebP para mejor rendimiento
- Lazy loading implementado
- Múltiples tamaños para responsive

### CSS
- Variables CSS para consistencia
- Minificación en producción
- Critical CSS inline

### JavaScript
- Módulos ES6 para organización
- Lazy loading de componentes
- Debounce/throttle para performance

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 👥 Equipo

- **Desarrollador Principal**: Jose Carlo Suarez Brucsoni
- **Diseño UX/UI**: Jose Carlo Suarez Brucsoni
- **Testing**: Jose Carlo Suarez Brucsoni

## 📞 Contacto

- **Email**: josebrucsoni@outlook.com
- **Website**: https://jose-brucsoni.github.io/Puntos_de_Residuos/
- **GitHub**: https://jose-brucsoni.github.io/Puntos_de_Residuos/

## 🙏 Agradecimientos

- Comunidad de desarrolladores web
- Contribuidores de código abierto
- Usuarios que proporcionan feedback

---

**Desarrollado con ❤️ para un mundo más sostenible**