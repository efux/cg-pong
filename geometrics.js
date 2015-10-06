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
}

function Rectangle(x, y, width, height) {
    this.points = [new Point(x, y),
                    new Point(x+width, y),
                    new Point(x+width, y+height),
                    new Point(x, y+height)];
    this.height = height;

    this.getVertices = function() {
        var retVal = [];
        this.points.forEach(function (p) {
            retVal = retVal.concat(p.getPointList());
        });
        return retVal;
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

    this.isAtPos = function(yPos) {
        if(yPos > this.getPositionOfMiddle()[1]-this.height/2 && yPos < this.getPositionOfMiddle()[1]+this.height/2) {
            return true;
        }
        return false;
    }

    this.moveDown = function() {
        this.move([0, 20]);
    }

    this.moveUp = function() {
        this.move([0, -20]);
    }

    this.getPointsCount = function() {
        return this.points.length;
    }
}
