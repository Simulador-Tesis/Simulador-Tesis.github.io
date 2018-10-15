
/*-------------------------- SVG ------------------------------*/
    const palette = {
        "lightgray": "#819090",
        "gray": "#708284",
        "mediumgray": "#536870",
        "darkgray": "#475B62",

        "darkblue": "#0A2933",
        "darkerblue": "#042029",

        "paleryellow": "#FCF4DC",
        "paleyellow": "#EAE3CB",
        "yellow": "#A57706",
        "orange": "#BD3613",
        "red": "#D11C24",
        "pink": "#C61C6F",
        "purple": "#595AB7",
        "blue": "#2176C7",
        "green": "#259286",
        "yellowgreen": "#738A05"
    };


    class Tree {
        constructor(ENES,simbolo,matriz,vis){
            this.nPeriodos=ENES.nPer;
            this.nDecimales = parseInt(ENES.nDec);
            this.simbolo=simbolo;
            this.matriz=matriz;

            this.tama_fuente=1; //Tamaño de fuente en 'em' 1em = 12 pt se escala asi que 0.5em = 6pt
            this.tama_fuente+="em";
            this.grosor_linea=2;
            this.circleWidth=36;
            var ANCHO=this.nPeriodos*160;
            var ALTO=(this.nPeriodos*(this.nPeriodos<=2?320:160));

            this.vis=vis.attr("width",ANCHO)
                .attr("height",ALTO+100);

            this.cols=this.nPeriodos+1;
            this.tam_col=ANCHO/this.cols;
            this.filas=this.nPeriodos+1;
            this.tam_filas=ALTO/this.filas;

            this.nodes=[];
            this.links=[];

            this.Create();
        }

        Create(){
            this.CreateNodes();
            this.CreateLinks();
        }

        Draw() {
            this.DrawLines();
            this.DrawCircles();
            this.DrawText();
            this.DrawSubText();
        }

        CreateNodes(){
            console.log(this.matriz);
            for(var i=0;i<this.cols;i++){
                for(var j=0;j<this.filas;j++){
                    if(j>=(this.matriz[i].length))
                        break;


                    var sign="";

                    if(this.simbolo=="--"){
                        sign="";
                    }else{
                        if(i==0){
                            "";
                        }else{
                            switch(j){
                                case 0:sign=this.simbolo+"\u207A";break;
                                case i:sign=this.simbolo+"\u207B";break;
                                default:sign=this.simbolo+"\u207A \u207B";break;
                            }
                        }
                    }
                    if(this.matriz[this.nPeriodos].length==1){
                        this.nodes.push({
                            "name": toNumber(this.matriz[i][j],this.nDecimales),
                            signo: "",
                            x:	i*(this.tam_col)+(this.tam_col/2),
                            y:	(this.tam_filas)*(3)
                        });
                    }else{
                        this.nodes.push({
                            "name": toNumber(this.matriz[i][j],this.nDecimales),//texto que tendra dentro de circulo
                            signo: sign,//signo del Simbolo abajo del circulo
                            x:	i*(this.tam_col)+(this.tam_col/2),//posicion en x
                            y:	((this.tam_filas)*j+(this.tam_filas/2)+(this.nPeriodos-i)/2*this.tam_filas)+100//posicion en y
                        });
                    }

                }
            }


            console.log(this.nodes);
        }

        CreateLinks(){
            var column=1;
            var row=0;
            var i=0;
            while(column!=this.nPeriodos+1){
                if(this.matriz[this.nPeriodos].length!==1){
                    this.links.push({
                        source:this.nodes[i],
                        target:this.nodes[i+column]
                    });
                    this.links.push({
                        source:this.nodes[i],
                        target:this.nodes[i+column+1]
                    });
                }
                else{
                    if(i+1>=this.nodes.length)
                        break;
                    this.links.push({
                        source:this.nodes[i],
                        target:this.nodes[i+1]
                    });
                }
                i++;
                row++;
                if(row>=column){
                    column++;
                    row=0;
                }

            }
            console.log(this.links);
        }

        DrawLines(){
            /*dibujar Lineas*/
            if (this.matriz[this.nPeriodos].length == 2) {
                this.vis.selectAll(".line")
                    .data(this.links)
                    .enter()
                    .append("line")
                    .attr("x1", function (d) {
                        return d.source.x
                    })
                    .attr("y1", function (d) {
                        return d.source.y
                    })
                    .style("stroke", "black")
                    .style("stroke-width", this.grosor_linea);
            }
            else {

                this.vis.selectAll(".line")
                    .data(this.links)
                    .enter()
                    .append("line")
                    .attr("x1", function (d) {
                        return d.source.x
                    })
                    .attr("y1", function (d) {
                        return d.source.y
                    })
                    .attr("x2", function (d) {
                        return d.target.x
                    })
                    .attr("y2", function (d) {
                        return d.target.y
                    })
                    .style("stroke", "black")
                    .style("stroke-width", this.grosor_linea);
            }
        }

        DrawCircles(){
            /*dibujar circulos*/
            this.vis.selectAll("circle .nodes")
                .data(this.nodes)
                .enter()
                .append("svg:circle")
                .attr("class", "nodes")
                .attr("cx", function (d) {
                    return d.x;
                })
                .attr("cy", function (d) {
                    return d.y;
                })
                .attr("r", (this.circleWidth)+"px")
                .attr("fill", "white")
                .attr("stroke", "black")
                .style("stroke-width", this.grosor_linea);
        }

        DrawText(){
            /*dibujar valores*/
            this.vis.selectAll("circle .nodes")
                .data(this.nodes)
                .enter().append("g")
                .attr("class", "node")
                .append("text")
                .text(function (d) {
                    return d.name;
                })
                .attr("x", function (d) {
                    return d.x;
                })
                .attr("y", function (d) {
                    return (d.y + 5);
                })
                .attr("font-family", "Bree Serif")
                .attr("fill", palette.purple)
                .attr("font-size", this.tama_fuente)
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold");
        }

        DrawSubText(){
            /*dibujar subindices S o C dependiendo del arbol*/

            var superThis=this;
            this.vis.selectAll("circle .nodes")
                .data(this.nodes)
                .enter().append("g")
                .attr("class", "node")
                .append("text")
                .text(function (d) {
                    return d.signo;
                })
                .attr("x", function (d) {
                    return d.x
                })
                .attr("y", function (d) {
                    return (d.y + superThis.circleWidth + 18);
                })
                .attr("font-family", "Bree Serif")
                .attr("fill", palette.purple)
                .attr("font-size", "1.25em")
                .attr("text-anchor", "middle")
                .attr("font-weight", "bold");
        }

    }

    class Matrix{
        constructor(canvas,x,y,w,h,esp,obj){
            this.canvas=canvas;
            this.h=parseFloat(h);
            this.w=parseFloat(w);
            this.x=parseFloat(x)+parseFloat(esp);
            this.x2=parseFloat(x)+parseFloat(esp)+parseFloat(w);
            this.y2=parseFloat(y);
            this.y=parseFloat(y)-parseFloat(h);
            this.obj=obj;
        }
        DrawText(AnguloHorario,texto,fontSize,x,y){
            this.canvas.append("text").attr("text-anchor","middle").
            attr('transform','translate('+x+','+y+') rotate('+AnguloHorario+')').
            attr('fill',"black").attr('font-family','sans-serif').attr("font-size",fontSize).html(texto);//0.75em out
        }
        DrawRectangle(x,y,opacity,borderColor="purple",fill="black",rx=1,ry=1,clase="",link=""){
            this.canvas.append("rect").attr("x", x).attr("y", y).
            attr("width", this.w).attr("height", this.h).attr("fill-opacity", opacity).attr("stroke", borderColor).
            attr('fill',fill).attr("rx",rx).attr("ry",ry).attr('class',clase).attr('link',link);
            //console.log("owner: Daniel Muñoz Ramos");
        }
        DrawSquare(index){
            var arr =[];
            for(let i=0;i<4;i++){
                var y = (i<2?this.y:this.y2);
                var x = (i%2?this.x2:this.x);
                var a = this.obj[index][i][0], b = this.obj[index][i][1];
                if(a.bool===true&&b.bool===true) {
                    this.DrawRectangle(x,y,0.2);
                }
                else{
                    this.DrawRectangle(x,y,0);
                }
                this.DrawText(0,`${a.value},${b.value}`,"1em",x + this.w / 2,y + (this.h / 2) + 5);
                arr.push({x:a.value,y:b.value});
            }
            //console.log(arr);
            return arr;
        }
        DrawScenarios(){
            /*los de la izquerda*/
            this.DrawText(-90,"Invertir","0.75em",this.x-3,this.y2-(this.h/2));//($this,this.x-3,this.y2-(this.h/2),"Invertir", "middle", -90);
            this.DrawText(-90,"Abandonar","0.75em",this.x-3,this.y2+(this.h/2));//($this,this.x-3,this.y2+(this.h/2),"Abandonar", "middle", -90);
            /*los de arriba*/
            this.DrawText(0,"Invertir","0.75em",this.x+(this.w/2),this.y2-this.h-3);//($this,this.x+(this.w/2),this.y2-this.h-3,"Invertir", "middle", 0);
            this.DrawText(0,"Abandonar","0.75em",this.x+this.w+(this.w/2),this.y2-this.h-3);//($this,this.x+this.w+(this.w/2),this.y2-this.h-3,"Abandonar", "middle", 0);
        }
        DrawButtonMixtas(p){
            var str = (function(){
                var aux ="";
                for(let i=0;i<p.length;i++){
                    if(i>0)aux+=',';
                    aux+=`${p[i].x},${p[i].y}`; 
                }
                return aux;
            })();
            this.DrawRectangle(this.x + this.w * 2 + 15, this.y2 - this.h / 2, 1, "black","white",20,20,`goMixtas`,str);
            this.DrawText(0,"Mixtas","1em",this.x + (this.w*2) + 15 + (this.w/2),this.y2+4);
        }
        DrawMatrix(index){
            this.DrawText(0,"Jugador 2","0.75em",this.x + this.w,this.y - 20);//Matriz.TextoRotado($this,this.x + this.w, this.y - 20, "Jugador 2", "middle", 0);
            this.DrawText(-90,"Jugador 1","0.75em",this.x - 20,this.y2);//Matriz.TextoRotado($this,this.x - 20, this.y, "Jugador 1", "middle", -90);
            var points = this.DrawSquare(index);
            //console.log(points);
            this.DrawScenarios();
            //this.DrawButtonMixtas(points);
        }
    }

    class MatrixCollection{
        constructor(canvas,obj,nPeriodos,vis){
            this.w = 77;
            this.h = 47;
            this.espacio = 110;
            this.Marray=[];
            this.canvas=canvas;
            this.obj=obj;
            this.canvas.width(function(){return $(this).width()+500;});
            this.nPeriodos=nPeriodos;
            this.longitud = this.canvas.children('circle').length;
            this.vis=vis;
            this.BuildAll();
        }
        BuildAll(){
            var xC=0,yC=0;
            var superThis=this;
            var posicion=0;
            this.canvas.children('circle').each(function(index){
                if(superThis.longitud === (superThis.nPeriodos+1)){
                    var $$this = superThis.canvas.children('circle').last();
                    var x = $$this.attr('cx'), y = $$this.attr('cy');
                    superThis.Marray.push(new Matrix(superThis.vis,x,y,superThis.w,superThis.h,superThis.espacio,superThis.obj));
                    return false;
                    /*esto es para romper el each del jquery, si solo se pone return es para pasar a la siguiente iteracion*/
                }
                if(index >= superThis.longitud-(superThis.nPeriodos+1)){

                    var x = $(this).attr('cx'), y = $(this).attr('cy');

                    xC=parseInt(x)+superThis.espacio+(superThis.w*2);
                    yC=parseInt(y);
                    superThis.Marray.push(new Matrix(superThis.vis,x,y,superThis.w,superThis.h,superThis.espacio,superThis.obj));
                    //this.canvas.
                    posicion++;
                }
            });
        }
        DrawAll(){
            this.Marray.forEach(function(matrix,index){
                matrix.DrawMatrix(index);
            });
        }
    }