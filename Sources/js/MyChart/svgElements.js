var rect = obj => {
    var rec = document.createElement('rect');
    rec.setAttribute('x', obj.x);
    rec.setAttribute('y', obj.y);
    rec.setAttribute('width', obj.width);
    rec.setAttribute('height', obj.height);
    rec.setAttribute('rx', obj.rx || 0);
    /*el valor por defecto es obj.rx pero si no existe entonces sera 0 */
    rec.setAttribute('ry', obj.ry || 0);
    rec.setAttribute('stroke', obj.stroke || 'black');
    rec.setAttribute('fill', obj.fill || 'black');
    rec.style = obj.style || '';
    rec.className = obj.className || '';
    return rec.outerHTML;
};
var circle = obj => {
    var circle = document.createElement('circle');
    circle.setAttribute('cx', obj.cx);
    circle.setAttribute('cy', obj.cy);
    circle.setAttribute('r', obj.r);
    circle.setAttribute('stroke', obj.stroke || 'black');
    circle.setAttribute('fill', obj.fill || 'black');
    circle.style = obj.style || '';
    circle.className = obj.className || '';
    return circle.outerHTML;
};
var line = obj => {
    var line = document.createElement('line');
    line.setAttribute('x1', obj.x1);
    line.setAttribute('x2', obj.x2);
    line.setAttribute('y1', obj.y1);
    line.setAttribute('y2', obj.y2);
    //line.setAttribute('pathLength', obj.pathLength);
    line.setAttribute('stroke', obj.stroke || 'black');
    line.setAttribute('stroke-opacity', obj.strokeOpacity || 1);
    line.setAttribute('stroke-width', obj.strokeWidth || 1);
    line.style = obj.style || '';
    line.className = obj.className || '';
    return line.outerHTML;
};
var text = obj => {
    var text = document.createElement('text');
    text.setAttribute('x', obj.x);
    text.setAttribute('y', obj.y);
    text.setAttribute('text-anchor', obj.textAnchor || 'start');
    text.setAttribute('font-family', obj.fontFamily || 'Consolas');
    text.setAttribute('font-size', obj.fontSize || 16);
    text.innerHTML = obj.val || 'NO VALUE';
    return text.outerHTML;
};