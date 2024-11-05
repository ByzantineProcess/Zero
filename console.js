window.addEventListener('load', function() {
    document.getElementById('loading').style.display = 'none';
    var canvas = document.createElement('canvas');
    context = canvas.getContext('2d');
    imag = new Image();
    imag.src = 'coolsolebg.png';
    imag.onload = function() {
        canvas.width = imag.width;
        canvas.height = imag.height;
        context.drawImage(imag, 0, 0);
        document.getElementById('imgdiv').style.backgroundImage = "url('" + canvas.toDataURL() + "')";
    }
});

function unhideConsole() {
    var body = document.getElementsByTagName('body')[0];
    body.requestFullscreen()
    document.getElementById('game').style.display = 'block';
    document.getElementById('thebutton').style.display = "none";
    document.addEventListener('keydown', onKeyPress);
}

function onKeyPress(event) {
    if (/^[a-zA-Z]$/.test(event.key)) {
        addCharToName(event.key);
    }
}

let nameStr = "_____";
let nameIndex = 0;

function addCharToName(eventkey) {
    eventkey = eventkey.toUpperCase();
    // bad code
    switch (nameIndex) {
        case 0:
            nameStr = eventkey + "____";
            nameIndex++;
            break;
        case 1:
            nameStr = nameStr[0] + eventkey + "___";
            nameIndex++;
            break;
        case 2:
            nameStr = nameStr[0] + nameStr[1] + eventkey + "__";
            nameIndex++;
            break;
        case 3:
            nameStr = nameStr[0] + nameStr[1] + nameStr[2] + eventkey + "_";
            nameIndex++;
            break;
        case 4:
            nameStr = nameStr[0] + nameStr[1] + nameStr[2] + nameStr[3] + eventkey;
            nameIndex++;
            nameFinished();
            break;
        default:
            break;
    }
    document.getElementById('namespot').textContent = nameStr;
}

function nameFinished() {
    // deregister keypress event
    document.removeEventListener('keydown', onKeyPress);
    // async wait 3 seconds
    setTimeout(() => {
        document.getElementById('namentry').style.display = 'none';
        // document.getElementById('game').style.display = 'block';
        setTimeout(() => {
            document.getElementById('qas').style.display = 'block';
            document.getElementById('textentry').textContent = document.getElementById('textentry').textContent.replace("{}", nameStr);
            document.addEventListener('keydown', onKeyPressQuestion);
            questionStr = document.getElementById('textentry').textContent;
        }, 1000);
    }, 1000);
}

function onKeyPressQuestion(event) {
    // if event.key is one char long, add it to the question
    if (event.key.length === 1 && event.key !== ":") {
        addCharToQuestion(event.key.toUpperCase());
    }
}

let questionIndex = 0;
let questionStr = "";

function replaceCharAt(str, index, char) {
    if (index < 0 || index >= str.length) {
        throw new Error("Index out of bounds");
    }
    return str.substring(0, index) + char + str.substring(index + 1);
}

let shouldAcceptInput = true;

function addCharToQuestion(eventkey) {
    if (questionIndex < 4 && shouldAcceptInput) {
        tmp = questionStr.split(': ')[1];
        tmp = replaceCharAt(tmp, questionIndex, eventkey);
        questionStr = questionStr.split(' ')[0] + " " + tmp
    }
    else {
        shouldAcceptInput = false;
        setTimeout(() => {
            console.log("Handling question");
            tmp = questionStr.split(' ')[1];
            document.getElementById('textresponse').style.display = 'block';
            handleQuestion(tmp);
        }, 500);
    }
    document.getElementById('textentry').textContent = questionStr;
    questionIndex++;
    if (questionIndex === 4) {
        shouldAcceptInput = false;
        setTimeout(() => {
            console.log("Handling question");
            tmp = questionStr.split(' ')[1];
            document.getElementById('textresponse').style.display = 'block';
            handleQuestion(tmp);
        }, 500);
    }
}

function resetQuestion() {
    questionIndex = 0;
    questionStr = "{}: ____";
    questionStr = questionStr.replace("{}", nameStr);
    document.getElementById('textentry').textContent = questionStr;
    // document.getElementById('textresponse').textContent = "";
    shouldAcceptInput = true;
}

// as lore level increases, the player gets more and more hints
let loreLevel = 0;

let lore2hint = false;

let cmdCount = 0;

function handleQuestion(question) {
    let res = "COMPUTER:";
    switch (question) {
        case "HELP":
            if (loreLevel === 1) {
                res = res + "\nHELP, INFO, MATH,\n MRKT, NEWS, FILE,\n HOW2, EXIT"
            }
            else if (loreLevel === 2) {
                res = res + "\nHELP, INFO, MATH,\n MRKT, NEWS, FILE,\n HOW2, LOGS, HINT,\n EXIT"
            }
            else if (loreLevel === 3) {
                res = res + "\nHELP, INFO, MATH,\n MRKT, NEWS, FILE,\n HOW2, LOGS, SBUY,\n HINT, EXIT"
            }
            else {
                res = res + "\nHELP, INFO, MATH,\n MRKT, NEWS, FILE,\n EXIT"
            }
            document.getElementById('textresponse').textContent = res;
            break;
        case "INFO":
            res = res + "\nQAS 1989 V5.2\nCONNECTED TO MAINFRAME\n\nCOMMENT: \"decomm 1991\""
            document.getElementById('textresponse').textContent = res;
            break;
        case "MATH":
            res = res + "\nUSE +, -, *, / OPERATORS\nIN YOUR QUESTION"
            document.getElementById('textresponse').textContent = res;
            break;
        case "MRKT":
            if (loreLevel > 1) {
                res = res + "\nMARKET OPEN\nSTOCKS UP 0.5%\nUSE SBUY TO BUY STOCKS"
                loreLevel = 3;
            }
            else {
                res = res + "\nMARKET CLOSED\nTRY AGAIN LATER"
            }
            document.getElementById('textresponse').textContent = res;
            break;
        case "NEWS":
            res = res + "\nTODAY'S NEWS:\n\n ERR: FAILED TO LOAD"
            document.getElementById('textresponse').textContent = res;
            break;
        case "FILE":
            if (loreLevel === 4) {
                res = res + "\nAUTORECOVERY HAS\nRECOVERED 2 FILES\nASK AGAIN FOR MORE INFO"
                loreLevel = 5;
            }
            else if (loreLevel === 5) {
                res = res + "\n1 USER FILES FOUND\nSTORED IN 'zen' ACCOUNT\nUSE READ TO ACCESS"
            }
            else {
                res = res + "\n0 USER FILES FOUND\n0 DOWNLOADS FOUND\n1 LOG FOUND\nCHECK HOWTO TO ACCESS"
            }
            if (loreLevel < 1) {
                loreLevel = 1;
            }
            document.getElementById('textresponse').textContent = res;
            break
        case "HOW2":
            res = res + "\nQAS 1989 V5.2 SYSADMIN MANUAL\nQAS USES BASE-FILESYSTEM 32\nTO ACCESS LOGS, TYPE LOGS\nTO EXIT, TYPE EXIT"
            document.getElementById('textresponse').textContent = res;
            loreLevel = 2;
            break;
        case "LOGS":
            res = res + "\n1991-09-22\nMNQW45DTORXXA2LU\nMNQW46LPOVUGK3DQ\nM5XXI33NMFZGWZLU"
            document.getElementById('textresponse').textContent = res;
            loreLevel = 2;
            break
        case "SBUY":
            if (loreLevel > 2) {
                res = res + "\nBUYING USING ACCOUNT 'zen'\nFAILURE: MISCONFIGURED\nFIX AND TRY AGAIN"
                loreLevel = 4;
            }
            else {
                res = res + "\nMARKET CLOSED\nTRY AGAIN LATER"
            }
            document.getElementById('textresponse').textContent = res;
            break
        case "READ":
            if (loreLevel === 5) {
                res = res + "\nREADING 'zen' ACCOUNT:\n\"if you're reading this,\nit might be too late.\ndivide by zero.\""
            }
            else {
                res = res + "\nNO FILES TO READ\nTRY AGAIN LATER"
            }
            document.getElementById('textresponse').textContent = res;
            break;
        case "HINT":
            if (loreLevel === 2) {
                res = res + "\nwhat file system\n is this again?\nHOW2 can help"
                lore2hint = true;
            }
            else if (loreLevel === 4) {
                res = res + "\nwhere would you find\na config *file*?"
            }
            else if (lore2hint) {
                res = res + "\nthe logs are base32 encoded."
                lore2hint = false;
            }
            else {
                res = res + "\nNO HINTS AVAILABLE"
            }
            document.getElementById('textresponse').textContent = res;
            break;
        case "EXIT":
            res = res + "\nFAILED TO EXIT\nTRY AGAIN SOMETIME"
            document.getElementById('textresponse').textContent = res;
            // if (loreLevel < 1) {
            //     loreLevel = 1;
            // }
            break;
        default:
            // does the question contain a math operation?
            if (question.includes("+") || question.includes("-") || question.includes("*") || question.includes("/")) {
                // yes, it does
                try {
                    let result = eval(question);
                    res = res + "\n" + result;
                    document.getElementById('textresponse').textContent = res;
                } catch (e) {
                    res = res + "\nINVALID QUESTION";
                    document.getElementById('textresponse').textContent = res;
                }
            } else {
                res = res + "\nINVALID QUESTION\nTYPE HELP TO SEE\n AVAILABLE QUESTIONS";
                document.getElementById('textresponse').textContent = res;
            }

            break;
    }
    shouldAcceptInput = true;
    resetQuestion();
    if (question.endsWith("/0")) {
        // dbz!
        dbzAnim();
        shouldAcceptInput = false;
    }
    cmdCount++;
}

function sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

function dbzAnim() {
    // the player has just figured out that dbz is how to "finish" the game
    // we need to animate the dbz scene
    // the text should be hidden
    document.getElementById('game').style.display = 'none';
    // now, css animations
    // the background image should scale down to be a thin line in the center
    document.getElementById('imgdiv').style.animation = "scaleYDown 0.15s forwards";
    // after 0.5 seconds, scale the X down as well
    setTimeout(() => {
        document.getElementById('imgdiv').style.animation += ", scaleXDown 0.25s forwards";
        // sync wait
        sleep(250);
        document.getElementById('dot').style.display = 'block';
        document.getElementById('dot').style.animation = "scaleUp 0.3s forwards";
        setTimeout(() => {
            document.getElementById('imgdiv').style.display = 'none';
            document.getElementById('dot').style.animation += ", scaleDown 1s forwards";
            setTimeout(() => {
                // postgame stuff
                document.getElementById('postgame').style.display = 'block';
            }, 3000);
        }, 500);
    }, 300);
}