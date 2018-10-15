$(document).ready(()=>{
    $('#sub').click(()=>{
    var str1 = 'p*(11*q-1)+1-q';
    var str2 = 'q*(2*p-1)+1-p';

    var str3 = 'p*(5*q-5)-5*q-1';
    var str4 = 'q*(5*p-5)-5*p-1';

    var str5 = 'p*(q-3)+q+4';
    var str6 = 'q*(-5*p+3)+p+2';

    var str7 = 'p*(-q+2)+(4*q+4)';
    var str8 = 'q(-2*p+2)+p+3';

    var arr = [];
    $('.pe').each((index, element) => {
        arr.push(Par($(element).val()));
    });
    var newExp1 = expr(arr[0][0], arr[1][0], arr[2][0], arr[3][0]);
    console.log(newExp1);
    var newExp2 = expr(arr[0][1], arr[1][1], arr[2][1], arr[3][1]);
    console.log(newExp2);

    var ply1 = new Jugador(newExp1,'p');
    var ply2 = new Jugador(newExp2,'q');

    var svg = document.getElementById('abc');
    var d = new myChart(svg, {steps:10, size: 650, increment: 0.1},
        {
            text:{
                fontSize:15
            },
            axis:{
                strokeWidth:1.8
            }
        }
    );

    var x1 = 0;
    var y1 = 0;
    var x2 = 1;
    var y2 = 0.7;
    console.log(ply1.Dots);
    console.log(ply2.Dots);

    drawLines(d,ply1.Dots,{stroke:'blue',strokeWidth:6});
    drawLines(d,ply2.Dots,{stroke:'red',strokeWidth:3});
    $('#pqMixtas').html(`p:${ply1.resFraccion}, q:${ply2.resFraccion}`);
});

});