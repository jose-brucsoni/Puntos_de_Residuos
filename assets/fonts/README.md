# Carpeta de Fuentes

Esta carpeta contiene las fuentes personalizadas utilizadas en el proyecto.

## Estructura recomendada:

```
fonts/
├── primary/         # Fuente principal del proyecto
├── secondary/       # Fuente secundaria
├── icons/          # Fuentes de iconos (Font Awesome, etc.)
└── fallbacks/      # Fuentes de respaldo
```

## Formatos soportados:
- **WOFF2** (recomendado - mejor compresión)
- **WOFF** (compatible con navegadores más antiguos)
- **TTF** (formato estándar)
- **EOT** (solo para IE)

## Implementación en CSS:

```css
@font-face {
    font-family: 'MiFuente';
    src: url('./fonts/primary/mi-fuente.woff2') format('woff2'),
         url('./fonts/primary/mi-fuente.woff') format('woff'),
         url('./fonts/primary/mi-fuente.ttf') format('truetype');
    font-weight: normal;
    font-style: normal;
    font-display: swap; /* Mejora el rendimiento */
}
```

## Mejores prácticas:
- Usar `font-display: swap` para mejorar el rendimiento
- Incluir fuentes de respaldo en la pila de fuentes
- Optimizar el peso de las fuentes
- Considerar usar Google Fonts para fuentes web populares
- Preload de fuentes críticas en el HTML

## Fuentes recomendadas:
- **Sans-serif**: Inter, Roboto, Open Sans, Lato
- **Serif**: Playfair Display, Merriweather, Source Serif Pro
- **Monospace**: Fira Code, Source Code Pro, JetBrains Mono
