var canvas = document.querySelector('#canvas');
var pan = canvas.getContext("2d"),
paint = false,
x,
y;
pan.strokeStyle = "#000000";
pan.lineJoin = "round"; //设置画笔轨迹基于圆点拼接
pan.lineWidth = 9
canvas.addEventListener('mousedown', function(e) {
    paint = true;
    x = e.offsetX;
    y = e.offsetY;
    pan.beginPath();
    pan.moveTo(x, y);
})
canvas.addEventListener('mousemove', function(e) {
    if (paint) {
        var nx = e.offsetX,
        ny = e.offsetY;
        pan.lineTo(x, y);
        pan.stroke();
        x = nx;
        y = ny;
    }
});
canvas.addEventListener('mouseup', function(e) {
    paint = false;
});
canvas.addEventListener('mouseleave', function(e) {
    paint = false;
});

// document.querySelector('.saveimg').addEventListener('click', function() {
//     var url = canvas.toDataURL("image/png");
//     var oA = document.createElement("a");
//     oA.download = '';// 设置下载的文件名，默认是'下载'
//     oA.href = url;
//     document.body.appendChild(oA);
//     oA.click();
//     oA.remove()
// })

document.querySelector('.clear').addEventListener('click', function() {
    pan.clearRect(0,0,300, 300);  
})