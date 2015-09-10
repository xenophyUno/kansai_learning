(function(){

var MAX = 2 * 2;
var EMPTY = 'empty';
var WHITE = 'white';
var BLACK = 'black';

function makeInitialGameBoard(){
	var board = {};

	for(var x=0; x < MAX; x++){
		for(var y=0; y < MAX; y++){
			board[[x, y]] = EMPTY;
		}
	}

	var dx = x>>1;
	var dy = y>>1;

	board[[dx-1, dy-1]] = WHITE;
	board[[dx-1, dy  ]] = BLACK;
	board[[dx  , dy-1]] = BLACK;
	board[[dx  , dy  ]] = WHITE;


	return board;
}


function drawGameBoard(board, player){
	var ss = [];

	ss.push('<table>');

	for(var y = -1; y < MAX; y++){
		ss.push('<tr>');
		for(var x = -1; x < MAX; x++){
			if(0 <= x && 0 <= y){
				ss.push('<td class="cell ' + board[[x, y]] + '">');
				ss.push('<span class="disc"></span>');
				ss.push('</td>');
			} else if(0 <= x && y == -1) {
				ss.push('<th>' + 'abcdefghi'[x] + '</th>');
			} else if(0 <= y && x == -1) {
				ss.push('<th>' + '123456789'[y] + '</th>');
			} else {
				ss.push('<th></th>');
			}
		}
		ss.push('</tr>');
	}
	ss.push('</table>');

	$('.app_game_board').html(ss.join(""));
	$('.app_current_player_name').text(player);
}

function makeGameTree(board, player, wasPassed){
	return {
		board: board,
		player: player,
		moves: listPossibleMoves(board, player, wasPassed)
	};
}

function listPossibleMoves(board, player, wasPassed){
	return completePassingMove(
		listAttackingMoves(board, player),
		board,
		player,
		wasPassed
	);
}

function completePassingMove(attackingMoves, board, player, wasPassed){
	if (0 < attackingMoves.length) {
		return attackingMoves;
	} else if (!wasPassed) {
		return [{
			isPassingMove: true,
			gameTree: makeGameTree(board, nextPlayer(player), true)
		}];
	} else {
		return [];
	}
}


function listAttackingMoves(board, player){
	var moves = [];

	for(x = 0; x < MAX; x++){
		for(y = 0; y < MAX; y++){
			if(canAttack(board, x, y, player)){
				moves.push({
					x: x,
					y: y,
					gameTree: makeGameTree(
						makeAttackedBoard(board, x, y, player),
						nextPlayer(player),
						false
					)
				});
			}
		}
	}

	console.log(moves);
	console.log("-----------------------");


	return moves;
}

function nextPlayer(player){
	return player==BLACK ? WHITE : BLACK;
}

function canAttack(board, x, y, player){
	var len = listVulnerableCells(board, x, y, player).length;
	// console.log('x:',x, 'y:',y,'len:',len, 'player:',player);
	return len;
}

function makeAttackedBoard(board, x, y, player){
	var newBoard = JSON.parse(JSON.stringify(board));
	var vulnerableCells = listVulnerableCells(board, x, y, player);
	for(var i = 0; i < vulnerableCells.length; i++){
		newBoard[vulnerableCells[i]] = player;
	}
	return newBoard;
}

function listVulnerableCells(board, x, y, player){
	var vulnerableCells = [];

	if(board[[x,y]] != EMPTY)	return vulnerableCells;

	var opponent = nextPlayer(player);
	for(var dx = -1; dx < 1; dx++){
		for(var dy = -1; dy < 1; dy++){
			if(dx==0 && dy==0)	continue;

			for(var i = 1; i < MAX; i++){
				var nx = x + i*dx;
				var ny = y + i*dy;
				if(nx < 0 || MAX <= nx || ny < 0 || MAX <= ny)	break;
				var cell = board[[nx,ny]];
				if(cell == player && 2 <= i){
					for(var j = 0; j < i; j++)	vulnerableCells.push([x+j*dx, y+j*dy]);
					break;
				}
				if(cell!=opponent)	break;
			}
		}
	}

	// console.log(vulnerableCells.length);

	return vulnerableCells;
}






// ------ UI ----

function setUpUIToChooseMove(gameTree){
	$('.app_message').text('Choose your move');
	// console.log(gameTree.moves.length);
	gameTree.moves.forEach(function(m, i){
		$('.app_console').append(
			$('<input type="button" class="btn">').val(makeLabelForMove(m)).click(function(){
				shiftToNewGameTree(m.gameTree);
			})
		);
	});
}

function makeLabelForMove(move){
	if(move.isPassingMove)	return 'Pass';
	else					return 'abcdefghi'[move.x] + '12345678'[move.y];
}

function resetUI(){
	$('.app_console').empty();
	$('.app_message').empty();
}

function showWinner(board){
	var nt = {};
	nt[BLACK] = 0;
	nt[WHITE] = 0;

	for(var x = 0; x < MAX; x++){
		for(var y = 0; y < MAX; y++){
			nt[board[[x,y]]]++;
		}
	}

	$('.app_message').text(nt[BLACK] == nt[WHITE] ? 'The game ends in a draw.' : 'The winner is ' + (nt[WHITE] < nt[BLACK] ? BLACK : WHITE) + '.');
}

function setUpUIToReset(){
	$('.app_console').append(
		$('<input type="button" class="btn">').val('Start a new game').click(function(){
			resetGame();
		})
	);
}

function resetGame(){
	shiftToNewGameTree(makeGameTree(makeInitialGameBoard(), BLACK, false));
}

function shiftToNewGameTree(gameTree){
	drawGameBoard(gameTree.board, gameTree.player, gameTree.moves);

	resetUI();

	if(gameTree.moves.length == 0){
		showWinner(gameTree.board);
		setUpUIToReset();
	} else {
		setUpUIToChooseMove(gameTree);
	}

} 




drawGameBoard(makeInitialGameBoard(), BLACK);
resetGame();


})();

