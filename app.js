/* -----------------------
       SAMPLE DATA

Di 28-7:  Dag 7:00 - 16:00
Vr 31-7:  Dag 7:00 - 17:00
Za 01-8:  Dag 7:00 - 16:00
Zo 02-8:  Dag 7:00 - 16:00

----------------------- */

const textArea = document.querySelector('textarea');
const button = document.querySelector('button');
const calendarButton = document.querySelector('#download a');

let scheduleArray = [];
let workDays = [];

let month = "";
let day = "";
let hourStart = "";
let hourEnd = "";

let startTime = "";
let endTime = "";
let icsContent = "BEGIN:VCALENDAR\nVERSION:2.0";

function parse() {
    workDays = [];

    pastedSchedule = textArea.value;
    scheduleArray = pastedSchedule.toLowerCase().split("\n");

    for(let i = 0; i < scheduleArray.length; i++) {
        workDays.push(scheduleArray[i].slice(0,2));
        let currentDay = String(workDays[i]);

        month = String(scheduleArray[i].match(/-\d+/)[0]).slice(1,);
        
            if(month.length == 1) {
                month = "0"+month;
            }

        day = String(scheduleArray[i].match(/\d+/)[0]);

        hourStart = String(scheduleArray[i].match(/\w\s(\d+):/)[1]);

            if(hourStart.length == 1) {
                hourStart = "0"+hourStart;
            }

        hourEnd = String(scheduleArray[i].match(/-\s(\d+):/)[1]);

        startTime = startTime.concat("2020", month, day, "T", hourStart, "0000" );
        endTime = endTime.concat("2020", month, day, "T", hourEnd, "0000" );

        icsContent = icsContent.concat("\nBEGIN:VEVENT\nDTSTART:"+startTime+"\nDTEND:"+endTime+"\nSUMMARY:Picnic\nEND:VEVENT");

        startTime = "";
        endTime = "";

        setTimeout(() => {
            document.querySelector('#'+currentDay).classList.add('active');
        }, 40*i);
    }

    icsContent = icsContent.concat('\nEND:VCALENDAR');

    if(textArea.value!=='') {
        setTimeout(() => {
            calendarButton.classList.add('active');
        }, 100);
    } else {
        calendarButton.classList.remove('active');
    }
}

function downloadICS(filename, text) {

    // create <a> element
    let element = document.createElement('a');

    // set attributes
    element.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
    element.setAttribute('download', filename);

    // create a link, click to download and delete link
    element.style.display = 'none';
    document.body.appendChild(element);
    element.click();
    document.body.removeChild(element);
}

calendarButton.addEventListener('click', () => { 
    downloadICS("picnic.ics",icsContent);
});

textArea.addEventListener('change', () => {

    // Reset active states
    for(let i = 0; i < document.querySelectorAll('.calendar-day').length; i++) {
        document.querySelectorAll('.calendar-day')[i].classList.remove('active');
    }

    parse();
});