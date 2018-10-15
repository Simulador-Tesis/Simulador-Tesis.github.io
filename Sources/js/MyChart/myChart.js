class myChart{
    constructor(svg, obj, attr){
        this.svg = svg;
        $(this.svg).empty();
        this.svg.setAttribute('width', obj.size || 650);
        this.svg.setAttribute('height', obj.size || 650);
        this.steps = obj.steps || 10;
        this.espx = this.Height / ((this.Step) + 2);
        this.espy = this.Width / ((this.Step) + 2);
        this.increment = obj.increment || 0.1;
        this.attr = attr || {};
        this.text = (attr)? attr.text : {};
        this.axis = (attr)? attr.axis : {};
        this.Axis();
        this.AxisBackground();
        this.arrX = this.arrAxis('y');
        this.arrY = this.arrAxis('x');
    }
    get Width(){
        return this.svg.getAttribute('width');
    }
    get Height(){
        return this.svg.getAttribute('height');
    }
    get Step(){
        return this.steps || 10;
    }
    get x(){
        return 1;
    }
    get y(){
        return 0;
    }
    Axis(){
        var labely = parseFloat(this.Step *this.increment);
        //var labely = parseFloat(0);
        var labelx = parseFloat(0);

        for(let i = 1; i <= this.Step + 1; i++){
            /* lineas para eje Y */
            this.append(line(
                {
                    x1: this.espx - 4,
                    y1: this.espy * i,
                    x2: this.espx + 4,
                    y2: this.espy * i
                }
            ));
            /* lineas para eje X */
            this.append(line(
                {
                    x1: this.espx * i,
                    y1: this.Height - this.espy - 4,
                    x2: this.espx * i,
                    y2: this.Height - this.espy + 4
                }
            ));
        
            /* texto para eje Y */
            this.append(text(
                {
                    x: this.espx - 10,
                    y: this.espy * i + 3,
                    //y: this.Height - (this.espy * i),
                    val: labely.toFixed(2),
                    textAnchor:'end',
                    fontSize: this.text.fontSize || 18
                }
            ));
            /* texto para eje X */
            this.append(text(
                {
                    x: this.espx * i,
                    y: this.Height - this.espy + 20,
                    val: labelx.toFixed(2),
                    textAnchor:'middle',
                    fontSize: this.text.fontSize || 18
                }
            ));

            labely -= this.increment;
            //labely += this.increment;
            labelx += this.increment;
        }

        /* eje Y */
        this.append(line(
            {
                x1: this.espx,
                y1: this.espy - (this.espy / 2),
                x2: this.espx,
                y2: this.Height - this.espy,
                strokeWidth: this.axis.strokeWidth || 1.8
            }
        ));
        /* eje X */
        this.append(line(
            {
                x1: this.espx,
                y1: this.Height - this.espy,
                x2: this.Width - this.espx + (this.espx / 2),
                y2: this.Height - this.espy,
                strokeWidth: this.axis.strokeWidth || 1.8
            }
        ));
        
    }
    AxisBackground(){
        for(let i = 2; i <= this.Step + 1; i++){
            this.append(line(
                {
                    x1: this.espx * i,
                    y1: this.espy - (this.espy / 2),
                    x2: this.espx * i,
                    y2: this.Height - this.espy,
                    stroke: 'grey',
                    strokeOpacity: 0.6
                }
            ));
            this.append(line(
                {
                    x1: this.espx,
                    y1: this.Height - this.espy * i,
                    x2: this.Width - this.espx + (this.espx / 2),
                    y2: this.Height - this.espy * i,
                    stroke: 'grey',
                    strokeOpacity: 0.6
                }
            ));
        }
    }
    append(string = '<text x="0" y="15" fill="red">ERROR</text>'){
        this.svg.insertAdjacentHTML('beforeend', string);
    }
    arrAxis(axis = 'y'){
        var arr = $(this.svg).children('text');
        var aux = [];
        for(let i = 0; i < arr.length; i++){
            if((axis === 'y') && (i % 2 != 0)){
                aux.push({x:parseFloat(arr[i].getAttribute('x')), y:parseFloat(arr[i].getAttribute('y')), val: $(arr[i]).html()});
            }
            if((axis === 'x') && (i % 2 == 0)){
                aux.push({x:parseFloat(arr[i].getAttribute('x')), y:parseFloat(arr[i].getAttribute('y')), val: $(arr[i]).html()});
            }
        }
        return (axis === 'x')? aux.reverse() : aux;
    }
    coordinateX(arr, coordinate, axis){
        //console.log('coordinateX : ' + parseFloat(coordinate));
        var P = 0;
        for(let i = 0; i < arr.length - 1; i++){
            //console.log(arr[i].val);
            if(coordinate>=arr[i].val && coordinate<=arr[i+1].val){
                P = (axis === 1)? arr[i].x : arr[i].y;
                //console.log("P: " + P);
                break;
            }
        }
        return P;
    }
    stepPorcentageX(coordinate, esp, origin){
        if(coordinate === 0){
            return origin;
        }
        var aux = (coordinate * 10) - Math.floor(coordinate * 10);
        var pos = 0;
        if(aux === 0){
            pos = origin + esp;
        }
        else{
            pos = parseFloat(origin + (esp * aux)).toFixed(5);
        }
        return pos;
    }
    stepPorcentageY(coordinate, esp, origin){
        if(coordinate === 0){
            return origin;
        }
        var aux = (coordinate * 10) - Math.floor(coordinate * 10);
        var pos = 0;
        if(aux === 0){
            pos = origin - esp;
        }
        else{
            pos = parseFloat(origin - (esp * aux)).toFixed(5);
        }
        return pos;
    }
    pos(P, arr, esp, axis){
        var origin = this.coordinateX(arr, P, axis);
        //console.log(origin);
        var pos = axis===0? this.stepPorcentageY(P,esp,origin) : this.stepPorcentageX(P,esp,origin);
        //console.log(pos);
        return pos;
    }
}

function drawLines(d, array, obj){
    for(let i = 0; i < array.length - 1; i++){
        d.append(line(
            {
                x1: d.pos(array[i].x, d.arrX, d.espx, d.x),
                y1: d.pos(array[i].y, d.arrY, d.espy, d.y) - 2,
                x2: d.pos(array[i+1].x, d.arrX, d.espx, d.x),
                y2: d.pos(array[i+1].y, d.arrY, d.espy, d.y) - 2,
                stroke: obj.stroke || 'black',
                strokeWidth: obj.strokeWidth || 1
            }
        ));
    }
}
