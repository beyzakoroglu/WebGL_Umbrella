const vertexShaderSource = `
    
    attribute vec4 a_position;
    
    void main() {
        gl_Position = a_position;
    }
`;

const fragmentShaderSource = `
    void main() {
        gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
    }
`;