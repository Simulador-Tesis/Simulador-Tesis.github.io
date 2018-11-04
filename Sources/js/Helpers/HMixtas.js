var Par = string => string.split(",").map(item => parseFloat(item));
var solve = (string, For) => nerdamer(string).solveFor(For).toString();
var diff = (expr, base) => nerdamer.getCore().Calculus.diff(nerdamer(expr).symbol, base).text();
/**
 * Pruebas *
    -p*q+2*p+4*q+4 (factorizando) => p(-q+2)+(4*q+4)
    -2*p*q+p+2*q+3 (factorizando) => q(-2*p+2)+p+3
 */
var expr = (a, b, c, d) => `${a}*p*q+${b}*p*(1-q)+${c}*(1-p)*q+${d}*(1-p)*(1-q)`;
var exprSolve = (a, b, c, d) => `${a}*x+${b}*(1-x)=${c}*x+${d}*(1-x)`;
/**
 * Se trata de Interpolacion (no tiene nada que ver con JQuery).
 * Es propio de JavaScript.
 * Comillas de Interpolacion ALT + 96
 */
var toDecimal = fraction => {
	var a = nerdamer(fraction).numerator().toString(), b = nerdamer(fraction).denominator().toString();
	return parseFloat(a) / parseFloat(b);
};