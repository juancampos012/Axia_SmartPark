# Axia SmartPark — Sistema de Diseño

## Paleta de Colores

La identidad visual de Axia SmartPark se construye sobre una paleta sobria y profesional, reforzando los valores de tecnología, confianza y modernidad.

```ts
colors: {
  // Paleta de colores AXIA SmartPark
  axia: {
    black: '#0F1115',     // Negro principal (elegancia, autoridad)
    darkGray: '#2C2C2C',  // Gris oscuro (fondo, sobriedad)
    gray: '#8C8C8C',      // Gris medio (textos secundarios)
    white: '#FFFFFF',     // Blanco (espacio, claridad)
    green: '#006B54',     // Verde principal (innovación, eco-friendly)
    purple: '#780BB7',    // Púrpura principal (creatividad, premium)
    blue: '#093774',      // Azul principal (tecnología, confianza)
  },
  
  // Estados y alertas
  success: '#268D65',
  warning: '#f59e0b',
  error: '#dc2626',
  info: '#093774',
  
  // Estados específicos para parking
  parking: {
    available: '#268D65', // Disponible (verde)
    occupied: '#dc2626',  // Ocupado (rojo)
    reserved: '#f59e0b',  // Reservado (amarillo)
    disabled: '#8C8C8C',  // Inhabilitado (gris)
  }
}
```

## Triángulo Cromático

La paleta sigue un  triángulo cromático equilibrado , combinando:

1. **Base neutra (Black, White, Grays):**
   * Fondea la interfaz con elegancia y sobriedad.
   * Garantiza jerarquía y legibilidad.
2. **Colores principales (Green, Blue, Purple):**
   * **Verde** → sostenibilidad, disponibilidad y carácter “smart”.
   * **Azul** → seguridad y confianza tecnológica.
   * **Púrpura** → diferenciación y carácter premium.
3. **Colores de acción (Success, Error, Warning):**
   * Contrastan fuertemente para reforzar la semántica de cada estado.
   * Facilitan la asociación rápida por parte del usuario.

# Tipografía

```ts
fontFamily: {
  primary: ['Inter', 'sans-serif'],
  secondary: ['Poppins', 'sans-serif'],
}
```

## Inter (Primary):

* Óptima para pantallas.
* Excelente legibilidad en tamaños pequeños.
* Transmite profesionalismo y neutralidad.

## Poppins (Secondary):

* Geométrica, moderna y cercana.
* Ideal para títulos, headers y elementos destacados.
* Aporta personalidad sin perder elegancia.

## Uso

* **Títulos:** Poppins Bold
* **Subtítulos:** Poppins Medium
* **Texto cuerpo:** Inter Regular
* **Botones:** Inter SemiBold

# Aplicación en la UI

* **Fondo principal:** `axia.black` o `axia.darkGray`.
* **Texto primario:** `axia.white` o `axia.black`.
* **Botones primarios:** `axia.green` y `axia.blue`.
* **Botones secundarios:** `axia.purple`.
* **Alertas/estados:** `success`, `error`, `warning`, `info`

# Identidad Visual

La marca Axia SmartPark integra:

* **Colores:** que transmiten confianza, modernidad y eco-responsabilidad.
* **Tipografía:** clara, legible y profesional.
* **Espaciado:** pensado para escalabilidad en móvil y web.

El resultado es una  interfaz intuitiva, moderna y premium , alineada con la misión de  Axia : hacer que la movilidad y el parqueo sean más inteligentes y eficientes.
