# Funcionamiento de `shuffle`

La función `shuffle(items)` mezcla aleatoriamente los elementos de una lista y devuelve la lista mezclada.

```js
function shuffle(items) {
  const shuffled = [...items];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}
```

## Paso a paso

1. `const shuffled = [...items]` crea una copia superficial del array. Así, la función no cambia el array original.
2. El bucle empieza por el último índice y avanza hacia el primero.
3. En cada paso, `Math.random()` y `Math.floor()` eligen un índice aleatorio `j` entre `0` e `i`, ambos incluidos.
4. La asignación `[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]` intercambia los elementos de esas dos posiciones.
5. Al terminar el bucle, se devuelve la copia mezclada.

Este método se conoce como **Fisher–Yates**. Cada posición se intercambia con una posición elegida entre las que todavía no se habían procesado, por lo que cada orden posible tiene la misma probabilidad si el generador aleatorio distribuye sus resultados uniformemente.

En el quiz se usa para seleccionar preguntas y para cambiar el orden de las respuestas, incluida la correcta.
