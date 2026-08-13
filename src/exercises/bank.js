export const ALL_EXERCISES = [
  {
    id: 'ex-1',
    number: 1,
    title: 'Compra de Frutas en el Supermercado',
    category: 'Condicionales y Operadores',
    description: 'Un kilo de manzanas cuesta 4,000 pesos. Escribe un programa que pregunte cuántos kilos de manzanas va a comprar el cliente. Si el costo total es mayor a 20,000 pesos, se le aplica un descuento de 3,000 pesos. Muestra el precio final a pagar.',
    vars: 'kilos (Entero), costo_total (Entero), precio_final (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si costo_total > 20000',
    starterCode: `Algoritmo CompraFrutas

    

FinAlgoritmo`,
    testCases: [
      { inputs: [6], expected: ['21000', '21.000'], description: 'Caso con descuento (6 kilos -> 24000 - 3000 = 21000)' },
      { inputs: [5], expected: ['20000', '20.000'], description: 'Caso de borde sin descuento (5 kilos -> 20000)' },
      { inputs: [2], expected: ['8000', '8.000'], description: 'Caso menor sin descuento (2 kilos -> 8000)' },
      { inputs: [10], expected: ['37000', '37.000'], description: 'Caso mayor compra (10 kilos -> 40000 - 3000 = 37000)' },
      { inputs: [1], expected: ['4000', '4.000'], description: 'Caso mínimo 1 kilo (4000)' }
    ],
    solutions: [
      `Algoritmo CompraFrutas
    Definir kilos Como Entero
    Definir costo_total Como Entero
    Definir precio_final Como Entero

    Escribir "Ingrese los kilos de manzanas:"
    Leer kilos

    costo_total <- kilos * 4000

    Si costo_total > 20000 Entonces
        precio_final <- costo_total - 3000
    Sino
        precio_final <- costo_total
    FinSi

    Escribir "Precio final:", precio_final
FinAlgoritmo`,
      `Algoritmo CompraFrutas
    Definir kilos, costo_total, precio_final Como Entero

    Leer kilos
    costo_total = kilos * 4000

    Si costo_total > 20000 Entonces
        precio_final = costo_total - 3000
    Sino
        precio_final = costo_total
    FinSi

    Escribir precio_final
FinAlgoritmo`,
      `Algoritmo CompraFrutas
    Definir kilos, costo_total, precio_final Como Entero

    Leer kilos
    costo_total <- 4000 * kilos

    Si costo_total > 20000 Entonces
        precio_final <- costo_total - 3000
    Sino
        precio_final <- costo_total
    FinSi

    Escribir "El total a pagar es: " precio_final
FinAlgoritmo`,
      `Proceso CompraFrutas
    definir kilos, costo_total, precio_final como entero
    leer kilos
    costo_total = kilos * 4000
    si costo_total > 20000 entonces
        precio_final = costo_total - 3000
    sino
        precio_final = costo_total
    finsi
    escribir precio_final
FinProceso`
    ]
  },
  {
    id: 'ex-2',
    number: 2,
    title: 'Cobro de Parqueadero de Centro Comercial',
    category: 'Condicionales y Operadores',
    description: 'Un parqueadero cobra 3,000 pesos por cada hora. Crea un programa que pregunte cuántas horas estuvo estacionado un carro. Si el tiempo es mayor a 4 horas, se le otorga un descuento de 2,000 pesos al total. Muestra el valor final a cobrar.',
    vars: 'horas (Entero), costo_total (Entero), precio_final (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si horas > 4',
    starterCode: `Algoritmo CobroParqueadero

    

FinAlgoritmo`,
    testCases: [
      { inputs: [5], expected: ['13000', '13.000'], description: 'Caso con descuento (5 horas -> 15000 - 2000 = 13000)' },
      { inputs: [4], expected: ['12000', '12.000'], description: 'Caso de borde sin descuento (4 horas -> 12000)' },
      { inputs: [2], expected: ['6000', '6.000'], description: 'Caso sin descuento (2 horas -> 6000)' },
      { inputs: [6], expected: ['16000', '16.000'], description: 'Caso 6 horas (18000 - 2000 = 16000)' },
      { inputs: [1], expected: ['3000', '3.000'], description: 'Caso 1 hora (3000)' }
    ],
    solutions: [
      `Algoritmo CobroParqueadero
    Definir horas Como Entero
    Definir costo_total Como Entero
    Definir precio_final Como Entero

    Escribir "Ingrese las horas:"
    Leer horas

    costo_total <- horas * 3000

    Si horas > 4 Entonces
        precio_final <- costo_total - 2000
    Sino
        precio_final <- costo_total
    FinSi

    Escribir "El valor final es:", precio_final
FinAlgoritmo`,
      `Algoritmo CobroParqueadero
    Definir horas, costo_total, precio_final Como Entero

    Leer horas
    costo_total = horas * 3000

    Si horas > 4 Entonces
        precio_final = costo_total - 2000
    Sino
        precio_final = costo_total
    FinSi

    Escribir precio_final
FinAlgoritmo`,
      `Algoritmo CobroParqueadero
    Definir horas, costo_total, precio_final Como Entero

    Leer horas
    costo_total <- 3000 * horas

    Si horas > 4 Entonces
        precio_final <- costo_total - 2000
    Sino
        precio_final <- costo_total
    FinSi

    Escribir "Total a pagar: " precio_final
FinAlgoritmo`,
      `Proceso CobroParqueadero
    definir horas, costo_total, precio_final como entero
    leer horas
    costo_total = horas * 3000
    si horas > 4 entonces
        precio_final = costo_total - 2000
    sino
        precio_final = costo_total
    finsi
    escribir precio_final
FinProceso`
    ]
  },
  {
    id: 'ex-3',
    number: 3,
    title: 'Ahorro para una Bicicleta',
    category: 'Sumas y Condicionales',
    description: 'Un estudiante tiene ahorrados 50,000 pesos y recibe dinero extra por ayudar en casa. Diseña un programa que pida el dinero extra recibido y lo sume al ahorro inicial. Si el dinero total es mayor o igual a 100,000 pesos, el programa debe mostrar "¡Ya puedes comprar la bicicleta!"; de lo contrario, muestra "Sigue ahorrando".',
    vars: 'ahorro_inicial (Entero), dinero_extra (Entero), total_ahorrado (Entero)',
    operatorUsed: '+',
    conditionalUsed: 'Si total_ahorrado >= 100000',
    starterCode: `Algoritmo AhorroBicicleta

    

FinAlgoritmo`,
    testCases: [
      { inputs: [60000], expected: ['comprar la bicicleta', 'comprar', '110000'], description: 'Caso supera 100k (50k + 60k = 110k)' },
      { inputs: [50000], expected: ['comprar la bicicleta', 'comprar', '100000'], description: 'Caso borde justo 100k (50k + 50k = 100k)' },
      { inputs: [20000], expected: ['Sigue ahorrando', 'ahorrando', '70000'], description: 'Caso no alcanza (50k + 20k = 70k)' },
      { inputs: [0], expected: ['Sigue ahorrando', 'ahorrando', '50000'], description: 'Caso sin dinero extra (50k)' },
      { inputs: [100000], expected: ['comprar la bicicleta', 'comprar', '150000'], description: 'Caso dinero extra alto (150k)' }
    ],
    solutions: [
      `Algoritmo AhorroBicicleta
    Definir ahorro_inicial Como Entero
    Definir dinero_extra Como Entero
    Definir total_ahorrado Como Entero

    ahorro_inicial <- 50000
    Leer dinero_extra
    total_ahorrado <- ahorro_inicial + dinero_extra

    Si total_ahorrado >= 100000 Entonces
        Escribir "¡Ya puedes comprar la bicicleta!"
    Sino
        Escribir "Sigue ahorrando"
    FinSi
FinAlgoritmo`,
      `Algoritmo AhorroBicicleta
    Definir ahorro_inicial, dinero_extra, total_ahorrado Como Entero

    ahorro_inicial = 50000
    Escribir "Dinero extra:"
    Leer dinero_extra
    total_ahorrado = dinero_extra + ahorro_inicial

    Si total_ahorrado >= 100000 Entonces
        Escribir "¡Ya puedes comprar la bicicleta!"
    Sino
        Escribir "Sigue ahorrando"
    FinSi
FinAlgoritmo`,
      `Proceso AhorroBicicleta
    definir ahorro_inicial, dinero_extra, total_ahorrado como entero
    ahorro_inicial = 50000
    leer dinero_extra
    total_ahorrado = ahorro_inicial + dinero_extra
    si total_ahorrado >= 100000 entonces
        escribir "¡Ya puedes comprar la bicicleta!"
    sino
        escribir "Sigue ahorrando"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-4',
    number: 4,
    title: 'Control de Asistencia a Entrenamientos',
    category: 'Restas y Condicionales',
    description: 'Un equipo de fútbol realiza 20 entrenamientos en el mes. Crea un programa que pida cuántos días asistió un jugador. Calcula las ausencias restando asistencias a 20. Si asistió a 15 o más entrenamientos, muestra "Convocado al partido del sábado"; de lo contrario, muestra "Debes entrenar más para ser convocado".',
    vars: 'asistencias (Entero), ausencias (Entero)',
    operatorUsed: '-',
    conditionalUsed: 'Si asistencias >= 15',
    starterCode: `Algoritmo AsistenciaEntrenamiento

    

FinAlgoritmo`,
    testCases: [
      { inputs: [18], expected: ['Convocado', 'convocado'], description: 'Asistencia alta (18 días)' },
      { inputs: [15], expected: ['Convocado', 'convocado'], description: 'Caso borde justo (15 días)' },
      { inputs: [12], expected: ['entrenar más', 'entrenar', 'Debes entrenar'], description: 'Asistencia insuficiente (12 días)' },
      { inputs: [5], expected: ['entrenar más', 'entrenar', 'Debes entrenar'], description: 'Asistencia muy baja (5 días)' },
      { inputs: [20], expected: ['Convocado', 'convocado'], description: 'Asistencia perfecta 20 días' }
    ],
    solutions: [
      `Algoritmo AsistenciaEntrenamiento
    Definir asistencias Como Entero
    Definir ausencias Como Entero

    Leer asistencias
    ausencias <- 20 - asistencias

    Si asistencias >= 15 Entonces
        Escribir "Convocado al partido del sábado"
    Sino
        Escribir "Debes entrenar más para ser convocado"
    FinSi
FinAlgoritmo`,
      `Algoritmo AsistenciaEntrenamiento
    Definir asistencias, ausencias Como Entero

    Escribir "Días asistidos:"
    Leer asistencias
    ausencias = 20 - asistencias

    Si asistencias >= 15 Entonces
        Escribir "Convocado al partido del sábado"
    Sino
        Escribir "Debes entrenar más para ser convocado"
    FinSi
FinAlgoritmo`,
      `Proceso AsistenciaEntrenamiento
    definir asistencias, ausencias como entero
    leer asistencias
    ausencias = 20 - asistencias
    si asistencias >= 15 entonces
        escribir "Convocado al partido del sábado"
    sino
        escribir "Debes entrenar más para ser convocado"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-5',
    number: 5,
    title: 'Saldo Disponible en la Tarjeta de la Cafetería',
    category: 'Restas y Condicionales',
    description: 'Un estudiante tiene 15,000 pesos en su tarjeta escolar para la cafetería. Crea un programa que pregunte cuánto dinero gastó en su almuerzo. Calcula el saldo restante restando el gasto del almuerzo a los 15,000 pesos iniciales. Si el saldo restante es mayor o igual a 5,000 pesos, muestra "Saldo suficiente para la semana"; de lo contrario, muestra "Debes recargar tu tarjeta".',
    vars: 'dinero_inicial (Entero), gasto_almuerzo (Entero), saldo_restante (Entero)',
    operatorUsed: '-',
    conditionalUsed: 'Si saldo_restante >= 5000',
    starterCode: `Algoritmo SaldoCafeteria

    

FinAlgoritmo`,
    testCases: [
      { inputs: [8000], expected: ['7000', 'suficiente', 'Saldo suficiente'], description: 'Gastó 8k (Saldo 7k -> Saldo suficiente)' },
      { inputs: [10000], expected: ['5000', 'suficiente', 'Saldo suficiente'], description: 'Gastó 10k (Saldo 5k -> Saldo suficiente)' },
      { inputs: [12000], expected: ['3000', 'recargar', 'Debes recargar'], description: 'Gastó 12k (Saldo 3k -> Debes recargar)' },
      { inputs: [15000], expected: ['0', 'recargar', 'Debes recargar'], description: 'Gastó 15k (Saldo 0 -> Debes recargar)' },
      { inputs: [2000], expected: ['13000', 'suficiente', 'Saldo suficiente'], description: 'Gastó 2k (Saldo 13k -> Saldo suficiente)' }
    ],
    solutions: [
      `Algoritmo SaldoCafeteria
    Definir dinero_inicial Como Entero
    Definir gasto_almuerzo Como Entero
    Definir saldo_restante Como Entero

    dinero_inicial <- 15000
    Leer gasto_almuerzo
    saldo_restante <- dinero_inicial - gasto_almuerzo

    Si saldo_restante >= 5000 Entonces
        Escribir "Saldo suficiente para la semana"
    Sino
        Escribir "Debes recargar tu tarjeta"
    FinSi
FinAlgoritmo`,
      `Algoritmo SaldoCafeteria
    Definir dinero_inicial, gasto_almuerzo, saldo_restante Como Entero

    dinero_inicial = 15000
    Escribir "Gasto del almuerzo:"
    Leer gasto_almuerzo
    saldo_restante = dinero_inicial - gasto_almuerzo

    Si saldo_restante >= 5000 Entonces
        Escribir "Saldo suficiente para la semana"
    Sino
        Escribir "Debes recargar tu tarjeta"
    FinSi
FinAlgoritmo`,
      `Proceso SaldoCafeteria
    definir dinero_inicial, gasto_almuerzo, saldo_restante como entero
    dinero_inicial = 15000
    leer gasto_almuerzo
    saldo_restante = dinero_inicial - gasto_almuerzo
    si saldo_restante >= 5000 entonces
        escribir "Saldo suficiente para la semana"
    sino
        escribir "Debes recargar tu tarjeta"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-6',
    number: 6,
    title: 'Puntos de Regalo por Compras',
    category: 'Multiplicación y Condicionales',
    description: 'Una tienda regala 10 puntos por cada producto comprado. Diseña un programa que pida la cantidad de productos comprados y calcule el total de puntos multiplicando por 10. Si el total de puntos es mayor o igual a 50, muestra "¡Ganaste un premio en la tienda!"; de lo contrario, muestra "Sigue acumulando puntos".',
    vars: 'productos (Entero), total_puntos (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si total_puntos >= 50',
    starterCode: `Algoritmo PuntosRegalo

    

FinAlgoritmo`,
    testCases: [
      { inputs: [6], expected: ['60', 'premio', 'Ganaste'], description: 'Compró 6 productos (60 puntos -> Premio)' },
      { inputs: [5], expected: ['50', 'premio', 'Ganaste'], description: 'Caso borde 5 productos (50 puntos -> Premio)' },
      { inputs: [3], expected: ['30', 'acumulando', 'Sigue'], description: 'Compró 3 productos (30 puntos -> Sigue acumulando)' },
      { inputs: [1], expected: ['10', 'acumulando', 'Sigue'], description: 'Compró 1 producto (10 puntos)' },
      { inputs: [10], expected: ['100', 'premio', 'Ganaste'], description: 'Compró 10 productos (100 puntos -> Premio)' }
    ],
    solutions: [
      `Algoritmo PuntosRegalo
    Definir productos Como Entero
    Definir total_puntos Como Entero

    Leer productos
    total_puntos <- productos * 10

    Si total_puntos >= 50 Entonces
        Escribir "¡Ganaste un premio en la tienda!"
    Sino
        Escribir "Sigue acumulando puntos"
    FinSi
FinAlgoritmo`,
      `Algoritmo PuntosRegalo
    Definir productos, total_puntos Como Entero

    Escribir "Productos:"
    Leer productos
    total_puntos = 10 * productos

    Si total_puntos >= 50 Entonces
        Escribir "¡Ganaste un premio en la tienda!"
    Sino
        Escribir "Sigue acumulando puntos"
    FinSi
FinAlgoritmo`,
      `Proceso PuntosRegalo
    definir productos, total_puntos como entero
    leer productos
    total_puntos = productos * 10
    si total_puntos >= 50 entonces
        escribir "¡Ganaste un premio en la tienda!"
    sino
        escribir "Sigue acumulando puntos"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-7',
    number: 7,
    title: 'Entradas de Cine para la Familia',
    category: 'Operaciones y Condicionales',
    description: 'Una entrada de cine cuesta 12,000 pesos. Crea un programa que pregunte cuántas personas van a entrar. Calcula el costo total. Si la familia compra 4 o más entradas, se les descuentan 5,000 pesos. Muestra el precio final a pagar.',
    vars: 'cantidad_personas (Entero), costo_total (Entero), precio_final (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si cantidad_personas >= 4',
    starterCode: `Algoritmo EntradasCine

    

FinAlgoritmo`,
    testCases: [
      { inputs: [4], expected: ['43000', '43.000'], description: '4 entradas (48k - 5k = 43k)' },
      { inputs: [5], expected: ['55000', '55.000'], description: '5 entradas (60k - 5k = 55k)' },
      { inputs: [2], expected: ['24000', '24.000'], description: '2 entradas (24k sin descuento)' },
      { inputs: [1], expected: ['12000', '12.000'], description: '1 entrada (12k sin descuento)' },
      { inputs: [10], expected: ['115000', '115.000'], description: '10 entradas (120k - 5k = 115k)' }
    ],
    solutions: [
      `Algoritmo EntradasCine
    Definir cantidad_personas Como Entero
    Definir costo_total Como Entero
    Definir precio_final Como Entero

    Leer cantidad_personas
    costo_total <- cantidad_personas * 12000

    Si cantidad_personas >= 4 Entonces
        precio_final <- costo_total - 5000
    Sino
        precio_final <- costo_total
    FinSi

    Escribir "El precio final es:", precio_final
FinAlgoritmo`,
      `Algoritmo EntradasCine
    Definir cantidad_personas, costo_total, precio_final Como Entero

    Leer cantidad_personas
    costo_total = cantidad_personas * 12000

    Si cantidad_personas >= 4 Entonces
        precio_final = costo_total - 5000
    Sino
        precio_final = costo_total
    FinSi

    Escribir precio_final
FinAlgoritmo`,
      `Proceso EntradasCine
    definir cantidad_personas, costo_total, precio_final como entero
    leer cantidad_personas
    costo_total = 12000 * cantidad_personas
    si cantidad_personas >= 4 entonces
        precio_final = costo_total - 5000
    sino
        precio_final = costo_total
    finsi
    escribir precio_final
FinProceso`
    ]
  },
  {
    id: 'ex-8',
    number: 8,
    title: 'Consumo de Datos en el Celular',
    category: 'Restas y Condicionales',
    description: 'Un plan de celular incluye 1,000 Megabytes (MB) al mes. Diseña un programa que pida cuántos MB ha gastado el usuario. Resta ese consumo a los 1,000 MB iniciales para saber los MB restantes. Si le quedan menos de 100 MB, muestra "Alerta: Quedan pocos datos"; de lo contrario, muestra "Consumo normal".',
    vars: 'mb_gastados (Entero), mb_restantes (Entero)',
    operatorUsed: '-',
    conditionalUsed: 'Si mb_restantes < 100',
    starterCode: `Algoritmo ConsumoDatos

    

FinAlgoritmo`,
    testCases: [
      { inputs: [950], expected: ['50', 'Alerta', 'pocos datos'], description: 'Gastó 950 MB (Quedan 50 MB -> Alerta)' },
      { inputs: [905], expected: ['95', 'Alerta', 'pocos datos'], description: 'Gastó 905 MB (Quedan 95 MB -> Alerta)' },
      { inputs: [500], expected: ['500', 'normal', 'Consumo normal'], description: 'Gastó 500 MB (Quedan 500 MB -> Consumo normal)' },
      { inputs: [800], expected: ['200', 'normal', 'Consumo normal'], description: 'Gastó 800 MB (Quedan 200 MB -> Consumo normal)' },
      { inputs: [990], expected: ['10', 'Alerta', 'pocos datos'], description: 'Gastó 990 MB (Quedan 10 MB -> Alerta)' }
    ],
    solutions: [
      `Algoritmo ConsumoDatos
    Definir mb_gastados Como Entero
    Definir mb_restantes Como Entero

    Leer mb_gastados
    mb_restantes <- 1000 - mb_gastados

    Si mb_restantes < 100 Entonces
        Escribir "Alerta: Quedan pocos datos"
    Sino
        Escribir "Consumo normal"
    FinSi
FinAlgoritmo`,
      `Algoritmo ConsumoDatos
    Definir mb_gastados, mb_restantes Como Entero

    Escribir "MB gastados:"
    Leer mb_gastados
    mb_restantes = 1000 - mb_gastados

    Si mb_restantes < 100 Entonces
        Escribir "Alerta: Quedan pocos datos"
    Sino
        Escribir "Consumo normal"
    FinSi
FinAlgoritmo`,
      `Proceso ConsumoDatos
    definir mb_gastados, mb_restantes como entero
    leer mb_gastados
    mb_restantes = 1000 - mb_gastados
    si mb_restantes < 100 entonces
        escribir "Alerta: Quedan pocos datos"
    sino
        escribir "Consumo normal"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-9',
    number: 9,
    title: 'Pago de Factura del Agua',
    category: 'Multiplicación y Condicionales',
    description: 'Un hogar consume agua durante el mes y cada metro cúbico cuesta 2,000 pesos. Escribe un programa que solicite los metros cúbicos consumidos. Si el costo total supera los 40,000 pesos, muestra el mensaje "Aviso: Consumo de agua alto este mes"; de lo contrario, muestra "Consumo de agua moderado".',
    vars: 'metros_consumidos (Entero), valor_factura (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si valor_factura > 40000',
    starterCode: `Algoritmo FacturaAgua

    

FinAlgoritmo`,
    testCases: [
      { inputs: [25], expected: ['50000', 'alto', 'Consumo de agua alto'], description: 'Consumo 25 m3 (50k -> Alto)' },
      { inputs: [20], expected: ['40000', 'moderado', 'Consumo de agua moderado'], description: 'Caso borde 20 m3 (40k -> Moderado)' },
      { inputs: [15], expected: ['30000', 'moderado', 'Consumo de agua moderado'], description: 'Consumo 15 m3 (30k -> Moderado)' },
      { inputs: [30], expected: ['60000', 'alto', 'Consumo de agua alto'], description: 'Consumo 30 m3 (60k -> Alto)' },
      { inputs: [10], expected: ['20000', 'moderado', 'Consumo de agua moderado'], description: 'Consumo 10 m3 (20k -> Moderado)' }
    ],
    solutions: [
      `Algoritmo FacturaAgua
    Definir metros_consumidos Como Entero
    Definir valor_factura Como Entero

    Leer metros_consumidos
    valor_factura <- metros_consumidos * 2000

    Si valor_factura > 40000 Entonces
        Escribir "Aviso: Consumo de agua alto este mes"
    Sino
        Escribir "Consumo de agua moderado"
    FinSi
FinAlgoritmo`,
      `Algoritmo FacturaAgua
    Definir metros_consumidos, valor_factura Como Entero

    Leer metros_consumidos
    valor_factura = 2000 * metros_consumidos

    Si valor_factura > 40000 Entonces
        Escribir "Aviso: Consumo de agua alto este mes"
    Sino
        Escribir "Consumo de agua moderado"
    FinSi
FinAlgoritmo`,
      `Proceso FacturaAgua
    definir metros_consumidos, valor_factura como entero
    leer metros_consumidos
    valor_factura = metros_consumidos * 2000
    si valor_factura > 40000 entonces
        escribir "Aviso: Consumo de agua alto este mes"
    sino
        escribir "Consumo de agua moderado"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-10',
    number: 10,
    title: 'Promedio de Calificaciones Escolar',
    category: 'Promedio y Condicionales',
    description: 'Un estudiante recibe la nota de su Taller y de su Examen (en escala de 1 a 10). Diseña un programa que pida ambas notas, las sume y las divida entre 2 para calcular la nota final. Si la nota final es mayor o igual a 6, muestra "Materia aprobada"; de lo contrario, muestra "Debes presentar recuperación".',
    vars: 'nota_taller (Entero), nota_examen (Entero), nota_final (Real)',
    operatorUsed: '/',
    conditionalUsed: 'Si nota_final >= 6',
    starterCode: `Algoritmo PromedioEscolar

    

FinAlgoritmo`,
    testCases: [
      { inputs: [8, 6], expected: ['7', 'aprobada', 'Materia aprobada'], description: 'Notas 8 y 6 (Promedio 7 -> Aprobada)' },
      { inputs: [6, 6], expected: ['6', 'aprobada', 'Materia aprobada'], description: 'Caso borde 6 y 6 (Promedio 6 -> Aprobada)' },
      { inputs: [4, 4], expected: ['4', 'recuperación', 'recuperacion', 'Debes presentar'], description: 'Notas 4 y 4 (Promedio 4 -> Recuperación)' },
      { inputs: [10, 8], expected: ['9', 'aprobada', 'Materia aprobada'], description: 'Notas 10 y 8 (Promedio 9 -> Aprobada)' },
      { inputs: [2, 4], expected: ['3', 'recuperación', 'recuperacion', 'Debes presentar'], description: 'Notas 2 y 4 (Promedio 3 -> Recuperación)' }
    ],
    solutions: [
      `Algoritmo PromedioEscolar
    Definir nota_taller Como Entero
    Definir nota_examen Como Entero
    Definir nota_final Como Real

    Leer nota_taller
    Leer nota_examen
    nota_final <- (nota_taller + nota_examen) / 2

    Si nota_final >= 6 Entonces
        Escribir "Materia aprobada"
    Sino
        Escribir "Debes presentar recuperación"
    FinSi
FinAlgoritmo`,
      `Algoritmo PromedioEscolar
    Definir nota_taller, nota_examen Como Entero
    Definir nota_final Como Real

    Leer nota_taller
    Leer nota_examen
    nota_final = (nota_taller + nota_examen) / 2

    Si nota_final >= 6 Entonces
        Escribir "Materia aprobada"
    Sino
        Escribir "Debes presentar recuperación"
    FinSi
FinAlgoritmo`,
      `Proceso PromedioEscolar
    definir nota_taller, nota_examen como entero
    definir nota_final como real
    leer nota_taller, nota_examen
    nota_final = (nota_taller + nota_examen) / 2
    si nota_final >= 6 entonces
        escribir "Materia aprobada"
    sino
        escribir "Debes presentar recuperación"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-11',
    number: 11,
    title: 'Descuento en la Compra de Cuadernos',
    category: 'Multiplicación y Condicionales',
    description: 'Un cuaderno universitario cuesta 6,000 pesos. Diseña un programa que pida la cantidad de cuadernos a comprar y calcule el costo multiplicando la cantidad por 6,000. Si el costo supera los 30,000 pesos, se le descuentan 5,000 pesos al total. Muestra el valor final a pagar.',
    vars: 'cuadernos (Entero), costo_total (Entero), precio_final (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si costo_total > 30000',
    starterCode: `Algoritmo CompraCuadernos

    

FinAlgoritmo`,
    testCases: [
      { inputs: [6], expected: ['31000', '31.000'], description: '6 cuadernos (36k - 5k = 31k)' },
      { inputs: [5], expected: ['30000', '30.000'], description: 'Caso borde 5 cuadernos (30k sin descuento)' },
      { inputs: [4], expected: ['24000', '24.000'], description: '4 cuadernos (24k sin descuento)' },
      { inputs: [10], expected: ['55000', '55.000'], description: '10 cuadernos (60k - 5k = 55k)' },
      { inputs: [2], expected: ['12000', '12.000'], description: '2 cuadernos (12k sin descuento)' }
    ],
    solutions: [
      `Algoritmo CompraCuadernos
    Definir cuadernos Como Entero
    Definir costo_total Como Entero
    Definir precio_final Como Entero

    Leer cuadernos
    costo_total <- cuadernos * 6000

    Si costo_total > 30000 Entonces
        precio_final <- costo_total - 5000
    Sino
        precio_final <- costo_total
    FinSi

    Escribir "El valor final es:", precio_final
FinAlgoritmo`,
      `Algoritmo CompraCuadernos
    Definir cuadernos, costo_total, precio_final Como Entero

    Leer cuadernos
    costo_total = cuadernos * 6000

    Si costo_total > 30000 Entonces
        precio_final = costo_total - 5000
    Sino
        precio_final = costo_total
    FinSi

    Escribir precio_final
FinAlgoritmo`,
      `Proceso CompraCuadernos
    definir cuadernos, costo_total, precio_final como entero
    leer cuadernos
    costo_total = 6000 * cuadernos
    si costo_total > 30000 entonces
        precio_final = costo_total - 5000
    sino
        precio_final = costo_total
    finsi
    escribir precio_final
FinProceso`
    ]
  },
  {
    id: 'ex-12',
    number: 12,
    title: 'Cobro de Domicilio de Comida',
    category: 'Operaciones y Condicionales',
    description: 'Cada hamburguesa en un restaurante cuesta 12,000 pesos y el servicio de domicilio cuesta 4,000 pesos. Escribe un programa que pida la cantidad de hamburguesas y calcule el costo de la comida más el domicilio. Si la cantidad de hamburguesas es mayor o igual a 3, el domicilio es gratis (se restan 4,000 pesos al total). Muestra el valor final a pagar.',
    vars: 'hamburguesas (Entero), costo_comida (Entero), costo_total (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si hamburguesas >= 3',
    starterCode: `Algoritmo DomicilioComida

    

FinAlgoritmo`,
    testCases: [
      { inputs: [3], expected: ['36000', '36.000'], description: '3 hamburguesas (36k -> Domicilio gratis)' },
      { inputs: [4], expected: ['48000', '48.000'], description: '4 hamburguesas (48k -> Domicilio gratis)' },
      { inputs: [2], expected: ['28000', '28.000'], description: '2 hamburguesas (24k + 4k = 28k)' },
      { inputs: [1], expected: ['16000', '16.000'], description: '1 hamburguesa (12k + 4k = 16k)' },
      { inputs: [5], expected: ['60000', '60.000'], description: '5 hamburguesas (60k -> Domicilio gratis)' }
    ],
    solutions: [
      `Algoritmo DomicilioComida
    Definir hamburguesas Como Entero
    Definir costo_comida Como Entero
    Definir costo_total Como Entero

    Leer hamburguesas
    costo_comida <- hamburguesas * 12000

    Si hamburguesas >= 3 Entonces
        costo_total <- costo_comida
    Sino
        costo_total <- costo_comida + 4000
    FinSi

    Escribir "Costo final:", costo_total
FinAlgoritmo`,
      `Algoritmo DomicilioComida
    Definir hamburguesas, costo_comida, costo_total Como Entero

    Leer hamburguesas
    costo_comida = hamburguesas * 12000

    Si hamburguesas >= 3 Entonces
        costo_total = costo_comida
    Sino
        costo_total = costo_comida + 4000
    FinSi

    Escribir costo_total
FinAlgoritmo`,
      `Proceso DomicilioComida
    definir hamburguesas, costo_comida, costo_total como entero
    leer hamburguesas
    costo_comida = 12000 * hamburguesas
    si hamburguesas >= 3 entonces
        costo_total = costo_comida
    sino
        costo_total = costo_comida + 4000
    finsi
    escribir costo_total
FinProceso`
    ]
  },
  {
    id: 'ex-13',
    number: 13,
    title: 'Ahorro Semanal para el Parque de Atracciones',
    category: 'Sumas y Condicionales',
    description: 'Un estudiante ahorra 5,000 pesos diarios de lunes a viernes (5 días). Crea un programa que pida cuánto dinero extra ahorró el fin de semana. Calcula el ahorro total multiplicando 5,000 por 5 y sumando el dinero extra. Si el ahorro total es mayor o igual a 35,000 pesos, muestra "¡Te alcanza para la entrada al parque!"; de lo contrario, muestra "Te falta dinero para la entrada".',
    vars: 'dinero_extra (Entero), ahorro_semanal (Entero), ahorro_total (Entero)',
    operatorUsed: '+',
    conditionalUsed: 'Si ahorro_total >= 35000',
    starterCode: `Algoritmo AhorroParque

    

FinAlgoritmo`,
    testCases: [
      { inputs: [12000], expected: ['37000', 'alcanza', 'entrada al parque'], description: 'Extra 12k (25k + 12k = 37k -> Alcanza)' },
      { inputs: [10000], expected: ['35000', 'alcanza', 'entrada al parque'], description: 'Extra 10k (25k + 10k = 35k -> Alcanza)' },
      { inputs: [5000], expected: ['30000', 'falta', 'Te falta dinero'], description: 'Extra 5k (25k + 5k = 30k -> Falta)' },
      { inputs: [0], expected: ['25000', 'falta', 'Te falta dinero'], description: 'Sin extra (25k -> Falta)' },
      { inputs: [20000], expected: ['45000', 'alcanza', 'entrada al parque'], description: 'Extra 20k (25k + 20k = 45k -> Alcanza)' }
    ],
    solutions: [
      `Algoritmo AhorroParque
    Definir dinero_extra Como Entero
    Definir ahorro_semanal Como Entero
    Definir ahorro_total Como Entero

    ahorro_semanal <- 25000
    Leer dinero_extra
    ahorro_total <- ahorro_semanal + dinero_extra

    Si ahorro_total >= 35000 Entonces
        Escribir "¡Te alcanza para la entrada al parque!"
    Sino
        Escribir "Te falta dinero para la entrada"
    FinSi
FinAlgoritmo`,
      `Algoritmo AhorroParque
    Definir dinero_extra, ahorro_semanal, ahorro_total Como Entero

    ahorro_semanal = 5000 * 5
    Leer dinero_extra
    ahorro_total = ahorro_semanal + dinero_extra

    Si ahorro_total >= 35000 Entonces
        Escribir "¡Te alcanza para la entrada al parque!"
    Sino
        Escribir "Te falta dinero para la entrada"
    FinSi
FinAlgoritmo`,
      `Proceso AhorroParque
    definir dinero_extra, ahorro_semanal, ahorro_total como entero
    ahorro_semanal = 25000
    leer dinero_extra
    ahorro_total = ahorro_semanal + dinero_extra
    si ahorro_total >= 35000 entonces
        escribir "¡Te alcanza para la entrada al parque!"
    sino
        escribir "Te falta dinero para la entrada"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-14',
    number: 14,
    title: 'Boletas para el Partido de Baloncesto',
    category: 'Multiplicación y Descuentos',
    description: 'Las entradas a un partido cuestan 15,000 pesos cada una. Diseña un programa que pida la cantidad de boletas que comprará un grupo de amigos y calcule el valor total multiplicando la cantidad por 15,000. Si compran 5 o más boletas, el sistema otorga un descuento de 10,000 pesos al total. Muestra el precio final a pagar.',
    vars: 'boletas (Entero), costo_total (Entero), precio_final (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si boletas >= 5',
    starterCode: `Algoritmo BoletasBaloncesto

    

FinAlgoritmo`,
    testCases: [
      { inputs: [5], expected: ['65000', '65.000'], description: '5 boletas (75k - 10k = 65k)' },
      { inputs: [6], expected: ['80000', '80.000'], description: '6 boletas (90k - 10k = 80k)' },
      { inputs: [2], expected: ['30000', '30.000'], description: '2 boletas (30k sin descuento)' },
      { inputs: [4], expected: ['60000', '60.000'], description: '4 boletas (60k sin descuento)' },
      { inputs: [1], expected: ['15000', '15.000'], description: '1 boleta (15k sin descuento)' }
    ],
    solutions: [
      `Algoritmo BoletasBaloncesto
    Definir boletas Como Entero
    Definir costo_total Como Entero
    Definir precio_final Como Entero

    Leer boletas
    costo_total <- boletas * 15000

    Si boletas >= 5 Entonces
        precio_final <- costo_total - 10000
    Sino
        precio_final <- costo_total
    FinSi

    Escribir "El precio final es:", precio_final
FinAlgoritmo`,
      `Algoritmo BoletasBaloncesto
    Definir boletas, costo_total, precio_final Como Entero

    Leer boletas
    costo_total = boletas * 15000

    Si boletas >= 5 Entonces
        precio_final = costo_total - 10000
    Sino
        precio_final = costo_total
    FinSi

    Escribir precio_final
FinAlgoritmo`,
      `Proceso BoletasBaloncesto
    definir boletas, costo_total, precio_final como entero
    leer boletas
    costo_total = 15000 * boletas
    si boletas >= 5 entonces
        precio_final = costo_total - 10000
    sino
        precio_final = costo_total
    finsi
    escribir precio_final
FinProceso`
    ]
  },
  {
    id: 'ex-15',
    number: 15,
    title: 'Puntos en la Tienda de Deportes',
    category: 'División, Multiplicación y Bonos',
    description: 'Una tienda otorga 5 puntos por cada 1,000 pesos gastados en una compra. Escribe un programa que solicite el valor gastado en pesos y calcule los puntos dividiendo la compra entre 1,000 y multiplicando por 5. Si los puntos obtenidos son mayores o iguales a 50, el programa le otorga 20 puntos de bonificación adicionales. Muestra el total de puntos ganados.',
    vars: 'valor_compra (Entero), puntos_base (Entero), puntos_totales (Entero)',
    operatorUsed: '/',
    conditionalUsed: 'Si puntos_base >= 50',
    starterCode: `Algoritmo PuntosDeportes

    

FinAlgoritmo`,
    testCases: [
      { inputs: [10000], expected: ['70'], description: 'Compra 10k (50 pts base + 20 bono = 70 pts)' },
      { inputs: [12000], expected: ['80'], description: 'Compra 12k (60 pts base + 20 bono = 80 pts)' },
      { inputs: [6000], expected: ['30'], description: 'Compra 6k (30 pts base sin bono)' },
      { inputs: [2000], expected: ['10'], description: 'Compra 2k (10 pts base sin bono)' },
      { inputs: [20000], expected: ['120'], description: 'Compra 20k (100 pts base + 20 bono = 120 pts)' }
    ],
    solutions: [
      `Algoritmo PuntosDeportes
    Definir valor_compra Como Entero
    Definir puntos_base Como Entero
    Definir puntos_totales Como Entero

    Leer valor_compra
    puntos_base <- (valor_compra / 1000) * 5

    Si puntos_base >= 50 Entonces
        puntos_totales <- puntos_base + 20
    Sino
        puntos_totales <- puntos_base
    FinSi

    Escribir "Total de puntos:", puntos_totales
FinAlgoritmo`,
      `Algoritmo PuntosDeportes
    Definir valor_compra, puntos_base, puntos_totales Como Entero

    Leer valor_compra
    puntos_base = (valor_compra / 1000) * 5

    Si puntos_base >= 50 Entonces
        puntos_totales = puntos_base + 20
    Sino
        puntos_totales = puntos_base
    FinSi

    Escribir puntos_totales
FinAlgoritmo`,
      `Proceso PuntosDeportes
    definir valor_compra, puntos_base, puntos_totales como entero
    leer valor_compra
    puntos_base = (valor_compra / 1000) * 5
    si puntos_base >= 50 entonces
        puntos_totales = puntos_base + 20
    sino
        puntos_totales = puntos_base
    finsi
    escribir puntos_totales
FinProceso`
    ]
  },
  {
    id: 'ex-16',
    number: 16,
    title: 'Consumo de Minutos en Plan Móvil',
    category: 'Sumas, Restas y Condicionales',
    description: 'Un plan telefónico incluye 300 minutos al mes. Diseña un programa que pida los minutos gastados en la primera quincena y los minutos gastados en la segunda quincena. Suma ambos valores para obtener el consumo total. Si el consumo total supera los 300 minutos, calcula los minutos excedentes restando 300 al total y muestra "Superaste el límite de minutos"; de lo contrario, muestra "Consumo dentro del límite".',
    vars: 'minutos_q1 (Entero), minutos_q2 (Entero), minutos_totales (Entero), exceso (Entero)',
    operatorUsed: '+',
    conditionalUsed: 'Si minutos_totales > 300',
    starterCode: `Algoritmo MinutosPlanMovil

    

FinAlgoritmo`,
    testCases: [
      { inputs: [180, 150], expected: ['330', 'Superaste', 'límite'], description: 'Total 330 min (Exceso 30 -> Superaste límite)' },
      { inputs: [100, 120], expected: ['220', 'dentro del límite', 'límite'], description: 'Total 220 min (Dentro del límite)' },
      { inputs: [200, 150], expected: ['350', 'Superaste', 'límite'], description: 'Total 350 min (Exceso 50 -> Superaste límite)' },
      { inputs: [150, 150], expected: ['300', 'dentro del límite', 'límite'], description: 'Caso borde total 300 min (Dentro del límite)' },
      { inputs: [250, 100], expected: ['350', 'Superaste', 'límite'], description: 'Total 350 min (Superaste)' }
    ],
    solutions: [
      `Algoritmo MinutosPlanMovil
    Definir minutos_q1, minutos_q2, minutos_totales, exceso Como Entero

    Leer minutos_q1
    Leer minutos_q2
    minutos_totales <- minutos_q1 + minutos_q2

    Si minutos_totales > 300 Entonces
        exceso <- minutos_totales - 300
        Escribir "Superaste el límite de minutos"
    Sino
        Escribir "Consumo dentro del límite"
    FinSi
FinAlgoritmo`,
      `Algoritmo MinutosPlanMovil
    Definir minutos_q1, minutos_q2, minutos_totales, exceso Como Entero

    Leer minutos_q1
    Leer minutos_q2
    minutos_totales = minutos_q1 + minutos_q2

    Si minutos_totales > 300 Entonces
        exceso = minutos_totales - 300
        Escribir "Superaste el límite de minutos"
    Sino
        Escribir "Consumo dentro del límite"
    FinSi
FinAlgoritmo`,
      `Proceso MinutosPlanMovil
    definir minutos_q1, minutos_q2, minutos_totales, exceso como entero
    leer minutos_q1, minutos_q2
    minutos_totales = minutos_q1 + minutos_q2
    si minutos_totales > 300 entonces
        exceso = minutos_totales - 300
        escribir "Superaste el límite de minutos"
    sino
        escribir "Consumo dentro del límite"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-17',
    number: 17,
    title: 'Repartición de Saldo en Tarjeta Regalo',
    category: 'Sumas, Restas y Condicionales',
    description: 'Dos hermanos reciben una tarjeta regalo de 80,000 pesos para compartir en una tienda de ropa. Crea un programa que solicite el precio de la prenda elegida por el primer hermano y la del segundo hermano. Suma ambos precios. Si la suma total es menor o igual a 80,000 pesos, resta la suma a los 80,000 para calcular el saldo restante y muestra "Compra aprobada"; de lo contrario, muestra "El dinero no alcanza".',
    vars: 'prenda1 (Entero), prenda2 (Entero), total_compra (Entero), saldo_restante (Entero)',
    operatorUsed: '+',
    conditionalUsed: 'Si total_compra <= 80000',
    starterCode: `Algoritmo TarjetaRegalo

    

FinAlgoritmo`,
    testCases: [
      { inputs: [40000, 35000], expected: ['5000', 'aprobada', 'Compra aprobada'], description: 'Total 75k (Saldo 5k -> Compra aprobada)' },
      { inputs: [50000, 40000], expected: ['no alcanza', 'El dinero no alcanza'], description: 'Total 90k (Supera 80k -> No alcanza)' },
      { inputs: [40000, 40000], expected: ['0', 'aprobada', 'Compra aprobada'], description: 'Caso borde exacto 80k (Saldo 0 -> Compra aprobada)' },
      { inputs: [20000, 30000], expected: ['30000', 'aprobada', 'Compra aprobada'], description: 'Total 50k (Saldo 30k -> Compra aprobada)' },
      { inputs: [10000, 10000], expected: ['60000', 'aprobada', 'Compra aprobada'], description: 'Total 20k (Saldo 60k -> Compra aprobada)' }
    ],
    solutions: [
      `Algoritmo TarjetaRegalo
    Definir prenda1, prenda2, total_compra, saldo_restante Como Entero

    Leer prenda1
    Leer prenda2
    total_compra <- prenda1 + prenda2

    Si total_compra <= 80000 Entonces
        saldo_restante <- 80000 - total_compra
        Escribir "Compra aprobada"
    Sino
        Escribir "El dinero no alcanza"
    FinSi
FinAlgoritmo`,
      `Algoritmo TarjetaRegalo
    Definir prenda1, prenda2, total_compra, saldo_restante Como Entero

    Leer prenda1
    Leer prenda2
    total_compra = prenda1 + prenda2

    Si total_compra <= 80000 Entonces
        saldo_restante = 80000 - total_compra
        Escribir "Compra aprobada"
    Sino
        Escribir "El dinero no alcanza"
    FinSi
FinAlgoritmo`,
      `Proceso TarjetaRegalo
    definir prenda1, prenda2, total_compra, saldo_restante como entero
    leer prenda1, prenda2
    total_compra = prenda1 + prenda2
    si total_compra <= 80000 entonces
        saldo_restante = 80000 - total_compra
        escribir "Compra aprobada"
    sino
        escribir "El dinero no alcanza"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-18',
    number: 18,
    title: 'Velocidad Promedio en Ciclismo',
    category: 'División y Condicionales',
    description: 'En un circuito escolar de ciclismo, un estudiante recorre una distancia en kilómetros durante un tiempo en horas. Escribe un programa que solicite la distancia en km y el tiempo en horas, y calcule la velocidad dividiendo la distancia entre el tiempo. Si la velocidad es mayor o igual a 20 km/h, muestra "¡Excelente rendimiento, clasificaste a la final!"; de lo contrario, muestra "Buen esfuerzo, debes mejorar el tiempo".',
    vars: 'distancia_km (Entero), tiempo_horas (Entero), velocidad (Entero)',
    operatorUsed: '/',
    conditionalUsed: 'Si velocidad >= 20',
    starterCode: `Algoritmo VelocidadCiclismo

    

FinAlgoritmo`,
    testCases: [
      { inputs: [40, 2], expected: ['20', 'clasificaste', 'Excelente rendimiento'], description: '40 km en 2 hrs (Velocidad 20 -> Clasificaste)' },
      { inputs: [60, 2], expected: ['30', 'clasificaste', 'Excelente rendimiento'], description: '60 km en 2 hrs (Velocidad 30 -> Clasificaste)' },
      { inputs: [30, 2], expected: ['15', 'mejores', 'debes mejorar', 'Buen esfuerzo'], description: '30 km en 2 hrs (Velocidad 15 -> Debes mejorar)' },
      { inputs: [10, 1], expected: ['10', 'mejores', 'debes mejorar', 'Buen esfuerzo'], description: '10 km en 1 hr (Velocidad 10 -> Debes mejorar)' },
      { inputs: [100, 4], expected: ['25', 'clasificaste', 'Excelente rendimiento'], description: '100 km en 4 hrs (Velocidad 25 -> Clasificaste)' }
    ],
    solutions: [
      `Algoritmo VelocidadCiclismo
    Definir distancia_km, tiempo_horas, velocidad Como Entero

    Leer distancia_km
    Leer tiempo_horas
    velocidad <- distancia_km / tiempo_horas

    Si velocidad >= 20 Entonces
        Escribir "¡Excelente rendimiento, clasificaste a la final!"
    Sino
        Escribir "Buen esfuerzo, debes mejorar el tiempo"
    FinSi
FinAlgoritmo`,
      `Algoritmo VelocidadCiclismo
    Definir distancia_km, tiempo_horas, velocidad Como Entero

    Leer distancia_km
    Leer tiempo_horas
    velocidad = distancia_km / tiempo_horas

    Si velocidad >= 20 Entonces
        Escribir "¡Excelente rendimiento, clasificaste a la final!"
    Sino
        Escribir "Buen esfuerzo, debes mejorar el tiempo"
    FinSi
FinAlgoritmo`,
      `Proceso VelocidadCiclismo
    definir distancia_km, tiempo_horas, velocidad como entero
    leer distancia_km, tiempo_horas
    velocidad = distancia_km / tiempo_horas
    si velocidad >= 20 entonces
        escribir "¡Excelente rendimiento, clasificaste a la final!"
    sino
        escribir "Buen esfuerzo, debes mejorar el tiempo"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-19',
    number: 19,
    title: 'Nota Definitiva con Tres Talleres',
    category: 'Promedios y Condicionales',
    description: 'Un estudiante presenta 3 talleres prácticos (calificados de 1 a 10). Crea un programa que pida la nota de cada taller, las sume y las divida entre 3 para obtener el promedio. Si la nota definitiva es mayor o igual a 6, muestra "Aprobó la unidad de programación"; de lo contrario, muestra "Reprobó la unidad, debe presentar recuperación".',
    vars: 'taller1 (Entero), taller2 (Entero), taller3 (Entero), nota_definitiva (Real)',
    operatorUsed: '/',
    conditionalUsed: 'Si nota_definitiva >= 6',
    starterCode: `Algoritmo NotaTresTalleres

    

FinAlgoritmo`,
    testCases: [
      { inputs: [8, 7, 9], expected: ['8', 'Aprobó', 'Aprobo la unidad'], description: 'Notas 8, 7, 9 (Promedio 8 -> Aprobó)' },
      { inputs: [6, 6, 6], expected: ['6', 'Aprobó', 'Aprobo la unidad'], description: 'Notas 6, 6, 6 (Promedio 6 -> Aprobó)' },
      { inputs: [4, 5, 3], expected: ['4', 'Reprobó', 'Reprobo', 'recuperación'], description: 'Notas 4, 5, 3 (Promedio 4 -> Reprobó)' },
      { inputs: [10, 10, 10], expected: ['10', 'Aprobó', 'Aprobo la unidad'], description: 'Notas 10, 10, 10 (Promedio 10 -> Aprobó)' },
      { inputs: [7, 8, 9], expected: ['8', 'Aprobó', 'Aprobo la unidad'], description: 'Notas 7, 8, 9 (Promedio 8 -> Aprobó)' }
    ],
    solutions: [
      `Algoritmo NotaTresTalleres
    Definir taller1, taller2, taller3 Como Entero
    Definir nota_definitiva Como Real

    Leer taller1
    Leer taller2
    Leer taller3
    nota_definitiva <- (taller1 + taller2 + taller3) / 3

    Si nota_definitiva >= 6 Entonces
        Escribir "Aprobó la unidad de programación"
    Sino
        Escribir "Reprobó la unidad, debe presentar recuperación"
    FinSi
FinAlgoritmo`,
      `Algoritmo NotaTresTalleres
    Definir taller1, taller2, taller3 Como Entero
    Definir nota_definitiva Como Real

    Leer taller1
    Leer taller2
    Leer taller3
    nota_definitiva = (taller1 + taller2 + taller3) / 3

    Si nota_definitiva >= 6 Entonces
        Escribir "Aprobó la unidad de programación"
    Sino
        Escribir "Reprobó la unidad, debe presentar recuperación"
    FinSi
FinAlgoritmo`,
      `Proceso NotaTresTalleres
    definir taller1, taller2, taller3 como entero
    definir nota_definitiva como real
    leer taller1, taller2, taller3
    nota_definitiva = (taller1 + taller2 + taller3) / 3
    si nota_definitiva >= 6 entonces
        escribir "Aprobó la unidad de programación"
    sino
        escribir "Reprobó la unidad, debe presentar recuperación"
    finsi
FinProceso`
    ]
  },
  {
    id: 'ex-20',
    number: 20,
    title: 'Costo de Alquiler de Bicicletas Públicas',
    category: 'Multiplicación, Suma y Recargo',
    description: 'El alquiler de una bicicleta cuesta 2,000 pesos por hora. Diseña un programa que pida la cantidad de horas que un usuario usó la bicicleta. Calcula el costo base multiplicando las horas por 2,000. Si el usuario utilizó la bicicleta por más de 5 horas, se le cobra un recargo de 3,000 pesos adicionales que se suma al costo base. Muestra el total a pagar.',
    vars: 'horas_uso (Entero), costo_base (Entero), costo_final (Entero)',
    operatorUsed: '*',
    conditionalUsed: 'Si horas_uso > 5',
    starterCode: `Algoritmo AlquilerBicicletas

    

FinAlgoritmo`,
    testCases: [
      { inputs: [6], expected: ['15000', '15.000'], description: '6 horas (12k + 3k recargo = 15k)' },
      { inputs: [5], expected: ['10000', '10.000'], description: 'Caso borde 5 horas (10k sin recargo)' },
      { inputs: [3], expected: ['6000', '6.000'], description: '3 horas (6k sin recargo)' },
      { inputs: [8], expected: ['19000', '19.000'], description: '8 horas (16k + 3k recargo = 19k)' },
      { inputs: [2], expected: ['4000', '4.000'], description: '2 horas (4k sin recargo)' }
    ],
    solutions: [
      `Algoritmo AlquilerBicicletas
    Definir horas_uso, costo_base, costo_final Como Entero

    Leer horas_uso
    costo_base <- horas_uso * 2000

    Si horas_uso > 5 Entonces
        costo_final <- costo_base + 3000
    Sino
        costo_final <- costo_base
    FinSi

    Escribir "Total a pagar:", costo_final
FinAlgoritmo`,
      `Algoritmo AlquilerBicicletas
    Definir horas_uso, costo_base, costo_final Como Entero

    Leer horas_uso
    costo_base = horas_uso * 2000

    Si horas_uso > 5 Entonces
        costo_final = costo_base + 3000
    Sino
        costo_final = costo_base
    FinSi

    Escribir costo_final
FinAlgoritmo`,
      `Proceso AlquilerBicicletas
    definir horas_uso, costo_base, costo_final como entero
    leer horas_uso
    costo_base = 2000 * horas_uso
    si horas_uso > 5 entonces
        costo_final = costo_base + 3000
    sino
        costo_final = costo_base
    finsi
    escribir costo_final
FinProceso`
    ]
  }
];

export const EXERCISES = ALL_EXERCISES;

export function getAssignedExercises(studentName = '') {
  if (!studentName) {
    return [ALL_EXERCISES[0], ALL_EXERCISES[1]];
  }

  let hash = 0;
  for (let i = 0; i < studentName.length; i++) {
    hash = (hash << 5) - hash + studentName.charCodeAt(i);
    hash |= 0;
  }
  const idx1 = Math.abs(hash) % ALL_EXERCISES.length;
  let idx2 = Math.abs(hash * 31 + 7) % ALL_EXERCISES.length;
  if (idx1 === idx2) {
    idx2 = (idx1 + 1) % ALL_EXERCISES.length;
  }

  return [ALL_EXERCISES[idx1], ALL_EXERCISES[idx2]];
}
