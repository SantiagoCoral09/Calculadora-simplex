function fraccion() {
    let numero = 1 / 3;
    let frac = math.fraction(numero);
    document.getElementById('f').innerHTML = `${numero} = ${frac.n}/${frac.d}`;
    console.log(frac);
}

// Funcion para pedir los datos de variables y restricciones
function pedirDatos() {
    const numVariables = parseInt(document.getElementById('numVariables').value);
    const numRestricciones = parseInt(document.getElementById('numRestricciones').value);

    // Limpiar el contenedor de datos
    const datosContainer = document.getElementById('DatosContainer');
    datosContainer.innerHTML = ''; // Limpiar contenido anterior

    // Operador de desigualdad
    const operadorSelect = document.createElement('select');
    operadorSelect.id = `operacion`;
    operadorSelect.className = "input_med";
    const opciones = ['Maximizar', 'Minimizar'];
    opciones.forEach(opcion => {
        const optionElement = document.createElement('option');
        optionElement.value = opcion;
        optionElement.textContent = opcion;
        operadorSelect.appendChild(optionElement);
    });
    datosContainer.appendChild(operadorSelect);


    // Generar la función objetivo
    const objetivoDiv = document.createElement('div');
    objetivoDiv.innerHTML = '<h3>Función Objetivo:</h3>';
    objetivoDiv.innerHTML += 'Z = ';
    for (let i = 0; i < numVariables; i++) {
        const input = document.createElement('input');
        input.type = 'number';
        input.id = `coefObj_X${i + 1}`;
        input.placeholder = `Coeficiente de X${i + 1}`;
        input.className = "input_small";
        objetivoDiv.appendChild(input);
        objetivoDiv.innerHTML += ` X${i + 1} `;

        if (i < numVariables - 1) {
            objetivoDiv.innerHTML += ` + `;
        }
    }
    datosContainer.appendChild(objetivoDiv);

    // Generar las restricciones
    for (let i = 0; i < numRestricciones; i++) {
        const restricDiv = document.createElement('div');
        restricDiv.innerHTML = `<h3>Restricción ${i + 1}:</h3>`;
        for (let j = 0; j < numVariables; j++) {
            const input = document.createElement('input');
            input.type = 'number';
            input.id = `coefRestric_${i + 1}_X${j + 1}`;
            input.placeholder = `Coeficiente de X${j + 1}`;
            input.className = "input_small";
            restricDiv.appendChild(input);
            restricDiv.innerHTML += ` X${j + 1} `;
            if (j < numVariables - 1) {
                restricDiv.innerHTML += ` + `;
            }
        }

        // // Operador de desigualdad
        // const operadorSelect = document.createElement('select');
        // operadorSelect.id = `operador_${i + 1}`;
        // operadorSelect.className = "input_small_x";
        // const opciones = ['<='];
        // opciones.forEach(opcion => {
        //     const optionElement = document.createElement('option');
        //     optionElement.value = opcion;
        //     optionElement.textContent = opcion;
        //     operadorSelect.appendChild(optionElement);
        // });
        // const operadorSelect=document.createElement('input');
        // operadorSelect.type='text';
        // operadorSelect.value=' <= ';
        // operadorSelect.disabled=true;
        // operadorSelect.className="input_small";

        // restricDiv.appendChild(operadorSelect);
        restricDiv.innerHTML += '&nbsp; <= &nbsp;';


        // Valor de la restricción
        const valorInput = document.createElement('input');
        valorInput.type = 'number';
        valorInput.className = "input_small";
        valorInput.id = `valorRestric_${i + 1}`;
        valorInput.placeholder = 'Valor';
        restricDiv.appendChild(valorInput);

        datosContainer.appendChild(restricDiv);
    }

    // Crear la condición de no negatividad
    const noNegatividadDiv = document.createElement('div');
    let texto = `Restricción de no negatividad: `;
    for (let i = 0; i < numVariables; i++) {
        texto += `X${i + 1}`;
        if (i < numVariables - 1) {
            texto += `, `;
        } else {
            texto += ` >= 0`;
        }
    }
    noNegatividadDiv.innerHTML = `<p>${texto}</p>`;

    datosContainer.appendChild(noNegatividadDiv);

    // Crear botón para resolver
    const resolverButton = document.createElement('button');
    resolverButton.type = 'button';
    resolverButton.className = 'button';
    resolverButton.textContent = 'Resolver';
    resolverButton.onclick = iniciarSimplex; // Asignar la función que se llamará al hacer clic

    // Añadir el botón al contenedor de datos
    datosContainer.appendChild(resolverButton);
}





// Función para iniciar el método simplex (puedes implementar aquí tu lógica)
function iniciarSimplex() {
    document.getElementById('resultado').innerHTML = "";
    document.getElementById("fin").innerHTML = "";
    document.getElementById('resultadoTabla').innerHTML = "";

    // Lógica del método Simplex (aquí se procesarán los datos)
    // document.getElementById('resultado').innerHTML = `
    //   <h3>Resultados:</h3>
    //   <p>Función Objetivo: </p>
    //   <p>Restricciones: </p>
    //   <p>(Aquí se mostrarán los resultados del método simplex paso a paso)</p>
    // `;

    // Inicializar la tabla con variables y restricciones
    const numVariables = parseInt(document.getElementById('numVariables').value);
    const numRestricciones = parseInt(document.getElementById('numRestricciones').value);
    const operacion = (document.getElementById('operacion').value);
    console.log("Operacion a realizar: ", operacion);

    // Crear la tabla inicial (con filas y columnas dinámicas)
    let tablaSimplex = [['Var Bas', 'Z']];
    // Segun el numero de variables se agregan los encabezados de cada vaiable no basica
    for (let i = 0; i < numVariables; i++) {
        tablaSimplex[0].push(`X${i + 1}`);
    }
    // Segun el numero de restricciones se agregan los encabezados de cada vaiable de holgura
    for (let i = 0; i < numRestricciones; i++) {
        tablaSimplex[0].push(`S${i + 1}`);
    }
    // Agregar el encabezado de la columna de resultados
    tablaSimplex[0].push('R');

    tablaSimplex.push(['Z', 1]);
    let numCols = tablaSimplex[0].length;
    for (i = 0; i < numCols - 2; i++) {
        if (i < numVariables) { //Agregar los coeficientes de la funcion objetivo
            tablaSimplex[1].push(parseFloat(document.getElementById(`coefObj_X${i + 1}`).value) * (-1));
        } else { //Agregar ceros en variables de holgura para Z
            tablaSimplex[1].push(0);
        }
    }
    // Agregar las demas filas de acuerdo al numero de restricciones
    for (let i = 2; i < numRestricciones + 2; i++) {
        for (let j = 0; j < numCols; j++) {
            if (j == 0) {//Es la qtiqueta de la variable basica
                tablaSimplex.push([`S${i - 1}`]);
            } else if (j == 1) { //Es la columna para z siempre es cero
                tablaSimplex[i].push(0);
            } else {
                if ((j - 2) < numVariables) {
                    //Para asignar los coeficientes de las variables X_i en cada restriccion
                    // tablaSimplex[i].push(prompt("coefRestric_1_X1"));
                    tablaSimplex[i].push(parseFloat(document.getElementById(`coefRestric_${i - 1}_X${j - 1}`).value));
                }
                else if ((j - numVariables) == (i)) {
                    //Para asignar los coeficientes de las variables S_i en cada restriccion
                    // Se agrega un 1
                    tablaSimplex[i].push(1);
                }
                else if (j + 1 == numCols) {
                    // Agregar coeficiente del resultado
                    tablaSimplex[i].push(parseFloat(document.getElementById(`valorRestric_${i - 1}`).value));
                }
                else {
                    // Agrega ceros para rellenar la matriz
                    tablaSimplex[i].push(0);
                }
            }

        }

    }

    console.log(tablaSimplex);

    // Crear una tabla HTML para mostrar la matriz
    const tablaHTML = document.createElement('table');
    tablaHTML.border = '1'; // Opcional: para agregar borde a la tabla

    // Crear la fila de encabezados
    const encabezadoRow = document.createElement('tr');
    tablaSimplex[0].forEach(header => {
        const th = document.createElement('th');
        th.textContent = header;
        encabezadoRow.appendChild(th);
    });
    tablaHTML.appendChild(encabezadoRow);

    // Crear las filas de datos
    for (let i = 1; i < tablaSimplex.length; i++) {
        const row = document.createElement('tr');
        tablaSimplex[i].forEach(value => {
            const td = document.createElement('td');
            td.textContent = value;
            row.appendChild(td);
        });
        tablaHTML.appendChild(row);
    }

    // Limpiar resultados anteriores y agregar la tabla al contenedor de resultados
    const resultadoContainer = document.getElementById('resultado');
    resultadoContainer.innerHTML = '<h2 class="center">Tabla Simplex generada</h2>'; // Limpiar contenido anterior
    resultadoContainer.appendChild(tablaHTML);



    maximizarSimplex(tablaSimplex, operacion);

    // let tablaSimplex = [
    //     ["Var Bas", "Z", "X1", "X2", "S1", "S2", "S3", "S4", "R"],//0
    //     ["Z", 1, -5, -4, 0, 0, 0, 0, 0],//1
    //     ["S1", 0, 6, 4, 1, 0, 0, 0, 24],//2
    //     ["S2", 0, 1, 2, 0, 1, 0, 0, 6],//3
    //     ["S3", 0, -1, 1, 0, 0, 1, 0, 1],//4
    //     ["S4", 0, 0, 1, 0, 0, 0, 1, 2]//5
    // ]



}

function maximizarSimplex(tablaSimplex, operacion) {
    let numIteraciones = 0;
    let maxIteraciones = 10;


    while (true) {
        numIteraciones++;

        console.log(tablaSimplex);
        console.log("Iteracion", numIteraciones);

        // Paso 1: Obtener la lista de variables básicas (columna c0)
        let variablesBasicas = [];
        for (let i = 2; i < tablaSimplex.length; i++) { // Ignoramos el encabezado (F0) y F1 (Z)
            variablesBasicas.push(tablaSimplex[i][0]);
        }

        console.log("Variables Básicas:", variablesBasicas);
        let colPivote = 0;
        if (operacion == "Maximizar") {
            console.log("Vamos a maximizar");
            // Paso 2: Buscar el valor más negativo en F1 (fila de Z)
            let resultadoMasNegativo = obtenerMasNegativoFilaZ(tablaSimplex, variablesBasicas);
            colPivote = resultadoMasNegativo.indiceColumnaMasNegativo;
            let elementoMenorColPivote = resultadoMasNegativo.valorMasNegativo;

            console.log(`colPivote =${colPivote}, elementoMenorColPivote y ${elementoMenorColPivote}`);

        } else {
            console.log("Vamos a minimizar");
            // Paso 2: Buscar el valor más positivo en F1 (fila de Z)
            let resultadoMasPositivo = obtenerMasPositivoFilaZ(tablaSimplex, variablesBasicas);
            colPivote = resultadoMasPositivo.indiceColumnaMasPositivo;
            let elementoMenorColPivote = resultadoMasPositivo.valorMasPositivo;

            console.log(`colPivote =${colPivote}, elementoMenorColPivote y ${elementoMenorColPivote}`);

        }



        if (colPivote > 0) {
            //Paso 3. Elegir renglon pivote.
            let filaPivote = obtenerFilaPivote(tablaSimplex, colPivote);
            console.log("Fila Pivote", filaPivote, "Columna Pivote ", colPivote);

            ///Ahora se divide la fila pivote entre el elemento pivote para que tenga valor de 1
            let elementoPivote = tablaSimplex[filaPivote][colPivote];
            console.log(`Elemento pivote: ${elementoPivote}`);

            let tablaSimplexNormalizada = normalizarFilaPivote(tablaSimplex, filaPivote, colPivote);
            console.log(tablaSimplexNormalizada);
            //Paso 4: Eliminar la fila pivote de la tabla
            let texto = `<h2>Iteración ${numIteraciones}.</h2><br><h3>Columna pivote: C${colPivote}, fila pivote F${filaPivote-1} <br>Se debería dividir la fila entre el elemento ${elementoPivote}</h3><h3>Ahora, la variable ${tablaSimplex[filaPivote][0]} pasa a ser variable básica.</h3>`;
            mostrarTabla(tablaSimplexNormalizada, texto, filaPivote, colPivote, elementoPivote);

            texto = `<h3>Se deben convertir las filas no pivotes en ceros, para eso hacemos las siguientes transformaciones:</h3><h4>`;

            for (let i = 1; i < tablaSimplex.length; i++) {
                if (i != filaPivote) {
                    let factor = tablaSimplexNormalizada[i][colPivote];  // Factor a multiplicar por la fila pivote
                    texto += `<br>F${i-1}=> -(${parseFloat(factor).toFixed(2)})*F${filaPivote-1} + F${i-1}`
                }
            }
            texto += '</h4';
            //convertir en ceros los elementos de la columna pivote
            let tablaSimplexNueva = convertirCerosColumnaPivote(tablaSimplexNormalizada, filaPivote, colPivote);
            console.log(tablaSimplexNueva);

            mostrarTabla(tablaSimplexNueva, texto, filaPivote, colPivote, elementoPivote);

        } else {
            console.log("Fin");
            let texto = `<h2>Resultados Finales</h2><h3>Luego de hacer los cálculos en las iteraciones se obtiene:</h3><h3>`
            for (let i = 1; i < tablaSimplex.length; i++) {
                texto += `${tablaSimplex[i][0]} = ${(tablaSimplex[i][tablaSimplex[0].length - 1]).toFixed(2)}<br>`
            }
            console.log(texto);
            document.getElementById("fin").innerHTML = `${texto}</h3>`
            break;
        }
    }
}


function obtenerMasNegativoFilaZ(tablaSimplex, variablesBasicas) {
    // Paso 2: Buscar el valor más negativo en F1 (fila de Z)
    let valorMasNegativo = 0;
    let indiceColumnaMasNegativo = -1;

    for (let j = 2; j < tablaSimplex[1].length - 1; j++) { // Ignoramos c0 y c1 (y la columna R que es c8)
        let nombreVariable = tablaSimplex[0][j]; // Nombre de la variable en la columna actual (X1, X2, etc.)

        // Verificamos si esta variable está en la lista de variables básicas
        if (!variablesBasicas.includes(nombreVariable)) {
            console.log(nombreVariable + "es no basica");
            let valor = tablaSimplex[1][j]; // Valor en la fila Z

            // Paso 3: Buscamos el valor más negativo entre las variables no básicas
            if (valor < valorMasNegativo) {
                valorMasNegativo = valor;
                indiceColumnaMasNegativo = j;
            }
        } else {
            console.log(nombreVariable + "es basica");
        }
    }
    // Retornamos el valor más negativo y el índice de la columna donde está
    return { valorMasNegativo, indiceColumnaMasNegativo };
}

function obtenerMasPositivoFilaZ(tablaSimplex, variablesBasicas) {
    // Paso 2: Buscar el valor más positivo en F1 (fila de Z)
    let valorMasPositivo = 0;
    let indiceColumnaMasPositivo = -1;

    for (let j = 2; j < tablaSimplex[1].length - 1; j++) { // Ignoramos c0 y c1 (y la columna R que es c8)
        let nombreVariable = tablaSimplex[0][j]; // Nombre de la variable en la columna actual (X1, X2, etc.)

        // Verificamos si esta variable está en la lista de variables básicas
        if (!variablesBasicas.includes(nombreVariable)) {
            console.log(nombreVariable + "es no basica");
            let valor = tablaSimplex[1][j]; // Valor en la fila Z
            console.log("Valor mas positivo: ", valor);

            // Paso 3: Buscamos el valor más negativo entre las variables no básicas
            if (valor > valorMasPositivo) {
                valorMasPositivo = valor;
                indiceColumnaMasPositivo = j;
            }
        } else {
            console.log(nombreVariable + "es basica");
        }
    }
    // Retornamos el valor más negativo y el índice de la columna donde está
    return { valorMasPositivo, indiceColumnaMasPositivo };
}
function obtenerFilaPivote(tablaSimplex, colPivote) {
    let columnaPivote = [];
    let cocientes = [];
    let filaPivote = -1;
    let menorCociente = Infinity;  // Iniciamos con un valor muy grande

    for (let i = 2; i < tablaSimplex.length; i++) {
        columnaPivote.push(tablaSimplex[i][colPivote]);

        let valorColPivote = tablaSimplex[i][colPivote];
        let valorResultado = tablaSimplex[i][tablaSimplex[0].length - 1]; // Columna 'R' al final de la fila

        // Evitamos divisiones por cero o valores negativos en la columna pivote
        if (valorColPivote > 0) {
            let cociente = valorResultado / valorColPivote;
            cocientes.push(cociente);
            // Encontramos el menor cociente positivo
            if (cociente < menorCociente) {
                menorCociente = cociente;
                filaPivote = i;
            }
        } else {
            // Si el valor en la columna pivote es negativo o cero, no se incluye en el cálculo
            cocientes.push(null);
        }
    }
    console.log("Columna Pivote:", columnaPivote);
    console.log("Cocientes:", cocientes);
    console.log("Fila Pivote (Índice):", filaPivote);
    console.log("Menor Cociente:", menorCociente);

    return filaPivote;
}

function normalizarFilaPivote(tablaSimplex, filaPivote, colPivote) {
    let elementoPivote = tablaSimplex[filaPivote][colPivote];
    //Cambiar la variable no basica a basica
    tablaSimplex[filaPivote][0] = tablaSimplex[0][colPivote];

    // Dividimos cada elemento de la fila pivote por el elemento pivote
    for (let j = 1; j < tablaSimplex[0].length; j++) { // Ignoramos la columna 0 (Var Bas)
        tablaSimplex[filaPivote][j] /= elementoPivote;
    }
    // console.log("Fila Pivote Normalizada:", tablaSimplex);
    return tablaSimplex;
}

function convertirCerosColumnaPivote(tablaSimplexNormalizada, filaPivote, colPivote) {
    let numCols = tablaSimplexNormalizada[0].length;
    let numFilas = tablaSimplexNormalizada.length;
    console.log("Filas, columnas ", numFilas, numCols);


    for (let i = 1; i < numFilas; i++) {
        if (i != filaPivote) {
            let factor = tablaSimplexNormalizada[i][colPivote];  // Factor a multiplicar por la fila pivote
            for (j = 1; j < numCols; j++) {
                tablaSimplexNormalizada[i][j] = -(factor) * (tablaSimplexNormalizada[filaPivote][j]) + tablaSimplexNormalizada[i][j];
            }
        }
    }
    return tablaSimplexNormalizada;
}

function mostrarTabla(tablaSimplex, texto, filaPivote, colPivote, elementoPivote) {
    const tablaHTML = document.getElementById('resultadoTabla'); // Asegúrate de tener un contenedor para la tabla
    // tablaHTML.innerHTML = ''; // Limpiar contenido previo

    const divTexto = document.createElement('div');
    divTexto.innerHTML = texto;
    tablaHTML.appendChild(divTexto);


    const tabla = document.createElement('table');
    for (let i = 0; i < tablaSimplex.length; i++) {
        const fila = document.createElement('tr');
        const filaHTML = document.createElement('tr');

        const celda01 = document.createElement('td');
        if (i == 0) {
            celda01.textContent = '';
        } else {
            celda01.textContent = `F${i - 1}`;
        }
        filaHTML.appendChild(celda01);

        for (let j = 0; j < tablaSimplex[i].length; j++) {
            if (i == 0) {
                if (j == 0) {
                    const col0 = document.createElement('td');
                    col0.textContent = ``;
                    fila.appendChild(col0);
                }
                const celda0 = document.createElement('td');
                celda0.textContent = `C${j}`;
                fila.appendChild(celda0);
            }

            const celda = document.createElement('td');
            const valor = tablaSimplex[i][j];

            if (i == 0 || j == 0) {
                celda.style.fontWeight = 'bold';

            }

            // Formato de números
            if (typeof valor === 'number') {
                // celda.textContent = parseFloat(valor).toFixed(2);
                if (Number.isInteger(parseFloat(valor))) {
                    celda.textContent = parseFloat(valor);
                } else {
                    let signo="";
                    if (parseFloat(valor)<0) signo="-";
                    celda.textContent = `${signo}${math.fraction(parseFloat(valor)).n}/${math.fraction(parseFloat(valor)).d}`;
                }


            } else {
                celda.textContent = `${valor}`;
            }

            // Resaltar fila pivote
            if (i === filaPivote) {
                celda.style.backgroundColor = '#efd58e'; // Fondo azul claro para la fila pivote
            }

            // Resaltar columna pivote
            if (j === colPivote) {
                celda.style.backgroundColor = '#d69fed'; // Fondo naranja claro para la columna pivote
            }

            // Resaltar elemento pivote (intersección de fila y columna pivote)
            if (i === filaPivote && j === colPivote) {
                celda.style.backgroundColor = '#00db09'; // Fondo verde claro para el elemento pivote
                celda.style.fontWeight = 'bold'; // Poner el elemento pivote en negrita
            }


            filaHTML.appendChild(celda);


        }
        if (i == 0) {
            tabla.appendChild(fila);
        }

        tabla.appendChild(filaHTML);
    }

    tablaHTML.appendChild(tabla);
}