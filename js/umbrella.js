const canvas = document.querySelector('canvas');
const gl = canvas.getContext('webgl2');

gl.viewport(0, 0, canvas.width, canvas.height);
gl.clearColor(1.0, 1.0, 0.7, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT);

// Create shader program
const program = createShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
gl.useProgram(program);

// Umbrella body
const handleBodyVertices = new Float32Array([
    -0.01, -0.5,  // bottom left corner
    0.01, -0.5,  // bottom right corner
    -0.01,  0.6,  // top left corner
    0.01,  0.6   // top right corner
]);

// Initialize buffer and store the data
const buffer = initBuffer(gl, handleBodyVertices);
gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
gl.bufferData(gl.ARRAY_BUFFER, handleBodyVertices, gl.STATIC_DRAW);

// Link the shader attribute
const positionLocation = gl.getAttribLocation(program, 'a_position');
gl.enableVertexAttribArray(positionLocation);
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);

// A triangle strip is used to draw the handle as a rectangle
const colorLocation = gl.getUniformLocation(program, 'a_color');
gl.uniform4f(colorLocation, 0.55, 0.27, 0.07, 1.0); // Brown
gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
gl.drawArrays(gl.TRIANGLE_STRIP, 0, handleBodyVertices.length / 2);

