class Jugador{
    constructor(expr, base){
        this.expr = expr;
        this.base = base;
        
        this.diff = diff(this.expr, this.base);
        this.resFraccion = solve(this.diff, this.base=='p'?'q':'p');
        this.res = toDecimal(solve(this.diff, this.base=='p'?'q':'p'));
        console.log(`${this.base}, solve: ${solve(this.diff, this.base=='p'?'q':'p')}`);
        console.log(`derivada: ${this.diff}, respuesta: ${this.res}`);

        this.arr = new Array(3);
        this.arr[0] = {val:1, oper: this.operador()};
        this.arr[1] = {val:2, oper:'='};
        this.arr[2] = {val:0, oper:this.arr[0].oper===1? 2 : 1};
        this.Dots = this.data;
    }
    operador(){
        if(isNaN(this.diff) == false &&  this.diff != '1'){
            /* para validar cuando, por ejemplo, solve(-1 = 1) = NO HAY SOLUCION */
            console.log(`(${this.diff}) no es igual a 1 ->class Player{operador()}, se retorno 0`);
            return 0;
        }
        var aux = toDecimal(solve(this.diff+"=1", this.base=='p'?'q':'p'));
        console.log(`aux: ${solve(`${this.diff}=1`, this.base=='p'?'q':'p')}`);
        console.log(`${aux} > ${this.res}?`);
        return aux > this.res? 1:2;
        //mayor 1 menor 2
        //return aux > this.res? '>':'<';
    }
    get data(){
        var dots = [];
        console.log(this.arr);
        if(this.res >= 0 && this.res <= 1){
            if(this.base === 'q'){
                /*se derivo en base a Q por lo tanto la condicional sera con P*/
                if(this.arr[0].oper === 2){
                    /*si es menor se pínta arriba*/
                    console.log('q->menor');
                    return [{x:0,y:1.00},{x:this.res,y:1.00},{x:this.res,y:0},{x:1.00,y:0}];
                }else{
                    /*si es mayor se pinta abajo*/
                    console.log('q->mayor');
                    return [{x:0,y:0},{x:this.res,y:0},{x:this.res,y:1.00},{x:1.00,y:1.00}];
                }
            }
            if(this.base === 'p'){
                /*se derivo en base a P por lo tanto la condicional sera con Q*/
                if(this.arr[0].oper === 2){
                    /*si es menor se pínta izquierda*/
                    console.log('p->menor');
                    return [{x:0,y:1},{x:0,y:this.res},{x:1.00,y:this.res},{x:1.00,y:0}];
                }else{
                    /*si es mayor se pinta derecha*/
                    console.log('p->mayor');
                    return [{x:0,y:0},{x:0,y:this.res},{x:1.00,y:this.res},{x:1.00,y:1.00}];
                }
            }
        }else{
            if(this.base === 'p'){
                for(let i = 0; i < this.arr.length; i++){
                    if(this.arr[i].oper === 2){
                        return [{x:parseFloat(this.arr[i].val),y:0},{x:parseFloat(this.arr[i].val),y:1.00}];
                    }
                }
            }
            if(this.base === 'q'){
                for(let i = 0; i < this.arr.length; i++){
                    if(this.arr[i].oper === 2){
                        return [{x:0,y:parseFloat(this.arr[i].val)},{x:1,y:parseFloat(this.arr[i].val)}];
                    }
                }
            }
        }
    }
}