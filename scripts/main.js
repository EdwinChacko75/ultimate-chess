function removeBoard() {
    document.getElementById("board").innerHTML = "";
}
function createChessBoard(color) {
    removeBoard();

    columns = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
    rows = ['8', '7', '6', '5', '4', '3', '2', '1']
    if(color == "black"){
        columns.reverse();
        rows.reverse();
    }

    for (var i = 1; i < 9; i++) {
        document.getElementById("board").innerHTML += '<div>';
        for (var j = 1; j < 9; j++) { 
            var squareColor = (i + j) % 2 == 0 ? "light" : "dark";
            if (i == 8 && j == 1) {
                document.getElementById("board").innerHTML += '<li class="square ' + squareColor + '"><img id="empty"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p><p class="column">' + columns[j-1] + '</p></li>';
                continue;
            }
            else if (i == 8) {
                document.getElementById("board").innerHTML += '<li class="square ' + squareColor + '"><img id="empty"><p class="column ' + squareColor +'">' + columns[j - 1] + '</p></li>';
                continue;
            }
            else if (j == 1) {
                document.getElementById("board").innerHTML += '<li class="square ' + squareColor + ' "><img id="empty"><p class="row ' + squareColor +'">' + rows[i - 1] + '</p></li>';
            }
            else {
                document.getElementById("board").innerHTML += '<li class="square ' + squareColor + '"><img id="empty"></li>';
            }
        }
        
        document.getElementById("board").innerHTML += '</div>';
    }

}

document.addEventListener("DOMContentLoaded",  createChessBoard);

function pxToVw(px) {
    return (100 * px) / document.documentElement.clientWidth;
}
