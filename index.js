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
import { getNextSnakeMove } from './bot';
import { getBoardAsString } from './utils';

/*
	board[218] = '☼';
	board[219] = '☼';
	*/
	
	//console.log(board[217]);
	
var URL = process.env.GAME_URL || '';
var url = URL.replace("http", "ws").replace("board/player/", "ws?user=").replace("?code=", "&code=");

var socket = new WebSocket(url);

socket.addEventListener('open', function (event) {
    console.log('Open');
});

socket.addEventListener('close', function (event) {
    console.log('Closed');
});

socket.addEventListener('message', function (event) {
    var pattern = new RegExp(/^board=(.*)$/);
    var message = event.data;
    var parameters = message.match(pattern);
    var board = parameters[1];
    var answer = processBoard(board);
    socket.send(answer);
});


function getMySize(board){
	
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

	var selfSize = 0;
	board.split('').forEach(x => {
	   if (SELF_ELEMENTS.indexOf(x) > -1) {
		   selfSize += 1;
	   }
	});
	
	return selfSize;

}

function processBoard(board) {
	
	
	
    var programLogs = "";
    function logger(message) {
        programLogs += message + "\n"
    }
    var answer = getNextSnakeMove(board, logger);
    var boardString = getBoardAsString(board);
	

    var logMessage = boardString + "\n\n";
    if (programLogs) {
        logMessage += "-----------------------------------\n";
        logMessage += programLogs;
    }
    logMessage += "Answer: " + answer + "\n";
    logMessage += "myLength: " + getMySize(board) + "\n";
    logMessage += "-----------------------------------\n";
    logMessage += "-----------------------------------"+document.getElementById("log-area").value.length+"\n";
    logMessage += "-----------------------------------\n";

    printBoard(boardString);
    printLog(logMessage);
	
	//console.log(board[217]);
	//console.log(board);
    return answer;
}

function printBoard(text) {
    var textarea = document.getElementById("board");
    if (!textarea) {
        return;
    }
    var size = text.split('\n')[0].length;
    textarea.cols = size;
    textarea.rows = size + 1;
    textarea.value = text;
}

function clearall() {
    document.getElementById("log-area").value = '';
    /*document.getElementById("log-txt").value = '';*/
}

function printLog(text) {
    var textarea = document.getElementById("log-area");
	var la_length = document.getElementById("log-area").value.length;
	var la_val = textarea.value;
	
	if(la_length > 50000){
		var la_val = la_val.substring(0, 50000);
	}
	
	
    /*var logtxt = document.getElementById("log-txt");*/
    var addToEnd = document.getElementById("add-to-end");
    //var stopall = document.getElementById("stopall");
    var printlog_check = document.getElementById("printlog");
    if (!textarea || !addToEnd) {
        return;
    }
	/*
    if (!stopall.checked) {
	logtxt.value =  text + "\n" + logtxt.value;
	}
	*/
    if (printlog_check.checked) {
		
		if (addToEnd.checked) {
			textarea.value = la_val + "\n" + text;
		} else {
			textarea.value = text + "\n" + la_val;
		}
	}
}
