flowchart TD

A([Usuari])

A --> B{Tria una resposta per cada pregunta}

B --> C[Acerta les 2 preguntes]

C --> E(Pop up de celebració. Mostra 2 preguntes mes)

E --> G{Tria una resposta per cada pregunta}

G --> H[Acerta les 2 preguntes]

H --> Z(PROBA SUPERADA)

G --> S[Falla en una o mes respostes]

S --> F

B --> D[Falla en una o mes respostes]

D --> F(Pop up de 'derrota', boto de nou intent)
```