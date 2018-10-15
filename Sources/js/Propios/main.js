$(document).ready(function(){

	var arbol_ida;
	var arbol_vuelta;
	var precioEjercicio, nPeriodos, p, q, R, alza, baja;
	
	var arrayPtsEquilibrio1;
	var arrayPtsEquilibrio2;
	
	$('.visualizar').hide();
	$('#frame, #iframeGetBalancePoint, #ver-arbol').hide();
	$('.jugadores').hide();

    $('.numero').blur(function(e){
    	//e.preventDefault();
        var $this= $(this);
        if(parseFloat($this.val()) < 0){
            $this.val("");
            $this.focus();
            $this.attr("placeholder", "Ingrese un numero positivo");
        }else{
			if($this.val()==="" && $this.attr("placeholder")==="Ingrese un numero positivo"){
				$this.attr("placeholder", "");
			}
        }
    });

	$('.btnCollapse').trigger('click');

	/*para reconocer si se va a ingresar el alza de frente*/
	var BoolAlza = false;

	$('.numero').on('input',function(){
	    if($(this).attr('id')==='volatilidad'/*||$(this).attr('id')==='tasa_sin_riesgo'*/){
	        if($(this).val()!==''){
	            $('#AlzaPanel1, #BajaPanel1').prop('disabled',true);
            }
            else{
	            if($('#volatilidad').val()===''/*&&$('#tasa_sin_riesgo').val()===''*/){
                    $('#AlzaPanel1, #BajaPanel1').prop('disabled',false);
	            }
            }
        }else if($(this).attr('id') === 'AlzaPanel1' || $(this).attr('id')==='BajaPanel1' ){
            if($(this).val() !== ''){
                BoolAlza=true;
                $('#volatilidad, #tiempo').prop('disabled',true);
                $('#tasa_sin_riesgo').attr('placeholder',"Campo Opcional");
                /*$(Input.TasaSinRiesgo.id('$')).prop('disabled',true);*/
                if($('#AlzaPanel1').val()!=='' && $('#BajaPanel1').val()==='')
                    $('#BajaPanel1').attr('placeholder',"Se asume que la Baja es la inversa de la Alza");
                else if($('#AlzaPanel1').val()===''&&$('#BajaPanel1').val()!=='')
                    $('#AlzaPanel1').attr('placeholder',"Se asume que la Alza es la inversa de la Baja");
            }
            else{
                if($('#AlzaPanel1').val()==='' && $('#BajaPanel1').val()===''){
                    BoolAlza=false;
                    $('#volatilidad, #tiempo').prop('disabled',false);
                    $('#tasa_sin_riesgo').attr('placeholder',"");
                    $('#AlzaPanel1, #BajaPanel1').attr('placeholder',"");

                    /*$(Input.TasaSinRiesgo.id('$')).prop('disabled',false);*/
                }
            }
        }
    });

	$('.listo').click(function(e) {
        var valido = true;
        var aux1;
        $('#PanelTable1 .numero').each(function () {
            if ($(this).attr('id') !== "tasa_sin_riesgo" && $(this).attr('id') !== "BajaPanel1" &&
                    !$(this).prop('disabled') && EmptyORisNaN($(this).val())) {
                valido = false;
                //aux1 = this.attr('name');
                return;
            }
        });
        if (!valido) return;

        this.S = parseFloat($('#precio_activo').val());
        this.prejer = parseFloat($('#precio_ejercicio').val());
        this.n = parseInt($('#periodos').val());/*maximo hasta 16 periodos*/
        this.vec = new Array(parseInt(this.n) + 1);/*Arbol de Ida*/
        this.vec[0] = [this.S];

        if (BoolAlza) {
            this.u = parseFloat($('#AlzaPanel1').val());
            //this.d = parseFloat($('#BajaPanel1').val());
            this.d = ($('#BajaPanel1').val()==='')?(1/this.u):parseFloat($('#BajaPanel1').val());
        }
        else {
            this.t = OptionDecisions($('#tiempo'));/*solo se necita para el Alza (u)*/
            this.o = OptionDecisions($('#volatilidad'));/*solo se necita para el Alza (u)*/
            this.u = Math.pow(Math.E, (this.o /*/ 100*/) * Math.sqrt(this.t / this.n));
            this.d = 1 / this.u;/*la baja*/
        }
		
        lup(0, this.vec, this.n, this.u, this.d);
		
        if(EmptyORisNaN($('#tasa_sin_riesgo').val())){
            this.p = "No hay valor";
            this.q = "No hay valor";
            this.C = '';
            $('#MostrarArbol2').attr("style", "visibility: hidden");
        }
        else{
            this.r = OptionDecisions($('#tasa_sin_riesgo'));/*se necesita para las probanilidades*/
            this.R = parseFloat(1 + (this.r /*/ 100*/));
            this.p = (this.R - this.d) / (this.u - this.d);
            this.q = 1 - this.p;
            this.array = new Array(parseInt(this.n) + 1);/*Arbol de Regreso*/
            console.log(this.vec);
            valor_Opcion(this.vec[this.n], this.n, this.array, this.p, this.q, this.R, this.prejer);
            this.C = parseFloat(this.array[0][0]);/*valor de la opcion de venta "Call"*/
            $('#MostrarArbol2').attr("style", "visibility: visible");
        }
		console.log(this.vec);
        document.getElementById("alza").innerHTML = this.u.toFixed($('#nDecResult').val());
        document.getElementById("baja").innerHTML = this.d.toFixed($('#nDecResult').val());
        $('#pro_u').html((this.p === "No hay valor") ? this.p : toNumber(this.p, $('#nDecResult').val()));
        $('#pro_d').html((this.q === "No hay valor") ? this.q : toNumber(this.q, $('#nDecResult').val()));

        $('#precioCall').html((this.C==='')?"No hay valor":toNumber(this.C, $('#nDecResult').val()));
        $('#vov').html((this.C==='')?"No hay valor":toNumber(this.C - this.S + (this.prejer / this.R), $('#nDecResult').val()));

        localStorage.setItem("NPeriodos_NDecimales",JSON.stringify({nPer:this.n, nDec:$('#nDecTree').val()}));

        $('.visualizar').show();
		$('#frame, #iframeGetBalancePoint, #ver-arbol').hide();

        arbol_ida=this.vec;
        arbol_vuelta=this.array;
        precioEjercicio = this.prejer;
        nPeriodos = this.n;
        p = this.p;
        q = this.q;
        R = this.R;
        alza = this.u;
        baja = this.d;

		$('.jugadores').hide();
	});

    $('.ImportarExcel').click(function(){
        var ida=prepareForExport(arbol_ida.slice(),nPeriodos+1,$('#nDecTree').val());
        var vuelta=prepareForExport(arbol_vuelta.slice(),nPeriodos+1,$('#nDecTree').val());
        var TIda=document.createElement("table");
        var TVuelta = document.createElement("table");
        TIda.innerHTML=matrixToTable(ida);
        TVuelta.innerHTML=matrixToTable(vuelta);
        tablesToExcel([TIda,TVuelta],["Arbo Ida","Arbol Vuelta"],"Opciones_Reales.xls","Excel");
    });

	$('#IniciarJuego').click(function(){

	    if(EmptyORisNaN($('#NPV1').val()) || EmptyORisNaN($('#NPV2').val()))
	        return;

        var NPV = [OptionDecisions($('#NPV1')), OptionDecisions($('#NPV2'))];
        var aux = ListaMatriz(arbol_ida[nPeriodos], precioEjercicio, NPV[0], NPV[1]);

        PuntoEquilibrio(aux);
		arrayPtsEquilibrio1 = new Array(nPeriodos+1);
		arrayPtsEquilibrio2 = new Array(nPeriodos+1);
	
		var ptsequilibrio = ExtraerPtsEquilibrioAUX(aux);
		
        var player1 = ExtraerPtsEquilibrioPlayer(ptsequilibrio, 1);
        valor_Opcion(player1, nPeriodos, arrayPtsEquilibrio1, p, q, R);
		var player2 = ExtraerPtsEquilibrioPlayer(ptsequilibrio, 2);
        valor_Opcion(player2, nPeriodos, arrayPtsEquilibrio2, p, q, R);
		iframesTeoriaJuegos(arbol_ida, 'S', 'object', ''/*$('#iframeGetBalancePoint')*/, aux);
		$('.jugadores').show();
		if(AlzaBaja_es_Uno()){
            $('#call_1').html(0);
            $('#call_2').html(0);
        }else{
            $('#call_1').html(toNumber(arrayPtsEquilibrio1[0][0],$('#nDecResult').val()));
            $('#call_2').html(toNumber(arrayPtsEquilibrio2[0][0],$('#nDecResult').val()));
        }
	});

	function AlzaBaja_es_Uno(){
	    if(alza === 1 && baja === 1)
	        return true;
	    return false;
    }
	
	
	$('.jugadores').click(function(){
        switch ($(this).attr('id')){
            case 'Jugador1':
                iframesTeoriaJuegos(arrayPtsEquilibrio1, 'C', 'object');
				
                break;
            case 'Jugador2':
                iframesTeoriaJuegos(arrayPtsEquilibrio2, 'C', 'object');
				
                break;
            default:
                console.log("No se encuentra el id de el boton - JQuery:Teoria.click(...)");
                break;
        }
    });

	$('.Arboles, .close').on('click',function(){
        //$('.btnCollapse').trigger('click');
			$('#frame').show();
			$('#frame').attr('height',nPeriodos*(nPeriodos<=2?360:250));
			if(event.target.id=="MostrarArbol1"){
				localStorage.setItem("arbol",JSON.stringify(arbol_ida));
				localStorage.setItem("simbolo",JSON.stringify("S"));
                $('#nameArbol').text("Árbol 1");
				
			}else{
				localStorage.setItem("simbolo",JSON.stringify("C"));
				localStorage.setItem("arbol",JSON.stringify(arbol_vuelta));
                $('#nameArbol').text("Árbol 2");
				
			}
			var t_alto=nPeriodos<=2?200:180;
			
			var alto=(nPeriodos*t_alto);
			
			if(arbol_ida[nPeriodos].length==1){
				alto=350;
			}
			localStorage.setItem("mostrar_matriz",JSON.stringify(false));
			$('#frame').attr("src","Sources/Html/Test-Graph.html")
			.attr("height",alto+100);
		
    });

	$('.limpiar').click(function(){
		$('#precio_activo').val('');
		$('#precio_ejercicio').val('');
		$('#periodos').val('');
		$('#tiempo').val('');
		$('#volatilidad').val('');
		$('#tasa_sin_riesgo').val('');
		$('#NPV1').val('');
        $('#NPV2').val('');
        $('#BajaPanel1').val('');
        $('#AlzaPanel1').val('');

        $('#AlzaPanel1, #BajaPanel1, #tiempo, #volatilidad').prop('disabled',false);

        document.getElementById("alza").innerHTML = '';
        document.getElementById("baja").innerHTML = '';
        $('#pro_u').html('');
        $('#pro_d').html('');
        $('#precioCall').html('');
        $('#vov').html('');

        $('#call_1').html('');
        $('#call_2').html('');
		$('#frame, #iframeGetBalancePoint, #ver-arbol').hide();
		$('.visualizar').hide();
		$('.jugadores').hide();
	});

	/*Inicio de los Scrpits del sidebar*/
	$('.abrir').click(function(){
	   	document.getElementById("mySidebar").style.display = "block";
    	document.getElementById("myOverlay").style.display = "block";	
    });

	$('.cerrar').click(function(){
 	    document.getElementById("mySidebar").style.display = "none";
   	 	document.getElementById("myOverlay").style.display = "none";
	});
    /*Fin de los Scrpits del sidebar*/

    /*Modal Introductorio*/

    $(window).on('load',function(){
        $('#Diccionario').modal('show');
    });

    $('.options ul li a').click(function(){
       $(this).parents('.options').children('button').children('label').html($(this).attr('name'));
    });

    $('#nDecResult, #nDecTree').on('input', function(){
       if($(this).val() > 3)
           $(this).val(3);
       else if($(this).val() < 0)
           $(this).val(0);
    });

        var numItems = $('li.fancyTab').length;
        
    
              if (numItems == 12){
                    $("li.fancyTab").width('8.3%');
                }
              if (numItems == 11){
                    $("li.fancyTab").width('9%');
                }
              if (numItems == 10){
                    $("li.fancyTab").width('10%');
                }
              if (numItems == 9){
                    $("li.fancyTab").width('11.1%');
                }
              if (numItems == 8){
                    $("li.fancyTab").width('12.5%');
                }
              if (numItems == 7){
                    $("li.fancyTab").width('14.2%');
                }
              if (numItems == 6){
                    $("li.fancyTab").width('16.666666666666667%');
                }
              if (numItems == 5){
                    $("li.fancyTab").width('20%');
                }
              if (numItems == 4){
                    $("li.fancyTab").width('25%');
                }
              if (numItems == 3){
                    $("li.fancyTab").width('33.3%');
                }
              if (numItems == 2){
                    $("li.fancyTab").width('50%');
                }

});
