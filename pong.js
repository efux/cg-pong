var canvas;
var gl;
var shaderProgram;
var  aVertexPositionId;
var buffer;

var VSHADER_SOURCE = 
"attribute  vec2  aVertexPosition;" +
"void  main() {" +
"     vec4  position = vec4(aVertexPosition , 0.0, 1.0);" +
"     gl_Position = position;" +
"}";
var  FSHADER_SOURCE =
"precision  mediump  float;"+
"void  main() {"+
"      gl_FragColor = vec4(0.0, 1.0, 0.0, 1.0);"+
"}";

function  startup () {
    canvas = document.getElementById("gameCanvas");
    initGL ();
    initShaders();
    setupAttributes();
    setupBuffers();
    gl.clearColor(255,0,0,1.0);
    draw();
}

function  createGLContext(canvas) {
    // get  the gl  drawing  context
    var  context = canvas.getContext("webgl");
    if (! context) {
        alert("Failed  to  create  GL  context");
    }
    return WebGLDebugUtils.makeDebugContext(context);
}

function setupBuffers() {
    buffer = gl.createBuffer();
    
    var vertices = [
        -0.5, 0.5,
        0.5, 0.5,
        0.5,-0.5,
        -0.5, -0.5
    ];
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function setupAttributes() {
    // finds  the  index of the  variable  in the  program
    aVertexPositionId = gl.getAttribLocation(shaderProgram , "aVertexPosition");
}

function initGL() {
    gl = createGLContext(canvas);
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER , buffer);
    gl.vertexAttribPointer(aVertexPositionId , 2, gl.FLOAT , false , 0, 0);
    gl.enableVertexAttribArray(aVertexPositionId);

    gl.drawArrays(gl.TRIANGLE_FAN,0,4);
}

function initShaders() {
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader, VSHADER_SOURCE);
    gl.compileShader(vertexShader);
    if(!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
        alert("Shader Error: " + gl.getShaderInfoLog(vertexShader));
        return;
    }

    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader, FSHADER_SOURCE);
    gl.compileShader(fragmentShader);
    if(!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
        alert("Shader Error: " + gl.getShaderInfoLog(fragmentShader ));
        return;
    }

    shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);

    if(!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
        alert("Failed to setup shader");
        return;
    }
    gl.useProgram(shaderProgram);
}
