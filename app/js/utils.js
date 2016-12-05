/* eslint-disable */
function hasClass(elem, cls) {
    var str = " " + elem.className + " ";
    var testCls = " " + cls + " ";
    return(str.indexOf(testCls) != -1) ;
}

function nextByClass(node, cls) {
    while (node = node.nextSibling) {
        if (hasClass(node, cls)) {
            return node;
        }
    }
    return null;
}
