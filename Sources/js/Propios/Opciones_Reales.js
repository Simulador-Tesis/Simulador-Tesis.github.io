	function OptionDecisions($this){
		if(EmptyORisNaN($this.val())){
			console.log("el valor del input con id: "+$this.attr('id')+" no tiene valor valido_function OptionDecisions");
			return -3;
		}
		switch($this.parent().children('.options').children('button').children('label').html()){
			case 'Porcentaje':
				return parseFloat($this.val()) / 100;
			case 'Valor':
				return parseFloat($this.val());
			case 'Dias':
				return parseFloat($this.val()) / 365;
			case 'Semanas':
				return parseFloat($this.val()) / 52.1429;/*nDiasAño / nDiasSem*/
			case 'Meses':
				return parseFloat($this.val()) / 12;
			case 'Años':
				return parseFloat($this.val());
			default:
				console.log('Hubo un problema al saber el html de un DropDownList');
				return parseFloat($this.val());
		}
	}

	function EmptyORisNaN(value){
		if(typeof value === 'undefined'){
			console.log("El valor de EmpyORisNaN es Undefined");
			return true;
		}else{
            if(value.length <= 0){
                console.log("El valor de EmpyORisNaN esta vacio");
                return true;
			}else if(isNaN(value)){
                console.log("El valor de EmpyORisNaN no es un numero");
                return true;
			}
		}
		return false;
	}

	function Inner_HTML_Tabla(vec2, longitud){
			var contenido="";
			var vec=rellenar_tabla(vec2);			

			for(var i=0;i<longitud;i++){
				contenido+="<tr>"
				for(var j=0;j<vec.length;j++){
					contenido+="<td>"+vec[j][i]+"</td>";
				}

				contenido+="</tr>"
			}
			return contenido;
	}

	function generarArbol(vec, n,nombre){
		/*colocar una matriz en un tabla para luego colocarla en html*/
		document.getElementById(nombre).innerHTML=Inner_HTML_Tabla(vec,vec[n].length*2-1);
	}

	function rellenar_tabla(vec){
		var matriz=new Array(vec.length);
		
		for(var i=0;i<matriz.length;i++){
			matriz[i]=new Array(2*(vec.length-1)+1);
			var n=0;
			var per=matriz.length-1-i;
			for(var j=0;j<matriz[i].length;j++){
				
				if(j==per){
						var aux=j;
					var s=false;
					n=0;
					for(var k=0;k<vec[i].length+i;k++){
						if(!s){
							matriz[i][j+k]=vec[i][n];
							aux++;
							n++;
							s=!s;
						}else{
							matriz[i][j+k]=" ";
							aux++;
							s=!s;
							
						}
						
					}
					j=aux-1;
				}else{
					matriz[i][j]=" ";
				}
				
			}
		}
		return matriz;
	}

    function lup2(periodo, array, p, q, n, R){
        if(array[periodo].length==1){
			array[periodo+1]=new Array(array[periodo].length);
		}else{
			array[periodo+1]=new Array(array[periodo].length-1);
		}
        if(periodo==n-1){
            array[periodo+1][0]=(p*array[periodo][0]+q*array[periodo][1])/R;
            return;

        }

        for(var i=0;i<array[periodo+1].length;i++){
            array[periodo+1][i]=((p*array[periodo][i]+q*array[periodo][i+1])/R);

        }
        lup2(periodo+1,array,p,q,n,R);
    }
	
	function valor_Opcion(vec, n, array, p, q, R, prejer){
		/*periodo = 0, n=4*/
		array[0]=new Array(vec.length);
		if(typeof prejer !== 'undefined'){
			for(var i = 0; i<vec.length; i++){
				array[0][i]=vec[i]-prejer;
				if(array[0][i]<0)
					array[0][i]=0;
			}
		}else{
            for(var i = 0; i<vec.length; i++){
                array[0][i]=vec[i];
            }
		}
		
		lup2(0,array, p, q, n, R);
		array.reverse();
	}

	Array.prototype.unique = function() {
		//FILTRAR VALORES REPETIDOS DE UN VECTOR
		var el = this.concat().sort();
	    for (var i = 1; i < el.length; ) {
	        if (toNumber(el[i-1], 1) === toNumber(el[i], 1))
	            el.splice(i,1);
	        else
	            i++;
	    }
	    return el;
	};

	function lup (periodo, vec, n, u, d){
		if(periodo===n){
            //if(u !== 1 && d !== 1) {
                vec[periodo] = vec[periodo].unique();
                vec[periodo].sort(function (a, b) { return b - a });
            //}
			return;
		}
		var new_vals=new Array();
		for (var i = 0; i < vec[periodo].length; i++) {
			new_vals.push(vec[periodo][i]*u);
			new_vals.push(vec[periodo][i]*d);
		}
		new_vals=new_vals.unique();
		vec[periodo+1]=new Array(new_vals.length);
		for(var i=0;i<new_vals.length;i++){
			vec[periodo+1][i]=new_vals[i];
			vec[periodo+1][i+1]=new_vals[i];
		}
		/*
		vec[periodo+1]=new Array(vec[periodo].length*2);
		//alert(vec[periodo+1].length);
		for (var i = 0; i < vec[periodo].length; i++) {
			vec[periodo+1][i*2]=vec[periodo][i]*u;
			vec[periodo+1][i*2+1]=vec[periodo][i]*d;
		}*/
		//if(u !== 1 && d !== 1) {
            vec[periodo] = vec[periodo].unique();
            vec[periodo].sort(function (a, b) { return b - a });
        //}
		lup(periodo+=1,vec, n, u, d);
	}
	
