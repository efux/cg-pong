function Color(rV, gV, bV) {
    this.r = rV;
    this.g = gV;
    this.b = bV;
    this.alpha = 1.0;
}

function Point(x, y) {
    this.pos = [x, y];
    this.color = new Color(1.0, 1.0, 1.0);

    this.getPointList = function() {
        return [this.pos[0], this.pos[1], this.color.r, this.color.g, this.color.b, this.color.alpha];
    }

    this.setColor = function(color) {
        this.color = color;
    }

    this.move = function(matrice) {
        this.pos[0] = this.pos[0] + matrice[0];
        this.pos[1] = this.pos[1] + matrice[1];
    }

    this.rotate = function(angle) {
        old_x = this.pos[0];
        old_y = this.pos[1];

        this.pos[0] = old_x*Math.cos(angle) - old_y * Math.sin(angle);
        this.pos[1] = old_x*Math.sin(angle) + old_y * Math.cos(angle);
    }
}

function Figure() {
    this.points = [];
    this.getVertices = function() {
        var retVal = [];
        this.points.forEach(function (p) {
            retVal = retVal.concat(p.getPointList());
        });
        return retVal;
    }
    
    this.getPositionOfMiddle = function() {
        x = 0;
        y = 0;
        this.points.forEach(function(p) {
           x += p.pos[0];
           y += p.pos[1];
        });
        x /= this.points.length;
        y /= this.points.length;
        return [x,y];
    }
    
    this.setColor = function(color) {
        this.points.forEach(function(p) {
            p.setColor(color);
        });
    }
    
    this.move = function(matrice) {
        this.points.forEach(function(p) {
           p.move(matrice); 
        });
    }
    
    this.getPointsCount = function() {
        return this.points.length;
    }
    
    this.isAtPos = function(yPos) {
        if(yPos > this.getPositionOfMiddle()[1]-this.height/2 && yPos < this.getPositionOfMiddle()[1]+this.height/2) {
            return true;
        }
        return false;
    }

    this.getDrawStyle = function() {
        return gl.TRIANGLE_FAN;  
    }
}

function Rectangle(x, y, width, height) {
    this.points = [new Point(x, y),
                    new Point(x+width, y),
                    new Point(x+width, y+height),
                    new Point(x, y+height)];
    this.height = height;
    this.moveDownState = false;
    this.moveUpState = false;
    this.verticalSpeed = 5;

    this.moveDown = function(b) {
        this.moveDownState = b;
    }

    this.moveUp = function(b) {
        this.moveUpState = b;
    }

    this.update = function() {
        if(this.moveUpState) {
            this.move([0, -1 * this.verticalSpeed]);
        } else {
            if(this.moveDownState) {
                this.move([0, this.verticalSpeed]);
            }
        }
    }
}

function Ball(x, y, radius, countPoints) {
    this.points = [new Point(0,0)];

    for(i = 0; i <= countPoints; i++) {
        p = new Point(0, radius);
        p.rotate(i*2*Math.PI/countPoints);
        this.points.push(p);
    }

    this.move([x, y]);
}

Ball.prototype = new Figure();
Ball.prototype.constructor = Ball;

Rectangle.prototype = new Figure();
Rectangle.prototype.constructor = Rectangle;
