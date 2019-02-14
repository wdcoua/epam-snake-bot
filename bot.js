/*-
 * #%L
 * Codenjoy - it's a dojo-like platform from developers to developers.
 * %%
 * Copyright (C) 2018 - 2019 Codenjoy
 * %%
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as
 * published by the Free Software Foundation, either version 3 of the
 * License, or (at your option) any later version.
 * 
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 * 
 * You should have received a copy of the GNU General Public
 * License along with this program.  If not, see
 * <http://www.gnu.org/licenses/gpl-3.0.html>.
 * #L%
 */
import { ELEMENT, COMMANDS } from './constants';
import {
  isGameOver, getHeadPosition, getElementByXY, isNear, getAt, getFirstPositionOf, getXYByPosition, isNear2
} from './utils';




	var evilOn = 0;
	var evilCounter = 0;
	
	var imFlying = 0;
	var imEvil = 0;
	var selfSize = 0;
	
	var what_did_i_eat;
	var prev_move;
	
	
	
	
	//var prevMove = "DOWN";
	var prevDist;

	var obhidMode = false;

	var directMoveIndex;
	var directMoveIndex2;
	var sideWallRelativeIndex = false;
	var allowMove = false;
	var wallInFront = 0;
	var lessDistCounter = 0;
	var wallOnBack = 0;
	var escapeNow = false;
	//var attackEnemy = false;
	//var runAway = false;


	var debugConsole = 0;





	var enemyHeadArray = [
		ELEMENT.ENEMY_HEAD_DOWN,
		ELEMENT.ENEMY_HEAD_LEFT,
		ELEMENT.ENEMY_HEAD_RIGHT,
		ELEMENT.ENEMY_HEAD_UP,
		ELEMENT.ENEMY_HEAD_EVIL,
		ELEMENT.ENEMY_HEAD_FLY
	];


	//escapeNow = isNear2(board,enemyHeadArray);









function findd(arr, val) {  /* моє  - перевіряє, чи є елемент в масиві */

	for (var i = 0; i < arr.length; i++) {
		if (arr[i] === val) 
			return true;
	}

	return false;
}


function getDirectionAndDistance(headCoords,objCoords){ /* моє  - повертає масив з напрямами і відстанню до об'єкту */

	var xDiff = headCoords['x'] - objCoords['x'];
	var yDiff = headCoords['y'] - objCoords['y'];

	var needDirr, needDirr2;


	if(Math.abs(xDiff) >= Math.abs(yDiff)){
		if(xDiff > 0){
			needDirr = 'LEFT'; 
		}else{
			needDirr = 'RIGHT'; 
		}

		if(yDiff > 0){
			needDirr2 = 'UP'; 
		}else{
			needDirr2 = 'DOWN'; 
		}

	}else{
		if(yDiff > 0){
			needDirr = 'UP'; 
		}else{
			needDirr = 'DOWN'; 
		}

		if(xDiff > 0){
			needDirr2 = 'LEFT'; 
		}else{
			needDirr2 = 'RIGHT'; 
		}
	}
	var dist = Math.abs(headCoords['x'] - objCoords['x']) + Math.abs(headCoords['y'] - objCoords['y']);

	return [dist,needDirr,needDirr2]; /* приклад - [5,'LEFT','UP'] */
}
  
function getAllPositionsOf(board, element){ /* моє  - повертає масив з усіма позиціями даного елементу*/

	var board_arr = board.split('');
	var out = [];
	var i = 0;  
	var ii = 0;
  
	var position = 0;
	var pos = 0;
	var on = true;
  
  
	var i = 0;

	board_arr.forEach(function(elem) {
		if(elem === element){
			out[ii] = i;
			//console.log(i);
			ii++
		}
		i++;
	});

	return out;
}


function getAllPositionsOfMany(board, elements){ /* моє  - повертає масив з усіма позиціями усіх елементів */

	var board_arr = board.split('');
	var out = [];
	var i = 0;  
	var ii = 0;
  
	var position = 0;
	var pos = 0;
	var on = true;
  
  
	var i = 0;

	board_arr.forEach(function(bo_el) {
  
  	elements.forEach(function(el) {
    
      if(el === bo_el){
        out[ii] = i;
        //console.log(i);
        ii++
      }
    });
    
    
		
		i++;
	});

	return out;
}




function compareNumeric(a, b) {
	return a[0] - b[0];
}
  
	//var allPositions = getAllPositionsOf(board, el);

function getAllDirectionsAndDistances(board, elements){ /* моє  */
	var allPositions = getAllPositionsOfMany(board, elements);
  
	//var headCoo = {x:5,y:7};
	var headCoo = getHeadPosition(board);
	var i = 0;
	var dirAndDist = [];
	
	allPositions.forEach(function(pos) {
  
    
		var objCoo = getXYByPosition(board,pos);
		dirAndDist[i] = getDirectionAndDistance(headCoo,objCoo);
		
		//console.log(dirAndDist[i]);
		/*
		if(elem === element){
			out[ii] = i;
			//console.log(i);
			ii++
		}
		*/
		i++;
	});

	return dirAndDist.sort(compareNumeric);
}
  









// Bot Example
export function getNextSnakeMove(board, logger) {
	
	escapeNow = isNear2(board,enemyHeadArray);
	consoleDebugLog(escapeNow+' - escapeNow');
	
	if(selfSize == undefined){
		selfSize = 0;
	}
	
	if(imEvil == undefined){
		imEvil = 0;
	}
	
	if(imFlying == undefined){
		imFlying = 0;
	}
	
	var board_arr = board.split('');
	/* затичка 
	board_arr[218] = '☼';
	board_arr[219] = '☼';
	board_arr[278] = '☼';
	board_arr[279] = '☼';
	board_arr[589] = '☼';
	board_arr[591] = '☼';
	board_arr[593] = '☼';
	*/
	board = board_arr.join('');
	
	var SELF_ELEMENTS = [	
     '▼',
     '◄',
     '►',
     '▲',
     '☻',
     '♥',
     '♠',
     '&',

     '╙',
     '╘',
     '╓',
     '╕',
     '~',

     '═',
     '║',
     '╗',
     '╝',
     '╔',
     '╚'
   ];
	
	selfSize = 0;
	board.split('').forEach(x => {
	   if (SELF_ELEMENTS.indexOf(x) > -1) {
		   selfSize += 1;
	   }
	});
	
	
	  if (findd(board_arr, ELEMENT.HEAD_FLY)) {
         imFlying = 1;		 
       }else{
		 imFlying = 0;	
	   }
	
	
	  if (findd(board_arr, ELEMENT.HEAD_EVIL)) {
         imEvil = 1;
		 
		 if(evilOn == 0){
			 evilOn = 1;
			 evilCounter = 9;
		 }else{
			 if(evilCounter > 1){
				 evilCounter = evilCounter - 1;
			 }else{
				 evilOn = 0;
				 evilCounter = 0;
				 imEvil = 0;
			 }
		 }
		 
       }else{
		   
		 evilOn = 0;
		 evilCounter = 0;
		 imEvil = 0;
	   }
	

	var myOptions = [selfSize,imEvil];


    if (isGameOver(board)) {
        return '';
		obhidMode = false;
    }
    const headPosition = getHeadPosition(board);
	
    if (!headPosition) {
        return '';
    }
	
	var nearnear = isNear(board,headPosition['x'],headPosition['y'],'☼'); //$®○
	var getget = getFirstPositionOf(board, '○');
	
	
	/*
	OTHER: '?',

    APPLE: '○',
    STONE: '●',
    FLYING_PILL: '©',
    FURY_PILL: '®',
    GOLD: '$',
	*/
	var els;
	var alll;

	if(imEvil == 1 && evilCounter > 0){ // FURY
			
		els = [
			ELEMENT.FURY_PILL,
			ELEMENT.GOLD,
			ELEMENT.STONE,
			ELEMENT.ENEMY_HEAD_DOWN,
			ELEMENT.ENEMY_HEAD_LEFT,
			ELEMENT.ENEMY_HEAD_RIGHT,
			ELEMENT.ENEMY_HEAD_UP,
			ELEMENT.ENEMY_BODY_HORIZONTAL,
			ELEMENT.ENEMY_BODY_VERTICAL,
			ELEMENT.ENEMY_BODY_LEFT_DOWN,
			ELEMENT.ENEMY_BODY_LEFT_UP,
			ELEMENT.ENEMY_BODY_RIGHT_DOWN,
			ELEMENT.ENEMY_BODY_RIGHT_UP
		];
		
		alll = getAllDirectionsAndDistances(board,els);
	}else{
			
		els = [
				ELEMENT.FURY_PILL,
				ELEMENT.GOLD
			];
			
		alll = getAllDirectionsAndDistances(board,els);

			
		if(alll.length == 0){ 
			
			if( selfSize > 4  && imFlying == 0 ){
					
				els = [
					
					ELEMENT.STONE
				];
				
				alll = getAllDirectionsAndDistances(board,els);
			}else{
				
				var els = [
					ELEMENT.OTHER,
					ELEMENT.APPLE,
					ELEMENT.GOLD
				];
				
				alll = getAllDirectionsAndDistances(board,els);
			}
			
		}
		
		
		
	}
	
	
	
	
	
	
	
	/*
	
	
	
	if( selfSize > 4  && imFlying == 0 ){
			
	}
	
	
	
	
	
	
	
	if(alll.length == 0){		
		el = '$';
		alll = getAllDirectionsAndDistances(board,el);
	}
	
	if(alll.length == 0){		
		el = '$';
		alll = getAllDirectionsAndDistances(board,el);
	}
	
	if(alll.length == 0){		
		el = '○';
		alll = getAllDirectionsAndDistances(board,el);
	}
	
	*/
	
	
	
	var out = JSON.stringify(alll) + ' | prev_move - ' + prev_move;
	/*
	(getget != null ? ('['+getget["x"]+','+getget["y"]+']') : '' );
	 out = out + (nearnear != null ? ('['+nearnear+']') : '' );
	 out = out + (what_did_i_eat != undefined ? ('['+what_did_i_eat+']') : '' );
	*/
    logger('Head:' + JSON.stringify(headPosition) + ' -- ' + out);

    const surround = getSurround(board, headPosition); // (LEFT, UP, RIGHT, DOWN)
    logger('Surround: ' + JSON.stringify(surround));

    const raitings = surround.map(
		function(surr) {
			return rateElement(surr,myOptions);
		}
	);
    logger('Raitings:' + JSON.stringify(raitings));
    logger('');
    logger('wallInFront:'+wallInFront);
    logger('wallOnBack:'+wallOnBack+'\nlessDistCounter:'+lessDistCounter+'\nobhidMode:'+obhidMode+'\nsideWallRelativeIndex:'+sideWallRelativeIndex+'\ndirectMoveIndex:'+directMoveIndex+'\nprevDist:'+prevDist+'\nescapeNow:'+escapeNow+'\n');
	var prefer = alll[0];
	//if(!prevMove) var prevMove = "UP";
    const command = getCommandByRaitings(raitings,prefer,prev_move,board,enemyHeadArray); // getCommandByRaitings(raitings,board,alll[0]);
	//prev_move = command;
    return command;
}

function getSurround(board, position) {
    const p = position;
    return [
        getElementByXY(board, {x: p.x + 1, y: p.y}), // RIGHT
        getElementByXY(board, {x: p.x, y: p.y + 1 }), // DOWN
        getElementByXY(board, {x: p.x - 1, y: p.y }), // LEFT
        getElementByXY(board, {x: p.x, y: p.y -1 }), // UP
		
        getElementByXY(board, {x: p.x + 1, y: p.y + 1 }), // 
        getElementByXY(board, {x: p.x - 1, y: p.y + 1}), // 
        getElementByXY(board, {x: p.x - 1, y: p.y - 1 }), // 
        getElementByXY(board, {x: p.x + 1, y: p.y - 1}), // 
		
        getElementByXY(board, {x: p.x + 2, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 2 }), // DOWN 2
        getElementByXY(board, {x: p.x - 2, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y -2 }), // UP 2
		
		/* нафіг =)
		
		
		
		
		
        getElementByXY(board, {x: p.x + 3, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 3 }), // DOWN 2
        getElementByXY(board, {x: p.x - 3, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 3 }), // UP 2
		
        getElementByXY(board, {x: p.x + 4, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 4 }), // DOWN 2
        getElementByXY(board, {x: p.x - 4, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 4 }), // UP 2
		
        getElementByXY(board, {x: p.x + 5, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 5 }), // DOWN 2
        getElementByXY(board, {x: p.x - 5, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 5 }), // UP 2
		
        getElementByXY(board, {x: p.x + 6, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 6 }), // DOWN 2
        getElementByXY(board, {x: p.x - 6, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 6 }), // UP 2
		
        getElementByXY(board, {x: p.x + 7, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 7 }), // DOWN 2
        getElementByXY(board, {x: p.x - 7, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 7 }), // UP 2
		
        getElementByXY(board, {x: p.x + 8, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 8 }), // DOWN 2
        getElementByXY(board, {x: p.x - 8, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 8 }), // UP 2
		
        getElementByXY(board, {x: p.x + 9, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 9 }), // DOWN 2
        getElementByXY(board, {x: p.x - 9, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 9 }), // UP 2
		
        getElementByXY(board, {x: p.x + 10, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 10 }), // DOWN 2
        getElementByXY(board, {x: p.x - 10, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 10 }), // UP 2
		
        getElementByXY(board, {x: p.x + 11, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 11 }), // DOWN 2
        getElementByXY(board, {x: p.x - 11, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 11 }), // UP 2
		
        getElementByXY(board, {x: p.x + 12, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 12 }), // DOWN 2
        getElementByXY(board, {x: p.x - 12, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 12 }), // UP 2
		
        getElementByXY(board, {x: p.x + 13, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 13 }), // DOWN 2
        getElementByXY(board, {x: p.x - 13, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 13 }), // UP 2
		
        getElementByXY(board, {x: p.x + 14, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 14 }), // DOWN 2
        getElementByXY(board, {x: p.x - 14, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 14 }), // UP 2
		
        getElementByXY(board, {x: p.x + 15, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 15 }), // DOWN 2
        getElementByXY(board, {x: p.x - 15, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 15 }), // UP 2
		
        getElementByXY(board, {x: p.x + 16, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 16 }), // DOWN 2
        getElementByXY(board, {x: p.x - 16, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 16 }), // UP 2
		
        getElementByXY(board, {x: p.x + 17, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 17 }), // DOWN 2
        getElementByXY(board, {x: p.x - 17, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 17 }), // UP 2
		
        getElementByXY(board, {x: p.x + 18, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 18 }), // DOWN 2
        getElementByXY(board, {x: p.x - 18, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 18 }), // UP 2
		
        getElementByXY(board, {x: p.x + 19, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 19 }), // DOWN 2
        getElementByXY(board, {x: p.x - 19, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 19 }), // UP 2
		
        getElementByXY(board, {x: p.x + 20, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 20 }), // DOWN 2
        getElementByXY(board, {x: p.x - 20, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 20 }), // UP 2
		
        getElementByXY(board, {x: p.x + 21, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 21 }), // DOWN 2
        getElementByXY(board, {x: p.x - 21, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 21 }), // UP 2
		
        getElementByXY(board, {x: p.x + 22, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 22 }), // DOWN 2
        getElementByXY(board, {x: p.x - 22, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 22 }), // UP 2
		
        getElementByXY(board, {x: p.x + 23, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 23 }), // DOWN 2
        getElementByXY(board, {x: p.x - 23, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 23 }), // UP 2
		
        getElementByXY(board, {x: p.x + 24, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 24 }), // DOWN 2
        getElementByXY(board, {x: p.x - 24, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 24 }), // UP 2
		
        getElementByXY(board, {x: p.x + 25, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 25 }), // DOWN 2
        getElementByXY(board, {x: p.x - 25, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 25 }), // UP 2
		
        getElementByXY(board, {x: p.x + 26, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 26 }), // DOWN 2
        getElementByXY(board, {x: p.x - 26, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 26 }), // UP 2
		
        getElementByXY(board, {x: p.x + 27, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 27 }), // DOWN 2
        getElementByXY(board, {x: p.x - 27, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 27 }), // UP 2
		
        getElementByXY(board, {x: p.x + 28, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 28 }), // DOWN 2
        getElementByXY(board, {x: p.x - 28, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 28 }), // UP 2
		
        getElementByXY(board, {x: p.x + 29, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 29 }), // DOWN 2
        getElementByXY(board, {x: p.x - 29, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 29 }), // UP 2
		
        getElementByXY(board, {x: p.x + 30, y: p.y}), // RIGHT 2
        getElementByXY(board, {x: p.x, y: p.y + 30 }), // DOWN 2
        getElementByXY(board, {x: p.x - 30, y: p.y }), // LEFT 2
        getElementByXY(board, {x: p.x, y: p.y - 30 }), // UP 2
		
		
		
		
		
        getElementByXY(board, {x: p.x + 2, y: p.y -2 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 2, y: p.y + 2}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 2, y: p.y + 2 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 2, y: p.y - 2 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 3, y: p.y -3 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 3, y: p.y + 3}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 3, y: p.y + 3 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 3, y: p.y - 3 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 4, y: p.y -4 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 4, y: p.y + 4}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 4, y: p.y + 4 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 4, y: p.y - 4 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 5, y: p.y -5 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 5, y: p.y + 5}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 5, y: p.y + 5 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 5, y: p.y - 5 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 6, y: p.y -6 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 6, y: p.y + 6}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 6, y: p.y + 6 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 6, y: p.y - 6 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 7, y: p.y -7 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 7, y: p.y + 7}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 7, y: p.y + 7 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 7, y: p.y - 7 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 8, y: p.y -8 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 8, y: p.y + 8}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 8, y: p.y + 8 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 8, y: p.y - 8 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 9, y: p.y -9 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 9, y: p.y + 9}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 9, y: p.y + 9 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 9, y: p.y - 9 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 10, y: p.y -10 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 10, y: p.y + 10}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 10, y: p.y + 10 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 10, y: p.y - 10 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 11, y: p.y -11 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 11, y: p.y + 11}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 11, y: p.y + 11 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 11, y: p.y - 11 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 12, y: p.y -12 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 12, y: p.y + 12}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 12, y: p.y + 12 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 12, y: p.y - 12 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 13, y: p.y -13 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 13, y: p.y + 13}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 13, y: p.y + 13 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 13, y: p.y - 13 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 14, y: p.y -14 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 14, y: p.y + 14}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 14, y: p.y + 14 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 14, y: p.y - 14 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 15, y: p.y -15 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 15, y: p.y + 15}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 15, y: p.y + 15 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 15, y: p.y - 15 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 16, y: p.y -16 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 16, y: p.y + 16}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 16, y: p.y + 16 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 16, y: p.y - 16 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 17, y: p.y -17 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 17, y: p.y + 17}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 17, y: p.y + 17 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 17, y: p.y - 17 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 18, y: p.y -18 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 18, y: p.y + 18}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 18, y: p.y + 18 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 18, y: p.y - 18 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 19, y: p.y -19 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 19, y: p.y + 19}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 19, y: p.y + 19 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 19, y: p.y - 19 }), // LEFT+UP
		
        getElementByXY(board, {x: p.x + 20, y: p.y -20 }), // UP + RIGHT
        getElementByXY(board, {x: p.x + 20, y: p.y + 20}), // RIGHT + DOWN
        getElementByXY(board, {x: p.x - 20, y: p.y + 20 }), // DOWN + LEFT
        getElementByXY(board, {x: p.x - 20, y: p.y - 20 }), // LEFT+UP
		
		
		
        getElementByXY(board, {x: p.x + 2, y: p.y + 1}), // RIGHT 
        getElementByXY(board, {x: p.x + 1, y: p.y + 2 }), // DOWN 
        getElementByXY(board, {x: p.x - 2, y: p.y + 1 }), // LEFT 
        getElementByXY(board, {x: p.x + 1, y: p.y -2 }), // UP 
		
        getElementByXY(board, {x: p.x + 2, y: p.y - 1}), // RIGHT 
        getElementByXY(board, {x: p.x - 1, y: p.y + 2 }), // DOWN
        getElementByXY(board, {x: p.x - 2, y: p.y - 1 }), // LEFT 
        getElementByXY(board, {x: p.x - 1, y: p.y -2 }), // UP 
		
		
		
        getElementByXY(board, {x: p.x + 3, y: p.y + 1}), // RIGHT 
        getElementByXY(board, {x: p.x + 1, y: p.y + 3 }), // DOWN 
        getElementByXY(board, {x: p.x - 3, y: p.y + 1 }), // LEFT 
        getElementByXY(board, {x: p.x + 1, y: p.y -3 }), // UP 
		
        getElementByXY(board, {x: p.x + 3, y: p.y - 1}), // RIGHT 
        getElementByXY(board, {x: p.x - 1, y: p.y + 3 }), // DOWN
        getElementByXY(board, {x: p.x - 3, y: p.y - 1 }), // LEFT 
        getElementByXY(board, {x: p.x - 1, y: p.y -3 }), // UP 
		
        getElementByXY(board, {x: p.x + 3, y: p.y + 2}), // RIGHT 
        getElementByXY(board, {x: p.x + 2, y: p.y + 3 }), // DOWN 
        getElementByXY(board, {x: p.x - 3, y: p.y + 2 }), // LEFT 
        getElementByXY(board, {x: p.x + 2, y: p.y -3 }), // UP 
		
        getElementByXY(board, {x: p.x + 3, y: p.y - 2}), // RIGHT 
        getElementByXY(board, {x: p.x - 2, y: p.y + 3 }), // DOWN
        getElementByXY(board, {x: p.x - 3, y: p.y - 2 }), // LEFT 
        getElementByXY(board, {x: p.x - 2, y: p.y -3 }), // UP 
		
		
		
        getElementByXY(board, {x: p.x + 4, y: p.y + 1}), // RIGHT 
        getElementByXY(board, {x: p.x + 1, y: p.y + 4 }), // DOWN 
        getElementByXY(board, {x: p.x - 4, y: p.y + 1 }), // LEFT 
        getElementByXY(board, {x: p.x + 1, y: p.y -4 }), // UP 
		
        getElementByXY(board, {x: p.x + 4, y: p.y - 1}), // RIGHT 
        getElementByXY(board, {x: p.x - 1, y: p.y + 4 }), // DOWN
        getElementByXY(board, {x: p.x - 4, y: p.y - 1 }), // LEFT 
        getElementByXY(board, {x: p.x - 1, y: p.y -4 }), // UP 
		
        getElementByXY(board, {x: p.x + 4, y: p.y + 2}), // RIGHT 
        getElementByXY(board, {x: p.x + 2, y: p.y + 4 }), // DOWN 
        getElementByXY(board, {x: p.x - 4, y: p.y + 2 }), // LEFT 
        getElementByXY(board, {x: p.x + 2, y: p.y -4 }), // UP 
		
        getElementByXY(board, {x: p.x + 4, y: p.y - 2}), // RIGHT 
        getElementByXY(board, {x: p.x - 2, y: p.y + 4 }), // DOWN
        getElementByXY(board, {x: p.x - 4, y: p.y - 2 }), // LEFT 
        getElementByXY(board, {x: p.x - 2, y: p.y -4 }), // UP 
		
        getElementByXY(board, {x: p.x + 4, y: p.y + 3}), // RIGHT 
        getElementByXY(board, {x: p.x + 3, y: p.y + 4 }), // DOWN 
        getElementByXY(board, {x: p.x - 4, y: p.y + 3 }), // LEFT 
        getElementByXY(board, {x: p.x + 3, y: p.y -4 }), // UP 
		
        getElementByXY(board, {x: p.x + 4, y: p.y - 3}), // RIGHT 
        getElementByXY(board, {x: p.x - 3, y: p.y + 4 }), // DOWN
        getElementByXY(board, {x: p.x - 4, y: p.y - 3 }), // LEFT 
        getElementByXY(board, {x: p.x - 3, y: p.y -4 }), // UP 
		
		
		
		
        getElementByXY(board, {x: p.x + 5, y: p.y + 1}), // RIGHT 
        getElementByXY(board, {x: p.x + 1, y: p.y + 5 }), // DOWN 
        getElementByXY(board, {x: p.x - 5, y: p.y + 1 }), // LEFT 
        getElementByXY(board, {x: p.x + 1, y: p.y -5 }), // UP 
		
        getElementByXY(board, {x: p.x + 5, y: p.y - 1}), // RIGHT 
        getElementByXY(board, {x: p.x - 1, y: p.y + 5 }), // DOWN
        getElementByXY(board, {x: p.x - 5, y: p.y - 1 }), // LEFT 
        getElementByXY(board, {x: p.x - 1, y: p.y -5 }), // UP 
		
        getElementByXY(board, {x: p.x + 5, y: p.y + 2}), // RIGHT 
        getElementByXY(board, {x: p.x + 2, y: p.y + 5 }), // DOWN 
        getElementByXY(board, {x: p.x - 5, y: p.y + 2 }), // LEFT 
        getElementByXY(board, {x: p.x + 2, y: p.y -5 }), // UP 
		
        getElementByXY(board, {x: p.x + 5, y: p.y - 2}), // RIGHT 
        getElementByXY(board, {x: p.x - 2, y: p.y + 5 }), // DOWN
        getElementByXY(board, {x: p.x - 5, y: p.y - 2 }), // LEFT 
        getElementByXY(board, {x: p.x - 2, y: p.y -5 }), // UP 
		
        getElementByXY(board, {x: p.x + 5, y: p.y + 3}), // RIGHT 
        getElementByXY(board, {x: p.x + 3, y: p.y + 5 }), // DOWN 
        getElementByXY(board, {x: p.x - 5, y: p.y + 3 }), // LEFT 
        getElementByXY(board, {x: p.x + 3, y: p.y -5 }), // UP 
		
        getElementByXY(board, {x: p.x + 5, y: p.y - 3}), // RIGHT 
        getElementByXY(board, {x: p.x - 3, y: p.y + 5 }), // DOWN
        getElementByXY(board, {x: p.x - 5, y: p.y - 3 }), // LEFT 
        getElementByXY(board, {x: p.x - 3, y: p.y -5 }), // UP 
		
        getElementByXY(board, {x: p.x + 5, y: p.y + 4}), // RIGHT 
        getElementByXY(board, {x: p.x + 4, y: p.y + 5 }), // DOWN 
        getElementByXY(board, {x: p.x - 5, y: p.y + 4 }), // LEFT 
        getElementByXY(board, {x: p.x + 4, y: p.y -5 }), // UP 
		
        getElementByXY(board, {x: p.x + 5, y: p.y - 4}), // RIGHT 
        getElementByXY(board, {x: p.x - 4, y: p.y + 5 }), // DOWN
        getElementByXY(board, {x: p.x - 5, y: p.y - 4 }), // LEFT 
        getElementByXY(board, {x: p.x - 4, y: p.y -5 }), // UP 
		
		
		
		
		
        getElementByXY(board, {x: p.x + 4, y: p.y + 1}), // RIGHT 
        getElementByXY(board, {x: p.x + 1, y: p.y + 4 }), // DOWN 
        getElementByXY(board, {x: p.x - 4, y: p.y + 1 }), // LEFT 
        getElementByXY(board, {x: p.x + 1, y: p.y -4 }), // UP 
		
        getElementByXY(board, {x: p.x + 4, y: p.y - 1}), // RIGHT 
        getElementByXY(board, {x: p.x - 1, y: p.y + 4 }), // DOWN
        getElementByXY(board, {x: p.x - 4, y: p.y - 1 }), // LEFT 
        getElementByXY(board, {x: p.x - 1, y: p.y -4 }), // UP 
		
		
		
		*/
		
		
    ];
}

function rateElement(element,myOptions) {
	
	// зробити селф - 0, а NONE - 1
	
	
	
    if (
	element === ELEMENT.TAIL_END_DOWN || 
    element === ELEMENT.TAIL_END_LEFT || 
    element === ELEMENT.TAIL_END_UP || 
    element === ELEMENT.TAIL_END_RIGHT || 
    element === ELEMENT.TAIL_INACTIVE || 

    element === ELEMENT.BODY_HORIZONTAL || 
    element === ELEMENT.BODY_VERTICAL || 
    element === ELEMENT.BODY_LEFT_DOWN || 
    element === ELEMENT.BODY_LEFT_UP || 
    element === ELEMENT.BODY_RIGHT_DOWN || 
    element === ELEMENT.BODY_RIGHT_UP 
	){
        return 0;
    }
	
	
    if (element === ELEMENT.NONE){
        return 1;
    }
    if (element === ELEMENT.FLYING_PILL){
        return 2;
    }
	
    if (
        element === ELEMENT.OTHER ||
        element === ELEMENT.APPLE 
    ){
        return 3;
    }
	
    if (
        element === ELEMENT.GOLD 
    ){
        return 7;
    }
	
	if (
		element === ELEMENT.STONE  && (myOptions[0] > 4 || (myOptions[1] == 1 && evilCounter > 0) ) && imFlying == 0
    ){
		consoleDebugLog(myOptions[0]+" - selfSize, "+myOptions[1]+" - imEvil, "+evilCounter+" - evilCounter, "+evilOn+" - evilOn ");
        return 5;
    }
	
    if (
        element === ELEMENT.FURY_PILL
    ){
        return 6;
    }
	/*
	if ( 
    element === ELEMENT.ENEMY_BODY_HORIZONTAL || 
    element === ELEMENT.ENEMY_BODY_VERTICAL || 
    element === ELEMENT.ENEMY_BODY_LEFT_DOWN || 
    element === ELEMENT.ENEMY_BODY_LEFT_UP || 
    element === ELEMENT.ENEMY_BODY_RIGHT_DOWN || 
    element === ELEMENT.ENEMY_BODY_RIGHT_UP) {
		
		console.log('attack');
        return 7;
	}
	*/
	if ( (
	element === ELEMENT.ENEMY_HEAD_DOWN || 
    element === ELEMENT.ENEMY_HEAD_LEFT || 
    element === ELEMENT.ENEMY_HEAD_RIGHT || 
    element === ELEMENT.ENEMY_HEAD_UP ||  
    element === ELEMENT.ENEMY_HEAD_EVIL || 
    element === ELEMENT.ENEMY_HEAD_FLY || 

    element === ELEMENT.ENEMY_TAIL_END_DOWN || 
    element === ELEMENT.ENEMY_TAIL_END_LEFT || 
    element === ELEMENT.ENEMY_TAIL_END_UP || 
    element === ELEMENT.ENEMY_TAIL_END_RIGHT || 
    element === ELEMENT.ENEMY_TAIL_INACTIVE || 

    element === ELEMENT.ENEMY_BODY_HORIZONTAL || 
    element === ELEMENT.ENEMY_BODY_VERTICAL || 
    element === ELEMENT.ENEMY_BODY_LEFT_DOWN || 
    element === ELEMENT.ENEMY_BODY_LEFT_UP || 
    element === ELEMENT.ENEMY_BODY_RIGHT_DOWN || 
    element === ELEMENT.ENEMY_BODY_RIGHT_UP) && myOptions[1] == 1 && evilCounter > 0 && imFlying == 0){
		
		consoleDebugLog('attack - fury');
        return 8;
	}
	
	
	

    return -1;
}






function compareNumeric2(a, b) {
	return b[0] - a[0];
}






/*
Режим обходу перешкоди
вмикати 
	1) коли відстань до об'єкту збільшується (протягом двох ходів?),  
	2) або коли обидва PREFER напрямки - стіна, 
	3) або ж коли PREFER-1 двічі (тричі?) підряд - це стіна

йдемо попри стіну (стіна праворуч) перевіряючи чи НЕ СТІНА прямо (у напрямку руху), прямо+ліворуч і ліворуч, інакше повертаємо від стіни і знову йдемо попри стіну (стіна праворуч)

режим вимикається, коли PREFER-1 у напрямку від стіни і відстань до об'єкту зменшується протягом 2 ходів

*/


function consoleDebugLog(text){
	if(debugConsole == 1){
		console.log(text);
	}
}




function checkDiag(directMoveIndex,sideWallRelativeIndex,raitings){

	var out = true;

	if(sideWallRelativeIndex == -1){ /* стіна ліворуч, перевіряємо діагональ з протилежної сторони */
							
		if(raitings[directMoveIndex+4] == -1){ /*!!*/
			out = false;
			consoleDebugLog('стіна ліворуч, перевіряємо діагональ з протилежної сторони');
		}
	} 
	
	if(sideWallRelativeIndex == 1){ /* стіна праворуч, перевіряємо діагональ з протилежної сторони */
		
		if(directMoveIndex > 0){
		
			if(raitings[directMoveIndex+3] == -1){ /*!!*/
				out = false;
				consoleDebugLog('стіна праворуч, перевіряємо діагональ з протилежної сторони');
			}
		}else{
			
			if(raitings[directMoveIndex+7] == -1){ /*!!*/
				out = false;
				consoleDebugLog('стіна праворуч, перевіряємо діагональ з протилежної сторони');
			}
		}
		
	}
	return out;
	
}






function checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings){
	
	var out = true;
	
	if(directMoveIndex == forbidIndex){
		out = false;
		consoleDebugLog('directMoveIndex == forbidIndex');
	}
	
	if(raitings[directMoveIndex] == -1){
		out = false;
		consoleDebugLog('raitings[directMoveIndex] == -1');
	}
	
	if(sideWallRelativeIndex === false){
		out = false;
		consoleDebugLog('sideWallRelativeIndex === false');
	}
	
	if(sideWallRelativeIndex !== false && raitings[(4+directMoveIndex+sideWallRelativeIndex)%4] != -1 && prevMoveIndex == directMoveIndex){ /* якщо стіни збоку нема а напрямок співпадає з попереднім */
		
		if(sideWallRelativeIndex == -1){ /* стіна ліворуч, перевіряємо, чи стіна через один прохід з тієї ж сторони */
							
			if(directMoveIndex > 0){
		
				if(raitings[directMoveIndex+3] != -1){ /*!!*/
					out = false;
					consoleDebugLog('якщо стіни збоку нема а напрямок співпадає з попереднім 1-1');
				}
			}else{
				
				if(raitings[directMoveIndex+7] != -1){ /*!!*/
					out = false;
					consoleDebugLog('якщо стіни збоку нема а напрямок співпадає з попереднім 1-2');
				}
			}
		
		} 
		
		if(sideWallRelativeIndex == 1){ /* стіна праворуч, перевіряємо, чи стіна через один прохід з тієї ж сторони */
		
			if(raitings[directMoveIndex+4] != -1){ /*!!*/
				/* хід дозволено */
				out = false;
				consoleDebugLog('якщо стіни збоку нема а напрямок співпадає з попереднім 2');
			}
		}
		
		//out = false;
	}
	
	if(sideWallRelativeIndex == -1){ /* стіна ліворуч, перевіряємо діагональ з протилежної сторони */
							
		if(raitings[directMoveIndex+4] == -1){ /*!!*/
			out = false;
			consoleDebugLog('стіна ліворуч, перевіряємо діагональ з протилежної сторони');
		}
	} 
	
	if(sideWallRelativeIndex == 1){ /* стіна праворуч, перевіряємо діагональ з протилежної сторони */
		
		if(directMoveIndex > 0){
		
			if(raitings[directMoveIndex+3] == -1){ /*!!*/
				out = false;
				consoleDebugLog('стіна праворуч, перевіряємо діагональ з протилежної сторони');
			}
		}else{
			
			if(raitings[directMoveIndex+7] == -1){ /*!!*/
				out = false;
				consoleDebugLog('стіна праворуч, перевіряємо діагональ з протилежної сторони');
			}
		}
		
	}
	
	return out;
}



function getCommandByRaitings(raitings,prefer,prevMove,board,enemyHeadArray) {
	
	var forbidMove;
	
	
	if(prevMove == 'RIGHT') forbidMove = 'LEFT';
	if(prevMove == 'DOWN') forbidMove = 'UP';
	if(prevMove == 'LEFT') forbidMove = 'RIGHT';
	if(prevMove == 'UP') forbidMove = 'DOWN';
	

	var indexToCommand = [ 'RIGHT', 'DOWN','LEFT', 'UP',];
    var forbidIndex = indexToCommand.indexOf(forbidMove);
	var prevMoveIndex = indexToCommand.indexOf(prevMove);
	
	
					consoleDebugLog(forbidIndex+' forbidIndex ** '+forbidMove+prevMove);
		
	if(raitings[indexToCommand.indexOf(prefer[1])] == -1){
		wallInFront++
	}else{
		wallInFront = 0;
	}
		
	if(prevDist > prefer[0] && obhidMode === true){
		lessDistCounter++;
		consoleDebugLog(obhidMode+' - obhidMode true');
	}else{
		lessDistCounter = 0;
	}
	
	
	
	if(escapeNow){
		
		consoleDebugLog(escapeNow+' - escapeNow2');
		var ehaps = getAllDirectionsAndDistances(board, enemyHeadArray); // enemy head array positions
		
		
		
		if(ehaps.length > 0){
			if(ehaps[0][0] <= 2){
						
				if(evilOn == 1 && evilCounter >= ehaps[0][0]){
					directMoveIndex = indexToCommand.indexOf(ehaps[0][1]);
					directMoveIndex2 = indexToCommand.indexOf(ehaps[0][2]);
					consoleDebugLog('attackEnemy');
					
				}else{
					directMoveIndex = (indexToCommand.indexOf(ehaps[0][1])+2)%4;
					directMoveIndex2 = (indexToCommand.indexOf(ehaps[0][2])+2)%4;
					consoleDebugLog('runAway - '+directMoveIndex+' '+directMoveIndex2+' '+forbidIndex+' '+raitings[directMoveIndex]);
				}
				
					
				
				if(directMoveIndex != forbidIndex && raitings[directMoveIndex] != -1){
					/* go */
					consoleDebugLog('escapeNowescapeNow 2');
				}else if((directMoveIndex == forbidIndex || raitings[directMoveIndex] == -1) && directMoveIndex2 != forbidIndex && raitings[directMoveIndex2] != -1){
					directMoveIndex = directMoveIndex2;
					consoleDebugLog('escapeNowescapeNow 3');
					/* go */
				}else{
					escapeNow = false;
					consoleDebugLog('escapeNowescapeNow 4');
				}
				
				
			}else{
				escapeNow = false;
				
					consoleDebugLog('escapeNowescapeNow 5');
			}
			/*
			if(isset(ehaps[1]) && ehaps[1][0] <= 2){
						
				if(evilOn == 1 && evilCounter >= ehaps[1][0]){
					attackEnemy = 1;
					prefer2 = ehaps[1];
				}else{
					run = true;
					directMoveIndex2 = (indexToCommand.indexOf(ehaps[1][1])+2)%4;
				}
			}
			*/
			
			
			
			
			
			
			
			
			
			/*
			
			if(directMoveIndex == forbidIndex){
				directMoveIndex = directMoveIndex2;
				consoleDebugLog('directMoveIndex == forbidIndex');
			}
			
			
			
			
			
			
			if(raitings[directMoveIndex] == -1){
				directMoveIndex = directMoveIndex2;
				consoleDebugLog('directMoveIndex == forbidIndex');
				if(raitings[directMoveIndex2] == -1){
					directMoveIndex = directMoveIndex2;
					consoleDebugLog('directMoveIndex == forbidIndex');
				}else{
					
				}
			}
			
			
			{
				escapeNow = false;
			}
			*/
			
		}else{
			escapeNow = false;
		}
	}
	
	
	if(!escapeNow){
	
	consoleDebugLog(escapeNow+' - escapeNow3');
		
		var preferIndex1 = -1;
		var preferIndex2 = -1;
		
		var prefInd = -1;
		var prefInd2 = -1;
		
		
		if(prefer !== undefined){
				
			preferIndex1 = indexToCommand.indexOf(prefer[1]);
			preferIndex2 = indexToCommand.indexOf(prefer[2]);
			
			if(raitings[(preferIndex1+2)%4] == -1){
				wallOnBack++;
			}else{
				wallOnBack = 0;
			}
				
			if(forbidIndex == preferIndex1 ){ // якщо заборона співпала з першим направленням
				prefInd = preferIndex2;
			  prefInd2 = -1;
			}else{													// якщо заборона НЕ співпала з першим направленням
				prefInd = preferIndex1;
			  if(forbidIndex != preferIndex2 ){ // якщо заборона НЕ співпала з другим направленням
				prefInd2 = preferIndex2;
			  }
			}
		}
		
		
		
		
		consoleDebugLog('wallInFront:'+wallInFront);	
		
		if(wallInFront > 0){ /* вмикаю Режим обходу перешкоди */
			obhidMode = true;
		consoleDebugLog(obhidMode+' - obhidMode2 true');
		}/*else{
			obhidMode = false;
		}
		*/
		
		//var wallIndex2;
	   
		if(obhidMode){ /* увімкнено */
		
			if(wallOnBack > 1 && lessDistCounter > 1){ /*	відключення, перевірити чи стіна позаду від prefer-1 і чи зменшується відстань до об'єкту	*/
				obhidMode = false;
				consoleDebugLog(obhidMode+' - obhidMode5');
				
				/* ходи по рейтингу! */
								
								
								var maxIndex = 0;
								var max = -Infinity;
								var ii = 0;
								var indexes = [];
												
												
								for (var i = 0; i < raitings.length; i++) {
									var r = raitings[i];
									if ( ( r > max /*|| i < 4*/ ) && i%4 != forbidIndex && r >= 0 ) { // todo доробити пріоритет на НЕ ТІЛО
									
										if(r > max && raitings[i%4] > -1){
										  maxIndex = i;
										  max = r;
										}
											var ind = [r,i];
										if(ind !== null){
											indexes[ii] = ind;
										}
											
										
										ii++;
										
									}
								}


							  indexes.sort(compareNumeric2);
							  //console.log(raitings);
							  //console.log(JSON.stringify(indexes));
							  
								var move;
							  
							  if(prefInd == maxIndex%4 ){  // якщо пріоритетне направлення співпало з найкращим по індексу =)
								consoleDebugLog('test 1');
									move = indexToCommand[prefInd];
							  }else if(raitings[maxIndex%4] > 0 && raitings[prefInd] > 0 && raitings[maxIndex%4] == raitings[prefInd] ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 1,5');
								move = indexToCommand[prefInd];
							  }else if(prefInd2 == maxIndex%4){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 2');
								move = indexToCommand[maxIndex%4];
							  }else if(prefInd2 != maxIndex%4 && raitings[maxIndex%4] == raitings[prefInd2]  ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 2.5');
								move = indexToCommand[prefInd2];
							  }else if(indexes[1] !== undefined && prefInd == (indexes[1][1])%4 && raitings[prefInd] > 0 ){	// якщо пріоритетне направлення співпало з другим найкращим по індексу 
								consoleDebugLog('test 3');
								move = indexToCommand[(indexes[1][1])%4];
							  }else if(indexes[1] !== undefined && prefInd2 == (indexes[1][1])%4 && raitings[prefInd2] > 0   ){	// якщо друге пріоритетне направлення співпало з другим найкращим по індексу 
								consoleDebugLog('test 4');
								move = indexToCommand[(indexes[1][1])%4];
							  }else{
								consoleDebugLog('test 5');
								move = indexToCommand[maxIndex%4];
							  }
							  
							  
				
			}else{ /* йдемо попри стінку */
				consoleDebugLog('0001 - wallOnBack:'+wallOnBack+' - lessDistCounter:'+lessDistCounter);
				directMoveIndex = prevMoveIndex;
				
				if(sideWallRelativeIndex === false ){ /* якщо є індекс стіни і попереднього ходу */
					/* індекс стіни не заданий */
				
					sideWallRelativeIndex = (raitings[(4+directMoveIndex-1)%4] == -1 ? -1 : (raitings[(4+directMoveIndex+1)%4] == -1 ? +1 : 0 ));
					
					//sideWallRelativeIndex = directMoveIndex - wallIndex;
					
					
					consoleDebugLog('0002 - '+raitings[(4+directMoveIndex+sideWallRelativeIndex)%4] + ' - ' + (4+directMoveIndex+sideWallRelativeIndex)%4 + ' - ' + raitings[(4+directMoveIndex-1)%4] + ' - ' + raitings[(4+directMoveIndex+1)%4]);
				}
				
				 if(sideWallRelativeIndex == 0){
					 obhidMode = false;
					consoleDebugLog(obhidMode+' - obhidMode6');
					
					
					/* ходи по рейтингу! */
								
								
								var maxIndex = 0;
								var max = -Infinity;
								var ii = 0;
								var indexes = [];
												
												
								for (var i = 0; i < raitings.length; i++) {
									var r = raitings[i];
									if ( ( r > max /*|| i < 4*/ ) && i%4 != forbidIndex && r >= 0 ) { // todo доробити пріоритет на НЕ ТІЛО
									
										if(r > max && raitings[i%4] > -1){
										  maxIndex = i;
										  max = r;
										}
											var ind = [r,i];
										if(ind !== null){
											indexes[ii] = ind;
										}
											
										
										ii++;
										
									}
								}


							  indexes.sort(compareNumeric2);
							  //console.log(raitings);
							  //console.log(JSON.stringify(indexes));
							  
								var move;
							  
							  if(prefInd == maxIndex%4 ){  // якщо пріоритетне направлення співпало з найкращим по індексу =)
								consoleDebugLog('test 1');
									move = indexToCommand[prefInd];
							  }else if(raitings[maxIndex%4] > 0 && raitings[prefInd] > 0 && raitings[maxIndex%4] == raitings[prefInd] ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 1,5');
								move = indexToCommand[prefInd];
							  }else if(prefInd2 == maxIndex%4){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 2');
								move = indexToCommand[maxIndex%4];
							  }else if(prefInd2 != maxIndex%4 && raitings[maxIndex%4] == raitings[prefInd2]  ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 2.5');
								move = indexToCommand[prefInd2];
							  }else if(indexes[1] !== undefined && prefInd == (indexes[1][1])%4 && raitings[prefInd] > 0 ){	// якщо пріоритетне направлення співпало з другим найкращим по індексу 
								consoleDebugLog('test 3');
								move = indexToCommand[(indexes[1][1])%4];
							  }else if(indexes[1] !== undefined && prefInd2 == (indexes[1][1])%4 && raitings[prefInd2] > 0   ){	// якщо друге пріоритетне направлення співпало з другим найкращим по індексу 
								consoleDebugLog('test 4');
								move = indexToCommand[(indexes[1][1])%4];
							  }else{
								consoleDebugLog('test 5');
								move = indexToCommand[maxIndex%4];
							  }
							  
							  
							  
							  
				 }else{
				
					if( raitings[(4+directMoveIndex+sideWallRelativeIndex)%4] == -1){ /* стіна на місці, перевіряємо напрямок діагональ*/
						consoleDebugLog('0003');
						
						
						if(raitings[directMoveIndex] == -1){ /* прямо теж стіна */
							if( raitings[(4+directMoveIndex+sideWallRelativeIndex+2)%4] != -1){
								directMoveIndex = (4+directMoveIndex+sideWallRelativeIndex+2)%4;
								allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
								consoleDebugLog('0003-1 - '+allowMove+' '+directMoveIndex);
							}
							consoleDebugLog('0003-2');
						}
						
						if(sideWallRelativeIndex == -1){ /* стіна ліворуч */
							consoleDebugLog('0004');
								
							if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
								consoleDebugLog('0005');
								/* хід дозволено */
								allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
							}else{
								consoleDebugLog('0006');
								/* потрібен інший напрям - праворуч */
								directMoveIndex = (directMoveIndex+1)%4; /* ми маємо напрямок прямо */
								
								if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
									consoleDebugLog('0007');
									/* хід дозволено */
									allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
								}else{
									consoleDebugLog('0008');
									/* dead snake */
									
								}
							}
						}else if(sideWallRelativeIndex == 1){ /* стіна праворуч */
							consoleDebugLog('0009');
							
							if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
								/* хід дозволено */
								allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
								consoleDebugLog('00010 - '+allowMove);
							}else{
								consoleDebugLog('00011');
								/* потрібен інший напрям - ліворуч */
								directMoveIndex = (4+directMoveIndex-1)%4; /* ми маємо напрямок прямо */
								
								if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
									consoleDebugLog('00012');
									/* хід дозволено */
									allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
								}else{
									consoleDebugLog('00013');
									/* dead snake */
									
								}
							}
						}
						
					}else{ /* якщо стіни нема, міняємо напрямок в цю сторону, але додатково перевіряємо чи порожньо з іншої сторони і по діагоналі вперед від стіни */
					
						/* якщо стіни нема, то її треба пошукати !!! */
						sideWallRelativeIndex = 0;
						
						if(raitings[(4+directMoveIndex+1)%4] == -1){
							sideWallRelativeIndex = 1; /* стіна праворуч */
						}
						
						if(raitings[(4+directMoveIndex-1)%4] == -1){
							sideWallRelativeIndex = -1; /* стіна ліворуч */
						}
						
						
						if(raitings[directMoveIndex] == -1 && sideWallRelativeIndex == 0){  /* контрольна перевірка - стіна прямо */
							
								/* ходи по рейтингу! */
								
								
								var maxIndex = 0;
								var max = -Infinity;
								var ii = 0;
								var indexes = [];
												
												
								for (var i = 0; i < raitings.length; i++) {
									var r = raitings[i];
									if ( ( r > max /*|| i < 4*/ ) && i%4 != forbidIndex && r >= 0 ) { // todo доробити пріоритет на НЕ ТІЛО
									
										if(r > max && raitings[i%4] > -1){
										  maxIndex = i;
										  max = r;
										}
											var ind = [r,i];
										if(ind !== null){
											indexes[ii] = ind;
										}
											
										
										ii++;
										
									}
								}


							  indexes.sort(compareNumeric2);
							  //console.log(raitings);
							  //console.log(JSON.stringify(indexes));
							  
								var move;
							  
							  if(prefInd == maxIndex%4 ){  // якщо пріоритетне направлення співпало з найкращим по індексу =)
								consoleDebugLog('test 1');
									move = indexToCommand[prefInd];
							  }else if(raitings[maxIndex%4] > 0 && raitings[prefInd] > 0 && raitings[maxIndex%4] == raitings[prefInd] ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 1,5');
								move = indexToCommand[prefInd];
							  }else if(prefInd2 == maxIndex%4){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 2');
								move = indexToCommand[maxIndex%4];
							  }else if(prefInd2 != maxIndex%4 && raitings[maxIndex%4] == raitings[prefInd2]  ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
								consoleDebugLog('test 2.5');
								move = indexToCommand[prefInd2];
							  }else if(indexes[1] !== undefined && prefInd == (indexes[1][1])%4 && raitings[prefInd] > 0 ){	// якщо пріоритетне направлення співпало з другим найкращим по індексу 
								consoleDebugLog('test 3');
								move = indexToCommand[(indexes[1][1])%4];
							  }else if(indexes[1] !== undefined && prefInd2 == (indexes[1][1])%4 && raitings[prefInd2] > 0   ){	// якщо друге пріоритетне направлення співпало з другим найкращим по індексу 
								consoleDebugLog('test 4');
								move = indexToCommand[(indexes[1][1])%4];
							  }else{
								consoleDebugLog('test 5');
								move = indexToCommand[maxIndex%4];
							  }
							  
							  
							  
							  
							  
							
						}
						
						
					
						consoleDebugLog('00014');
						directMoveIndex = (4+directMoveIndex+sideWallRelativeIndex)%4;
						//if( raitings[(4+directMoveIndex+sideWallRelativeIndex)%4] == -1){ /* стіна на місці, перевіряємо напрямок діагональ*/
							
							
							if(directMoveIndex != preferIndex1 && directMoveIndex != preferIndex2  ){
								obhidMode = false;
							}else{
								
								
							if(sideWallRelativeIndex == -1){ /* стіна ліворуч */
								consoleDebugLog('00015');
									
								if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
									consoleDebugLog('00016');
									/* хід дозволено */
									allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
								}else{
									consoleDebugLog('00017');
									/* потрібен інший напрям - праворуч */
									directMoveIndex = (directMoveIndex+1)%4; /* ми маємо напрямок прямо */
									
									if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
										consoleDebugLog('00018');
										/* хід дозволено */
										allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
									}else{
										consoleDebugLog('00019');
										/* потрібен інший напрям - ще раз праворуч */
										
										directMoveIndex = (directMoveIndex+1)%4; /* ми маємо напрямок прямо */
									
										if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
											consoleDebugLog('00020');
											/* хід дозволено */
											allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
										}else{
											consoleDebugLog('00021');
											/* dead snake */
											
											
										}
									}
								}
							}else if(sideWallRelativeIndex == 1){ /* стіна праворуч */
								consoleDebugLog('00022');
								
								if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
									consoleDebugLog('00023');
									/* хід дозволено */
									allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
								}else{
									consoleDebugLog('00024');
									/* потрібен інший напрям - ліворуч */
									directMoveIndex = (4+directMoveIndex-1)%4; /* ми маємо напрямок прямо */
									
									if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
										consoleDebugLog('00025');
										/* хід дозволено */
										allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
									}else{
										consoleDebugLog('00026');
										/* потрібен інший напрям - ще раз ліворуч */
										directMoveIndex = (4+directMoveIndex-1)%4; /* ми маємо напрямок прямо */
									
										if(checkDiag(directMoveIndex,sideWallRelativeIndex,raitings)){
											consoleDebugLog('00027');
											/* хід дозволено */
											allowMove = checkIfIcanGoNearWall(directMoveIndex,sideWallRelativeIndex,forbidIndex,prevMoveIndex,raitings);
										}else{
											consoleDebugLog('00028');
											/* dead snake */
											
										}
									}
								}
							}
						}	
					}
					
				}
			}
		
		
			consoleDebugLog('000333 '+directMoveIndex);
			if(allowMove == true){
				move = indexToCommand[directMoveIndex];
			}
		
			
				
			
		}else{ /* вимкнено */
			
				consoleDebugLog('obhidMode вимкнено debug 3');
				
				
				var maxIndex = 0;
				var max = -Infinity;
				var ii = 0;
				var indexes = [];
				
		
		
		
				//console.log(forbidIndex + ' - ' + preferIndex1 + ' - ' + preferIndex2 + ' - ' + prefInd + ' - ' + prefInd2 + ' -- ' + raitings[0%4]);
				
				for (var i = 0; i < raitings.length; i++) {
					var r = raitings[i];
					if ( ( r > max /*|| i < 4*/ ) && i%4 != forbidIndex && r >= 0 ) { // todo доробити пріоритет на НЕ ТІЛО
					
						if(r > max && raitings[i%4] > -1){
						  maxIndex = i;
						  max = r;
						}
							var ind = [r,i];
						if(ind !== null){
							indexes[ii] = ind;
						}
							
						
						ii++;
						
					}
				}


			  indexes.sort(compareNumeric2);
			  //console.log(raitings);
			  //console.log(JSON.stringify(indexes));
			  
				var move;
			  
			  if(prefInd == maxIndex%4 ){  // якщо пріоритетне направлення співпало з найкращим по індексу =)
				consoleDebugLog('test 1');
					move = indexToCommand[prefInd];
			  }else if(raitings[maxIndex%4] > 0 && raitings[prefInd] > 0 && raitings[maxIndex%4] == raitings[prefInd] ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
				consoleDebugLog('test 1,5');
				move = indexToCommand[prefInd];
			  }else if(prefInd2 == maxIndex%4){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
				consoleDebugLog('test 2');
				move = indexToCommand[maxIndex%4];
			  }else if(prefInd2 != maxIndex%4 && raitings[maxIndex%4] == raitings[prefInd2]  ){	// якщо друге пріоритетне направлення співпало з найкращим по індексу 
				consoleDebugLog('test 2.5');
				move = indexToCommand[prefInd2];
			  }else if(indexes[1] !== undefined && prefInd == (indexes[1][1])%4 && raitings[prefInd] > 0 ){	// якщо пріоритетне направлення співпало з другим найкращим по індексу 
				consoleDebugLog('test 3');
				move = indexToCommand[(indexes[1][1])%4];
			  }else if(indexes[1] !== undefined && prefInd2 == (indexes[1][1])%4 && raitings[prefInd2] > 0   ){	// якщо друге пріоритетне направлення співпало з другим найкращим по індексу 
				consoleDebugLog('test 4');
				move = indexToCommand[(indexes[1][1])%4];
			  }else{
				consoleDebugLog('test 5');
				move = indexToCommand[maxIndex%4];
			  }
			  
			  
				
				
		}
	}else{
		move = indexToCommand[directMoveIndex];
		consoleDebugLog('testt 1');
	}
	
	  
		prev_move = move;
		prevDist = prefer[0];
		var returnval;

		if(evilCounter > 2 && evilOn == 1){
			returnval = '('+move+',ACT)';
		}else{			
			returnval = move;
		}
	
	
	
	
	
   return returnval;
	
}




