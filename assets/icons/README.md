# Carpeta de Iconos

Esta carpeta contiene los iconos utilizados en el proyecto.

## Estructura recomendada:

```
icons/
├── ui/             # Iconos de interfaz de usuario
├── social/         # Iconos de redes sociales
├── navigation/     # Iconos de navegación
├── actions/        # Iconos de acciones (editar, eliminar, etc.)
├── status/         # Iconos de estado (éxito, error, etc.)
└── custom/         # Iconos personalizados del proyecto
```

## Formatos recomendados:
- **SVG** (recomendado - escalable y ligero)
- **PNG** (para iconos complejos con muchos colores)
- **ICO** (para favicons)

## Implementación:

### Como archivos SVG individuales:
```html
<img src="./assets/icons/ui/home.svg" alt="Inicio" width="24" height="24">
```

### Como sprite SVG:
```html
<svg class="icon">
    <use href="./assets/icons/sprite.svg#home"></use>
</svg>
```

### Como fuentes de iconos:
```html
<i class="icon-home"></i>
```

## Herramientas recomendadas:
- **Feather Icons**: Iconos minimalistas y consistentes
- **Heroicons**: Iconos de Tailwind CSS
- **Lucide**: Fork de Feather Icons
- **Font Awesome**: Biblioteca completa de iconos
- **Material Icons**: Iconos de Google Material Design

## Mejores prácticas:
- Mantener consistencia en el estilo visual
- Usar tamaños estándar (16px, 24px, 32px, 48px)
- Optimizar SVGs eliminando metadatos innecesarios
- Usar colores CSS en lugar de colores hardcodeados en SVG
- Proporcionar versiones en diferentes estados (normal, hover, active)
