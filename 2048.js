(function ($) {

    $.fn.game2048 = function (options) {

        let grid;
        let scoreUp;

        function getCookie(cname) {
            var name = cname + "=";
            var decodedCookie = decodeURIComponent(document.cookie);
            var ca = decodedCookie.split(';');
            for (var i = 0; i < ca.length; i++) {
                var c = ca[i];
                while (c.charAt(0) == ' ') {
                    c = c.substring(1);
                }
                if (c.indexOf(name) == 0) {
                    return c.substring(name.length, c.length);
                }
            }
            return "";
        }

        function arraysEqual(a1, a2) {
            return JSON.stringify(a1) == JSON.stringify(a2);
        }

        function setup() {
            grid = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            setupRandomNumber();
            setupRandomNumber();
            fillTheGrid();
            $('.bestScore').text(getCookie('bestScore'));
        }

        function color(value) {
            var color = { 2: '#eee4da', 4: '#ece0c8', 8: '#f0af77', 16: '#ee8b54', 32: '#f37856', 64: '#e25237', 128: '#f2d86a', 256: '#f2d86a', 512: '#e1c12e', 1024: '#e0b914', 2048: '#5eda92' };
            return color[value];
        }

        function score(value) {

            var score = $('.score').text();
            score = parseInt(score);
            score += value;
            if (value > 0) {
                scoreUp += value;
            }
            $('.scoreUp').show();
            $('.score').text(score);
            $('.scoreUp').addClass('fadeOutUp animated');
            bestScore(score);
        }

        function bestScore(value) {
            var currentScore = $('.score').text();
            currentScore = parseInt(currentScore);
            var bestScore = $('.bestScore').text();
            bestScore = parseInt(bestScore);
            if (bestScore < currentScore) {
                $('.bestScore').text(currentScore);
                document.cookie = "bestScore=" + currentScore + "; expires=Thu, 18 Dec 2020 12:00:00 UTC";
            }
        }

        function setupRandomNumber() {
            $(".tile-new").removeClass("tile-new");
            let options = [];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] === 0) {
                        options.push({ x: i, y: j });
                    }
                }
            }
            let randomOptions = options[Math.floor(Math.random() * options.length)];
            let twoOrFour = Math.random(1);
            grid[randomOptions.x][randomOptions.y] = twoOrFour < 0.9 ? 2 : 4; // 90% de 2 - 10% de 4
            $('#' + randomOptions.x + randomOptions.y).addClass('tile-new');
        }

        function fillTheGrid() {
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    let value = grid[i][j];

                    if (grid[i][j] !== 0) {
                        $('#' + i + j).text(value);
                        $('#' + i + j).css('background-color', color(grid[i][j]));
                    }
                    else {
                        $('#' + i + j).text('');
                        $('#' + i + j).css('background-color', '#CDC1B4');
                    }
                }

            }
        }

        function moveLR(row, direction) {
            let tab = row.filter(val => val);
            let missings = 4 - tab.length;
            let zeros = Array(missings).fill(0);
            if (direction === 1) {
                row = zeros.concat(tab);
            }
            else if (direction === -1) {
                row = tab.concat(zeros);
            }

            return row;
        }

        function moveUD(col, direction, index) {
            // 1 is UP -- -1 is DOWN
            let tab = col.filter(val => val);
            let missings = 4 - tab.length;
            let zeros = Array(missings).fill(0);
            if (direction === 1) {
                col = tab.concat(zeros);
            }
            else if (direction === -1) {
                col = zeros.concat(tab);
            }
            for (let i = 0; i < 4; i++) {
                grid[i][index] = col[i];
            }

        }

        function additionRow(row, direction) {
            if (direction === 1) {
                for (let i = 3; i > 0; i--) {
                    if (row[i] === row[i - 1]) {
                        row[i] += row[i - 1];
                        score(row[i]);
                        row[i - 1] = 0;
                    }
                }
            }
            else if (direction === -1) {
                for (let i = 0; i < 3; i++) {
                    if (row[i] === row[i + 1]) {
                        row[i] += row[i + 1];
                        score(row[i]);
                        row[i + 1] = 0;
                    }
                }
            }
        }

        function additionCol(col, direction, index) {
            if (direction === 1) {
                for (let i = 0; i < 3; i++) {
                    if (col[i] === col[i + 1]) {
                        col[i] += col[i + 1];
                        score(col[i]);
                        col[i + 1] = 0;
                    }
                }
                //On rempli la grid
                for (let i = 0; i < 4; i++) {
                    grid[i][index] = col[i];
                }
            }
            else if (direction === -1) {
                for (let i = 3; i > 0; i--) {
                    if (col[i] === col[i - 1]) {
                        col[i] += col[i - 1];
                        score(col[i]);
                        col[i - 1] = 0;
                    }
                }

                //On rempli la grid
                for (let i = 0; i < 4; i++) {
                    grid[i][index] = col[i];
                }
            }
        }

        $(document).keydown(function (e) {
            let previousGrid = duplicateArray();
            scoreUp = 0;

            if ((e.keyCode || e.which) == 39) {
                for (let i = 0; i < 4; i++) {
                    grid[i] = moveLR(grid[i], 1);
                    additionRow(grid[i], 1);
                    grid[i] = moveLR(grid[i], 1);
                }
                if (!arraysEqual(previousGrid, grid)) {
                    setupRandomNumber();
                }
                fillTheGrid();

            }
            if ((e.keyCode || e.which) == 37) {
                for (let i = 0; i < 4; i++) {
                    grid[i] = moveLR(grid[i], -1);
                    additionRow(grid[i], -1);
                    grid[i] = moveLR(grid[i], -1);
                }
                if (!arraysEqual(previousGrid, grid)) {
                    setupRandomNumber();
                }
                fillTheGrid();
            }

            //Down key
            if ((e.keyCode || e.which) == 40) {

                for (let i = 0; i < 4; i++) {
                    moveUD(extractCol(i), -1, i);
                    additionCol(extractCol(i), -1, i);
                    moveUD(extractCol(i), -1, i);
                }

                if (!arraysEqual(previousGrid, grid)) {
                    setupRandomNumber();
                }
                fillTheGrid();
            }

            //Up key
            if ((e.keyCode || e.which) == 38) {
                for (let i = 0; i < 4; i++) {
                    moveUD(extractCol(i), 1, i);
                    additionCol(extractCol(i), 1, i);
                    moveUD(extractCol(i), 1, i);
                }
                if (!arraysEqual(previousGrid, grid)) {
                    setupRandomNumber();
                }
                fillTheGrid();
            }

            if (checkLoose()) 
            {
                onOverlay();
            }

            if (scoreUp > 0) {
                $('.scoreUp').text('+' + scoreUp);
            }

            setTimeout(function () {
                $('.scoreUp').removeClass('fadeOutUp animated');
                $('.scoreUp').hide();
            }, 1000);
        });

        function duplicateArray() {
            var newArray = [
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0],
                [0, 0, 0, 0]
            ];
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    newArray[i][j] = grid[i][j];
                }
            }
            return newArray;
        }

        function checkLoose() {
            let loose = true;
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 3; j++) {
                    if (grid[i][j] === grid[i][j + 1]) // Lignes
                    {
                        loose = false;
                    }
                    else if (grid[j][i] === grid[j + 1][i]) // Colonnes
                    {
                        loose = false;
                    }
                }
            }
            for (let i = 0; i < 4; i++) {
                for (let j = 0; j < 4; j++) {
                    if (grid[i][j] === 0) 
                    {
                        loose = false;
                    }
                }
            }
            return loose;
        }

        // return column of the board
        function extractCol(col) {
            let colExtracted = [];
            for (let i = 0; i < 4; i++) {
                colExtracted.push(grid[i][col]);
            }
            return colExtracted;
        }

        function onOverlay() {
            $("#overlay").css('display', 'block');
        }

        $("#overlay").click(function () {
            $("#overlay").css('display', 'none');

        });

        $('.newGame button').click(function () {
            setup();
        });
        setup();
    };
}(jQuery));