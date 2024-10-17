const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(1.0, 1.0, 0.7, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Create shader program
const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// Umbrella body
const bodyRectangleVertices = new Float32Array([
    -0.02, -0.5,  // bottom left corner
    0.02, -0.5,  // bottom right corner
    -0.02,  0.5,  // top left corner
    0.02,  0.5   // top right corner
]);

// Bézier curve for top of the handle
const upperBodyCurve = calculateBezierCurve(
    { x: -0.02, y: 0.5 }, // Sol üst köşe
    { x: 0.0, y: 0.52 },   // Kontrol noktası (yukarı çekildi)
    { x: 0.02, y: 0.5 }   // Sağ üst köşe
);

const lowerBodyCurve = calculateBezierCurve(
    {x: 0.02, y: -0.5}, // top right corner
    { x: -0.09, y: -0.7 }, // control point
    { x: -0.2, y: -0.5 } // top left corner
);




// -------- draw the top curve ----------------
const buffer1 = initBuffer(gl, upperBodyCurve);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer1);
gl.bufferData(gl.ARRAY_BUFFER, upperBodyCurve, gl.STATIC_DRAW);

// Link the shader attribute
const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// Set the color and draw the top Bézier curve of the body
const colorLocation = gl.getUniformLocation(program, 'u_color');
gl.uniform4f(colorLocation, 0.55, 0.27, 0.07, 1.0); // Brown
gl.drawArrays(gl.TRIANGLE_FAN, 0, upperBodyCurve.length/2);


// -------- draw the umbrella body ----------------
const buffer2 = initBuffer(gl, bodyRectangleVertices);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer2);
gl.bufferData(gl.ARRAY_BUFFER, bodyRectangleVertices, gl.STATIC_DRAW);

// Link the shader attribute
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.uniform4f(colorLocation, 0.55, 0.27, 0.07, 1.0); // Brown
gl.drawArrays(gl.TRIANGLE_STRIP, 0, bodyRectangleVertices.length / 2);


// -------- draw the lower curves ----------------
const buffer3 = initBuffer(gl, lowerBodyCurve);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer3);
gl.bufferData(gl.ARRAY_BUFFER, lowerBodyCurve, gl.STATIC_DRAW);

// Link the shader attribute again
// Link the shader attribute
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

gl.uniform4f(colorLocation, 0.55, 0.27, 0.07, 1.0); // Brown
gl.drawArrays(gl.TRIANGLE_FAN, 0, lowerBodyCurve.length/2);


function calculateBezierCurve(p0, p1, p2, numPoints = 30) {
    const vertices = [];
    for (let i = 0; i <= numPoints; i++) {
        const t = i / numPoints;
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        vertices.push(x, y);
    }
    return new Float32Array(vertices);
}

