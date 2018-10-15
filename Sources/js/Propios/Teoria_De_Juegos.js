function toNumber(value, nDecimales){
    if(isNaN(value)){
        console.log("Float: el valor no es un numero se devolvera -3 en vez de: "+value);
        return 'No hay valor';
    }
    else {
        if (value === 0)
            return 0;
        else if (nDecimales <= 0 || isNaN(nDecimales)) {
            //console.log("metodo toNumber: hubo problema con Ndecimales o ignore si son cero decimales");
            return Math.round(value);
        }
    }
    return parseFloat(value).toFixed(nDecimales);
}

function ExtraerPtsEquilibrio(vec){
    var aux = [], cont = 0;
    vec.forEach(function(element, indexI){
        element.forEach(function(el, indexJ){
            if(el[0].bool && el[1].bool) {
                aux.push({jugador1: el[0].value, jugador2: el[1].value});
                //cont++;
            }
        });
    });
    return aux;
}

function ExtraerPtsEquilibrioPlayer(vecOfclass, numPlayer){
    var aux = [];
    vecOfclass.forEach(function(element){
       switch (numPlayer){
           case 1:
               aux.push(element.jugador1);
               break;
           case 2:
               aux.push(element.jugador2);
               break;
           default:
               console.log("JUGADOR NO ENCONTRADO (numPlayer = SOLO HAY 1 Y 2) - switch:ExtraerPtsEquilibrioPlayer(..)");
               break;
       }
    });
    return aux;
}

function ListaMatriz(vec, prejer, NPV1, NPV2){
    var lista = new Array(vec.length);

    for(var i=0;i<lista.length;i++){
        lista[i]=new Array(4);
        for(var j=0;j<lista[i].length;j++){
            lista[i][j]=new Array(2);
            switch (j){
                case 0:
                    lista[i][j][0]={ "value":toNumber(vec[i]*NPV1-prejer,0), "bool":false };
                    lista[i][j][1]={ "value":toNumber(vec[i]*NPV2-prejer,0), "bool":false };
                    break;
                case 1:
                    lista[i][j][0]={ "value":toNumber(vec[i]-prejer,0), "bool":false };
                    lista[i][j][1]={ "value":0, "bool":false};
                    break;
                case 2:
                    lista[i][j][0]={ "value":0, "bool":false };
                    lista[i][j][1]={ "value":toNumber(vec[i]-prejer,0), "bool":false };
                    break;
                case 3:
                    lista[i][j][0]={ "value":0, "bool":false };
                    lista[i][j][1]={ "value":0, "bool":false };
                    break;
                default:
                    console.log("ocurrio un problema en teoria de juegos (switch linea: 19)");
                    break;
            }
        }

    }
    return lista;
}
function PuntoEquilibrio(vec){
	var equi1=-1;
    vec.forEach(function(element){
        for(let i=0;i<element.length;i+=2){
            let aux1 = element[i][1].value;
            let aux2 = element[i+1][1].value;

            if(aux1>aux2){ 
				element[i][1].bool=true;
			}
            else if(aux1<aux2){ 
				element[i+1][1].bool=true;
			}
            else if(aux1===aux2){
                element[i][1].bool=true;
                element[i+1][1].bool=true;
            }
        }

        for(let i=0;i<element.length/2;i++){
            let aux1 = element[i][0].value;
            let aux2 = element[i+2][0].value;

            if(aux1>aux2) element[i][0].bool=true;
            else if(aux1<aux2) element[i+2][0].bool=true;
            else if(aux1===aux2){
                element[i][0].bool=true;
                element[i+2][0].bool=true;
            }
        }
    });
}

function iframesTeoriaJuegos(arbol, simbolo, method, $this, ptsEquilibrio){

    localStorage.setItem("arbol",JSON.stringify(arbol));
	var ENES = JSON.parse(localStorage.getItem("NPeriodos_NDecimales"));
	var nPeriodos=ENES.nPer;
    if(typeof ptsEquilibrio === 'undefined' || ptsEquilibrio === ''){
        localStorage.setItem("mostrar_matriz",JSON.stringify(false));
    }else{
        localStorage.setItem("ptEquilibrio",JSON.stringify(ptsEquilibrio));
        localStorage.setItem("mostrar_matriz",JSON.stringify(true));
    }
    localStorage.setItem("simbolo",JSON.stringify(simbolo));
	var height=nPeriodos*(nPeriodos<=2?360:220);
	if(arbol[nPeriodos].length==1){
		height=360;
	}
    switch (method){
        case 'iframe':
            $this.attr("src","../../../Test-Graph.html");
            $this.show();
            break;
        case 'object':
            $('#ver-arbol').html('<object id="object_arbol" data="Sources/Html/Test-Graph.html" width="100%" height="'+height+'">');
            $('#ver-arbol').show();
            break;
        default:
            console.log("No hay contenido para mostrar - switch:iframesTeoriaJuegos(...)");
    }
}

function ExtraerPtsEquilibrioAUX(vec){
    /*esto es hasta saber que hacer cuando hay mas de 1 punto de equilibrio*/
    var aux = [], cont = 0;
    vec.forEach(function(element, indexI){
        element.forEach(function(el, indexJ){
            if(el[0].bool && el[1].bool && cont === 0) {
                aux.push({jugador1: el[0].value, jugador2: el[1].value});
                cont++;
            }
        });
        cont = 0;
    });
    return aux;
}
//function AjaxLikeIframe($this, arbol)