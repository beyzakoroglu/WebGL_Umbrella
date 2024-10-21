const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

// Set up the WebGL viewport and background color
gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(1.0, 1.0, 0.7, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Create shader program
const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
if (!program) {
    console.error('Shader program failed to initialize.');

}
console.log('Shader program initialized successfully.');

// Use the shader program
gl.useProgram(program);

// Bézier Curve Calculation
function calculateBezierCurve(p0, p1, p2, numPoints = 30) {
    const vertices = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        vertices.push({ x, y });
    }
    return vertices;
}

// Draw and triangulate the handle
function drawHandle() {
    const vertices = [];

    const leftLine = calculateStraightLine(
        { x: -0.04, y: -0.5 }, { x: -0.04, y: 0.65 }, 3
    );

    console.log('LeftLine curve: ', leftLine);

    const upperBodyCurve = calculateBezierCurve(
        { x: -0.04, y: 0.7 }, { x: 0.0, y: 0.75 }, { x: 0.04, y: 0.7 }
    );

    console.log('upperBodyCurve : ', upperBodyCurve);

    const rightLine = calculateStraightLine(
        { x: 0.04, y: 0.75 }, { x: 0.04, y: -0.5 }, 3
    );

    console.log('rightLine curve: ', rightLine);

    const lastLine = calculateStraightLine(
        { x: 0.04, y: -0.5 }, { x: -0.04, y: -0.5 }, 3
    );

    console.log('lastLine curve: ', lastLine);

    /*vertices[0] = {x: -4, y: 6};
    vertices[1] = {x: 0, y: 2};
    vertices[2] = {x: 2, y: 5};
    vertices[3] = {x: 7, y: 0};
    vertices[4] = {x: 5, y: -6};
    vertices[5] = {x: 3, y: 3};
    vertices[6] = {x: 0, y: -5};
    vertices[7] = {x: -6, y: 0};
    vertices[8] = {x: -2, y: 1};*/


    // Combine all vertices into one list
    vertices.push(...leftLine, ...upperBodyCurve, ...rightLine);
    console.log('Vertices generated:', vertices);

    // Perform polygon triangulation
    const result = triangulate(vertices);
    if (!result || !result.success) {
        console.error(result?.errorMessage || 'Triangulation failed.');
        return;
    }
    console.log('Triangulation successful:', result.triangles);

    const triangles = result.triangles;

    // Flatten the triangulated vertices for WebGL
    const positions = new Float32Array(triangles.length * 2);
    let posIndex = 0;
    for (const index of triangles) {
        positions[posIndex++] = vertices[index].x;
        positions[posIndex++] = vertices[index].y;
    }

    // Initialize the buffer with triangle data
    const positionBuffer = initBuffer(gl, positions);

    // Bind the buffer to the attribute
    const aPosition = gl.getAttribLocation(program, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(aPosition);

    // Set the color for the triangles
    const uColor = gl.getUniformLocation(program, 'u_color');
    if (uColor === -1) {
        console.error('Failed to get the uniform location of u_color.');
        return;
    }
    gl.uniform4f(uColor, 0.3, 0.2, 0.6, 1.0); // Dark purple color

    // Draw the triangles
    console.log('Drawing the handle...');
    gl.drawArrays(gl.TRIANGLES, 0, positions.length / 2);
    console.log('Handle drawn successfully.');
}

// Call the draw function
drawHandle();

function calculateStraightLine(p0, p1, numPoints = 10) {
    const vertices = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = p0.x + t * (p1.x - p0.x);
        const y = p0.y + t * (p1.y - p0.y);
        vertices.push({ x, y });
    }
    return vertices;
}
