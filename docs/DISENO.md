# Guía de diseño (v0.3)

**Idea:** un fanzine pegado en la pared. Ropa libre, hecha a mano, sin brillo de tienda masiva. Contrastes fuertes, colores apagados y mucha claridad.

## Colores
| Nombre | Hex | Uso |
|---|---|---|
| Fondo | `#E6E6E0` | Fondo (modo oscuro: `#121211`) |
| Papel | `#F3F3EE` | Tarjetas |
| Tinta | `#0F0F0E` | Texto y bordes |
| Gris tinta | `#45453F` | Texto secundario |
| Óxido | `#A63A26` | Acento y acciones |
| Coral | `#D78D78`, Ocre `#D6B25C`, Musgo `#A3B38A`, Rosa `#D3ADA9`, Pizarra `#8FA8BC` | Parches de color |

Colores de prenda: Pizarra `#36556E`, Óxido `#A63A26`, Ocre `#C79A32`, Musgo `#4F6B3A`, Rosa polvo `#C9A3A0`, Ciruela `#5B3A5C`, Tinta `#171717`, Crudo `#DAD4C4`.

## Contraste (WCAG)
Texto principal sobre fondo y tarjetas: 13 a 17:1. Texto secundario: 6,8 a 9,9:1. Acentos: 5,1 a 7,5:1. Todo cumple AA (mínimo 4,5:1). Si cambias un color, vuelve a medirlo.

## Tipografías
- **Archivo** (condensada, muy gruesa): títulos.
- **Work Sans**: texto y botones.
- **Special Elite** (máquina de escribir): sellos y etiquetas pequeñas.

## Elementos de estilo
Bordes de 3 a 4 px, sombra dura desplazada sin difuminar, esquinas rectas, textura de papel, cinta adhesiva sobre tarjetas, sellos, cinta de texto en el inicio y un hilo con cuadros que une los pasos del pedido.

## Accesibilidad
- Foco de teclado visible.
- Modo claro y oscuro según el dispositivo.
- Sin animaciones si la persona activó "reducir movimiento".
- Botones de al menos 44 px de alto en celular.
- Sin scroll horizontal a 390 px de ancho.

## Prendas (v0.4)
Cada prenda se dibuja en SVG con sombra suave, volumen por degradado, pliegues difuminados y una textura según la tela. Los detalles (cuello, botones, bolsillos, bordado, parche y frase) cambian de posición y forma según el tipo de prenda. Los colores de contraste se eligen según la luminosidad del color base.
