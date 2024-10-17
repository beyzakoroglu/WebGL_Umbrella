"use strict";

main();

function main() {
    const canvas = document.querySelector('#glCanvas');
    const gl = canvas.getContext('webgl');

    if(!gl) {
        alert("Unable to initialize WebGL!");
        return;
    }

    gl.clearColor(0.0, 0.0, 0.0, 1.0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const program = initShaderProgram(gl, vertexShaderSource, fragmentShaderSource);
    gl.useProgram(program);

    // Umbrella body
    const handleBodyVertices = new Float32Array([
        -0.01, -0.5,  // bottom left corner
        0.01, -0.5,  // bottom right corner
        -0.01,  0.6,  // top left corner
        0.01,  0.6   // top right corner
    ]);

    // Bézier curve for top of the umbrella body
    const upperHandleCurve = calculateBezierCurve(
        { x: -0.01, y: 0.6 }, // top left corner
        { x: 0.0, y: 0.9 },   // control point
        { x: 0.01, y: 0.6 }   // top right corner
    );

    const umbrellaBodyVertices = new Float32Array([
        ...handleBodyVertices,
        ...upperHandleCurve
    ])

    // Initialize buffer and draw
    const buffer = initBuffer(gl, umbrellaBodyVertices);
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    const aPosition = gl.getAttribLocation(program, 'aPosition');
    gl.enableVertexAttribArray(aPosition);
    gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

    // Draw the umbrella body
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, umbrellaBodyVertices.length / 2);

}

function calculateBezierCurve(p0, p1, p2, segments = 30) {
    const vertices = [];
    for (let t = 0; t <= 1; t += 1 / segments) {
        const x = (1 - t) * (1 - t) * p0.x + 2 * (1 - t) * t * p1.x + t * t * p2.x;
        const y = (1 - t) * (1 - t) * p0.y + 2 * (1 - t) * t * p1.y + t * t * p2.y;
        vertices.push(x, y);
    }
    return vertices;
}