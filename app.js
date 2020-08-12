// Define variables
const textArea = document.querySelector('textarea');
const button = document.querySelector('button');
const calendarButton = document.querySelector('#download a');
const locationCheckbox = document.querySelector('input[type="checkbox"]#location');
const customEventName = document.querySelector('input[type="text"]#event-name');

let icsContent = "";

// Main text-parsing function
function parse() {

    // Set empty variables
    let workDays = [];
    icsContent = "BEGIN:VCALENDAR\nVERSION:2.0";

    // Format pasted text and convert to array
    const scheduleArray = textArea.value.toLowerCase().split("\n");

    for(let i = 0; i < scheduleArray.length; i++) {

        // Add day to workDays array        
        workDays.push(scheduleArray[i].slice(0,2));

        // Define and format month
        let month = String(scheduleArray[i].match(/-\d+/)[0]).slice(1,);
            if(month.length == 1) {
                month = "0"+month;
            }

        // Define day
        let day = String(scheduleArray[i].match(/\d+/)[0]);

        // Define and format hourStart
        let hourStart = String(scheduleArray[i].match(/\w\s(\d+):/)[1]);
            if(hourStart.length == 1) {
                hourStart = "0"+hourStart;
            }

        // Define hourEnd
        let hourEnd = String(scheduleArray[i].match(/-\s(\d+):/)[1]);

        // Format times for ICS
        let startTime = "2020"+month+day+"T"+hourStart+"0000";
        let endTime = "2020"+month+day+"T"+hourEnd+"0000";

        // Add event to ICS
        icsContent = icsContent.concat("\nBEGIN:VEVENT\nDTSTART:"+startTime+"\nDTEND:"+endTime+"\nSUMMARY:Picnic\nEND:VEVENT");

        // Make days highlight on page
        setTimeout(() => {
            document.querySelector('#'+String(workDays[i])).classList.add('active');
        }, 40*i);

    }

    // End ICS
    icsContent = icsContent.concat('\nEND:VCALENDAR');

    // Make download button active
    if(textArea.value!=='') {
        setTimeout(() => {
            calendarButton.classList.add('active');
        }, 100);
    } else {
        calendarButton.classList.remove('active');
    }
}

// Function: Download ICS
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

// Download button
calendarButton.addEventListener('click', () => { 

    // Option: Location
    if(locationCheckbox.checked == true) {
        icsContent = icsContent.replace(/\n(END:VEVENT)/g, "\nLOCATION:Picnic\\, Achtseweg Noord 30-36\\, 5651 GG Eindhoven\\, Netherlands\nEND:VEVENT");
    }

    // Option: Custom event name
    if(customEventName.value !== "") {
        icsContent = icsContent.replace(/(SUMMARY:Picnic)/g, "SUMMARY:" + customEventName.value);
    }

    // Download ICS
    downloadICS("picnic.ics",icsContent);
});

// Listen for changes in inputfield
textArea.addEventListener('change', () => {

    // Remove active classes
    for(let i = 0; i < document.querySelectorAll('.calendar-day').length; i++) {
        document.querySelectorAll('.calendar-day')[i].classList.remove('active');
    }

    // Call main function
    parse();
});

// Remember settings

// Store option:Location Checkbox in localStorage
locationCheckbox.addEventListener("change", () => {
    localStorage.setItem('locationCheckbox', locationCheckbox.checked)
});

// Store option:Custom Event Name in localStorage
customEventName.addEventListener("change", () => {
    localStorage.setItem('customEventName', customEventName.value)
});

// Apply stored setting for Location Checkbox
if(localStorage.getItem('locationCheckbox') == 'true') {
    locationCheckbox.checked = true;
}

// Apply stored setting for Custom Event Name
if(localStorage.getItem('customEventName')) {
    customEventName.value = localStorage.getItem('customEventName');
}