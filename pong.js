var canvas;
var gl;
var shaderProgram;
var aVertexPositionId;
var aVertexColorId;
var uColorPositionId;
var uResolution;
var buffer;
var scoreLeft;
var scoreRight;
var score = [0,0];
var elapsedTime = 0;
var paddleLeft = new Rectangle(10, 10, 15, 100);
var paddleRight = new Rectangle(800-10-15, 50, 15, 100);
var ball = new Ball(50, 100, 5, 16);
var middleLine = new Rectangle(399, 0, 2, 600);
var movementMatrice = [8, 3];

var VSHADER_SOURCE; 
var FSHADER_SOURCE;

var color = 0.0;

function  startup () {
    canvas = document.getElementById("gameCanvas");
    scoreLeft = document.getElementById("scoreLeft");
    scoreRight = document.getElementById("scoreRight");
    VSHADER_SOURCE = document.getElementById("shader-vs").text;
    FSHADER_SOURCE = document.getElementById("shader-fs").text;
    initGL ();
    initShaders();
    setupAttributes();
    gl.uniform2f(uResolution, canvas.width, canvas.height);
    gl.clearColor(0.3,0,0,1.0);
    setupInput();
    updateScore();
    mainLoop();
}

function updateScore() {
    scoreLeft.innerHTML = score[0];
    scoreRight.innerHTML = score[1];
}

function addScore(matrice) {
    score[0] += matrice[0];
    score[1] += matrice[1];
    updateScore();
    resetBall();
} 

function setupInput() {
    document.addEventListener('keydown', function(event) {
        if(event.keyCode == 38) {
            paddleRight.moveUp(true);
        }
        else if(event.keyCode == 40) {
            paddleRight.moveDown(true);
        }
        if(event.keyCode == 87) {
            paddleLeft.moveUp(true);
        }
        else if(event.keyCode == 83) {
            paddleLeft.moveDown(true);
        }
    });
    
    document.addEventListener('keyup', function(event) {
        if(event.keyCode == 38) {
            paddleRight.moveUp(false);
        }
        else if(event.keyCode == 40) {
            paddleRight.moveDown(false);
        }
        if(event.keyCode == 87) {
            paddleLeft.moveUp(false);
        }
        else if(event.keyCode == 83) {
            paddleLeft.moveDown(false);
        }
    });
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

    var vertices = [];
    elements = [ paddleLeft, paddleRight, ball, middleLine ];

    ball.setColor(new Color(0.0, 1.0, 0.0));
    elements.forEach(function (e) {
        vertices = vertices.concat(e.getVertices());
    });

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(vertices), gl.STATIC_DRAW);
}

function setupAttributes() {
    // finds  the  index of the  variable  in the  program
    aVertexPositionId = gl.getAttribLocation(shaderProgram , "aVertexPosition");
    aVertexColorId = gl.getAttribLocation(shaderProgram , "aVertexColor");
    uColorPositionId = gl.getUniformLocation(shaderProgram, "uColor");
    uResolution = gl.getUniformLocation(shaderProgram, "uResolution");
}

function initGL() {
    gl = createGLContext(canvas);
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    gl.bindBuffer(gl.ARRAY_BUFFER , buffer);
    // ... strike in Bytes, offset in Bytes);
    gl.vertexAttribPointer(aVertexPositionId , 2, gl.FLOAT , false , 24, 0);
    gl.vertexAttribPointer(aVertexColorId, 4, gl.FLOAT , false , 24, 8);
    gl.enableVertexAttribArray(aVertexPositionId);
    gl.enableVertexAttribArray(aVertexColorId);

    counter = 0;
    elements.forEach(function (e) {
        gl.drawArrays(e.getDrawStyle(),counter,e.getPointsCount());
        counter = counter + e.getPointsCount();
    });
}

function resetBall() {
    ball = new Ball(400, 300, 5, 16);
    movementMatrice = [Math.random()*100 % 20 - 10, Math.random()*100 % 20 - 10];
}

function mainLoop(timeStamp) {
    if(timeStamp-elapsedTime > 10) {
        color = Math.random();
        elapsedTime = timeStamp;
        checkBallPosition(); 
        paddleLeft.update();
        paddleRight.update();
        movementMatrice[0] = movementMatrice[0] + movementMatrice[0] * 0.0001;
        movementMatrice[1] = movementMatrice[1] + movementMatrice[1] * 0.0001;
        ball.move(movementMatrice);
    }
    setupBuffers();
    draw();
    window.requestAnimationFrame(mainLoop);
}

function checkBallPosition() {
    if(ball.getPositionOfMiddle()[1] > canvas.height-30 || ball.getPositionOfMiddle()[1] < 30) {
            movementMatrice[1] *= -1;
        }
        if(ball.getPositionOfMiddle()[0] > canvas.width-30) {
            if(!paddleRight.isAtPos(ball.getPositionOfMiddle()[1])) {
                addScore([0, 1]);
            }
        }
        if(ball.getPositionOfMiddle()[0] < 30) {
            if(!paddleLeft.isAtPos(ball.getPositionOfMiddle()[1])) {
                addScore([1, 0]);
            }
        }
        if(ball.getPositionOfMiddle()[0] > canvas.width-30 || ball.getPositionOfMiddle()[0] < 30) {
            movementMatrice[0] *= -1;
        }
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
