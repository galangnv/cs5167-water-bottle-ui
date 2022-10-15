window.addEventListener('pageshow', updateClock);
window.addEventListener('keydown', simulate);
setInterval(updateClock, 1000);
setInterval(updateSimTime, 40);
let simMode = false;
let todayMode = true;
let simTime = new Date('10/19/2022 08:00:00');
let history;
let events;
let eventTimes;
let simEventNum;
let simProgressAmount;
let goal = 64;
let mainHistory = [57, 73, 68, 30];
let infoNum = 0;

async function simulate(event) {
    switch (event.key) {
        case 's':
            if (!simMode) {
                todayMode = true;
                infoNum = 0;
                let response_1 = await fetch('js/history.json');
                history = await response_1.json();

                let response_2 = await fetch('js/events.json');
                events = await response_2.json();

                let time = new Date(simTime);
                document.getElementById('date').innerHTML = time.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
                document.getElementById('time').innerHTML = time.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
                simProgressAmount = 0;
                simEventNum = 0;
                updateProgress(simProgressAmount);
                displayHistory([
                    history.four_days_ago.drink_amount,
                    history.three_days_ago.drink_amount,
                    history.two_days_ago.drink_amount,
                    history.one_day_ago.drink_amount
                ]);
                eventTimes = events.map(function (ev) { return new Date(ev.time).toString(); });

                simMode = true;
                updateInfo(0, 0);
            }
            break;
    }
}

function displaySimulationEvent() {
    let header = document.createElement('span');
    header.className = 'sim-event-header';
    let simHeaderText;
    switch (events[simEventNum].type) {
        case 'start':
            simHeaderText = document.createTextNode('Start of simulation');
            break;
        case 'fill':
            simHeaderText = document.createTextNode('Fill water bottle completely');
            break;
        case 'drink':
            simHeaderText = document.createTextNode('Drink ' + events[simEventNum].drink_amount + 'oz');
            break;
    }
    header.append(simHeaderText);

    let newLine1 = document.createElement('br');

    let eventTime = new Date(events[simEventNum].time);

    let timeText = document.createTextNode(eventTime.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'}));

    let newLine2 = document.createElement('br');
    let newLine3 = document.createElement('br');

    let simTable = document.getElementById('sim-table');
    simTable.append(header);
    simTable.append(newLine1);
    simTable.append(timeText);
    simTable.append(newLine2);
    simTable.append(newLine3);
}

function displayFourDaysAgo() {
    todayMode = false;
    colorHistory(0);
    updateHistoryDate(0);
    updateProgress(mainHistory[0]);
    infoNum = 0;
    updateInfo(0, mainHistory[0]);
}

function displayThreeDaysAgo() {
    todayMode = false;
    colorHistory(1);
    updateHistoryDate(1);
    updateProgress(mainHistory[1]);
    infoNum = 0;
    updateInfo(0, mainHistory[1]);
}

function displayTwoDaysAgo() {
    todayMode = false;
    colorHistory(2);
    updateHistoryDate(2);
    updateProgress(mainHistory[2]);
    infoNum = 0;
    updateInfo(0, mainHistory[2]);
}

function displayOneDayAgo() {
    todayMode = false;
    colorHistory(3);
    updateHistoryDate(3);
    updateProgress(mainHistory[3]);
    infoNum = 0;
    updateInfo(0, mainHistory[3]);
}

function displayToday() {
    todayMode = true;
    colorHistory(4);
    updateClock();
    infoNum = 0;
    updateInfo(20, 23);
}

function colorHistory(primeDay) {
    card1 = document.getElementById('hist-card-1');
    card2 = document.getElementById('hist-card-2');
    card3 = document.getElementById('hist-card-3');
    card4 = document.getElementById('hist-card-4');
    card5 = document.getElementById('hist-card-5');

    switch (primeDay) {
        case 0:
            card1.style.backgroundColor = "#b1cfff";
            card2.style.backgroundColor = "#f1f1f1";
            card3.style.backgroundColor = "#f1f1f1";
            card4.style.backgroundColor = "#f1f1f1";
            card5.style.backgroundColor = "#f1f1f1";
            break;
        case 1:
            card1.style.backgroundColor = "#f1f1f1";
            card2.style.backgroundColor = "#b1cfff";
            card3.style.backgroundColor = "#f1f1f1";
            card4.style.backgroundColor = "#f1f1f1";
            card5.style.backgroundColor = "#f1f1f1";
            break;
        case 2:
            card1.style.backgroundColor = "#f1f1f1";
            card2.style.backgroundColor = "#f1f1f1";
            card3.style.backgroundColor = "#b1cfff";
            card4.style.backgroundColor = "#f1f1f1";
            card5.style.backgroundColor = "#f1f1f1";
            break;
        case 3:
            card1.style.backgroundColor = "#f1f1f1";
            card2.style.backgroundColor = "#f1f1f1";
            card3.style.backgroundColor = "#f1f1f1";
            card4.style.backgroundColor = "#b1cfff";
            card5.style.backgroundColor = "#f1f1f1";
            break;
        case 4:
            card1.style.backgroundColor = "#f1f1f1";
            card2.style.backgroundColor = "#f1f1f1";
            card3.style.backgroundColor = "#f1f1f1";
            card4.style.backgroundColor = "#f1f1f1";
            card5.style.backgroundColor = "#b1cfff";
    }
}

function updateProgress(newProgress) {
    progress = getProgressPercent(newProgress);
    progressBar = document.getElementById('actual-progress');
    document.getElementById('main-percent').innerHTML = progress + '%';
    if (progress < 100) {
        progressBar.style.strokeDashoffset = 600 - (6 * progress);
        progressBar.style.stroke = "#427fe0";
    } else {
        progressBar.style.strokeDashoffset = 600 - (6 * 100);
        progressBar.style.stroke = "#a2f8a6";
    }
    if (todayMode) {
        document.getElementById('hist-card-percent-5').innerHTML = progress + '%';
    }
}

function getProgressPercent(progress) {
    return Math.round((progress / goal) * 100);
}

function displayHistory(history) {
    document.getElementById('hist-card-percent-1').innerHTML = getProgressPercent(history[0]) + '%';
    document.getElementById('hist-card-percent-2').innerHTML = getProgressPercent(history[1]) + '%';
    document.getElementById('hist-card-percent-3').innerHTML = getProgressPercent(history[2]) + '%';
    document.getElementById('hist-card-percent-4').innerHTML = getProgressPercent(history[3]) + '%';
}

function updateSimTime() {
    if (simMode) {
        simTime.setMinutes(simTime.getMinutes() + 1);
        document.getElementById('time').innerHTML = simTime.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
        if (eventTimes.includes(simTime.toString())) {
            updateSimState();
        }
    }
}

function updateSimState() {
    simProgressAmount += events[simEventNum].drink_amount;
    updateInfo(events[simEventNum].water_level, simProgressAmount);
    updateProgress(simProgressAmount);
    displaySimulationEvent();
    simEventNum++;
}

function updateHistoryDate(primeDay) {
    let today = new Date();
    switch (primeDay) {
        case 0:
            today.setDate(today.getDate() - 4);
            document.getElementById('date').innerHTML = today.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
            document.getElementById('time').innerHTML = '4 days ago';
            break;
        case 1:
            today.setDate(today.getDate() - 3);
            document.getElementById('date').innerHTML = today.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
            document.getElementById('time').innerHTML = '3 days ago';
            break;
        case 2:
            today.setDate(today.getDate() - 2);
            document.getElementById('date').innerHTML = today.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
            document.getElementById('time').innerHTML = '2 days ago';
            break;
        case 3:
            today.setDate(today.getDate() - 1);
            document.getElementById('date').innerHTML = today.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
            document.getElementById('time').innerHTML = '1 day ago';
            break;
    }
}

function updateInfo(water_level, drink_amount) {
    infoText = document.getElementById('info-text');
    if (todayMode) {
        infoText.style.color = "black";
        document.getElementById('left-arrow-area').style.color = "#838383";
        document.getElementById('right-arrow-area').style.color = "#838383";
        switch (infoNum) {
            case 0:
                infoText.innerHTML = "You've drank " + drink_amount + "oz today";
                break;
            case 1:
                let remainder = goal - drink_amount;
                if (remainder > 0) {
                    infoText.innerHTML = "You have " + (goal - drink_amount) + "oz left";
                } else {
                    infoText.innerHTML = "You reached your goal!"
                }
                break;
            case 2:
                infoText.innerHTML = "Water level: " + water_level + "oz";
        }
    } else {
        infoText.innerHTML = "You drank " + drink_amount + "oz";
        document.getElementById('left-arrow-area').style.color = "white";
        document.getElementById('right-arrow-area').style.color = "white";
    }
}

function changeInfoLeft() {
    infoNum--;
    if (infoNum < 0) {
        infoNum = 2;
    }
    if (simMode) {
        updateInfo(events[simEventNum - 1].water_level, simProgressAmount);
    } else {
        updateInfo(20, 23);
    }
}

function changeInfoRight() {
    infoNum++;
    if (infoNum > 2) {
        infoNum = 0;
    }
    if (simMode) {
        updateInfo(events[simEventNum - 1].water_level, simProgressAmount);
    } else {
        updateInfo(20, 23);
    }
}

function updateClock() {
    if (!simMode && todayMode) {
        let today = new Date();
        document.getElementById('date').innerHTML = today.toLocaleDateString([], {weekday: 'long', month: 'long', day: 'numeric', year: 'numeric'});
        document.getElementById('time').innerHTML = today.toLocaleTimeString([], {hour: 'numeric', minute:'2-digit'});
        prevFiveDays(today);
        displayHistory(mainHistory);
        updateProgress(23);
        updateInfo(20, 23);
    }
}

function prevFiveDays(today) {
    document.getElementById('hist-card-5-day').innerHTML = today.toLocaleDateString([], {weekday: 'short'});

    today.setDate(today.getDate() - 1);
    document.getElementById('hist-card-4-day').innerHTML = today.toLocaleDateString([], {weekday: 'short'});

    today.setDate(today.getDate() - 1);
    document.getElementById('hist-card-3-day').innerHTML = today.toLocaleDateString([], {weekday: 'short'});

    today.setDate(today.getDate() - 1);
    document.getElementById('hist-card-2-day').innerHTML = today.toLocaleDateString([], {weekday: 'short'});

    today.setDate(today.getDate() - 1);
    document.getElementById('hist-card-1-day').innerHTML = today.toLocaleDateString([], {weekday: 'short'});
}