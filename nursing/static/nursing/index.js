document.addEventListener('DOMContentLoaded', function() {
    rooms_sketch();
    call_manager();

    // Event Listener
    document.addEventListener('click', event => {
        const elem = event;
        console.log('event', elem.path[1].id);
        if (elem.target.className.includes('task-event')){
            if (elem.path[1].id){
                const taskId = elem.path[1].id;
            edit_task(taskId);
            }
            //window.alert('task event');
        }
    })
})

// Section websocket - channel through consumer.py ------------------------------
function call_manager(){
    const call = new WebSocket('ws://127.0.0.1:8000/ws/callData/');
        call.onopen = () => {
            console.log('contected');
        };

        call.onmessage = e => {
            const msg = JSON.parse(e.data);
            console.log(msg);
            if (msg.state){
                active_call(msg.source);
            } else {
                delete_call(msg.source);
            }
        };

        call.onerror = e => {
            console.log(e);
        };

        call.onclose = e => {
            console.log('closed');
            console.log(e);
        };
}
// End section websocket - channel --------------------------

// Section http trhough views.py --------------------------
const TOTAL_ROOMS = 30,
TOTAL_BEDS = 4; // per room

let groomsStateList,
    gListActiveBeds = [],
    gListActivePatients = [],
    gListActiveCalls =[],
    gListActiveTasks = [];


async function rooms_sketch(){
        const $containerRooms = document.createElement('div');
        $containerRooms.setAttribute('class', 'row justify-content-center');
        const $fragmentRooms = document.createDocumentFragment();

    document.getElementById("myForm").style.display = "none";
    // query to db for active beds, calls and tasks
    await fetch('http://localhost:8000/load')
    .then(response => response.json())
    .then(roomsState => {
        groomsStateList = roomsState;
        console.log('roomStateList  -> ', groomsStateList);
    })
    .catch(error => {
        console.log('Error',error);
    });
    
    for (roomsCounter=1; roomsCounter<=TOTAL_ROOMS; roomsCounter++){
        const $room = document.createElement('div');
        $room.setAttribute('id', `${roomsCounter}`);
        $room.setAttribute('class', 'col-2 shadow-lg bg-light rounded m-1');
        const $room_head = document.createElement('div');
        $room_head.setAttribute('class', 'row justify-content-center shadow-lg bg-light rounded');
        const $room_beds = document.createElement('div');
        $room_beds.setAttribute('class', 'row text-center shadow-lg bg-light rounded');
        for (bedsCounter=1; bedsCounter<=TOTAL_BEDS; bedsCounter++){
            let bedId = `${roomsCounter},${bedsCounter}`;
            const $bed = document.createElement('div'),
            $bedIcon = document.createElement('i');
            $bedIcon.setAttribute('class', 'fas fa-bed');
            $bed.setAttribute('class', 'col shadow-lg rounded bed');
            $bed.setAttribute('id', `b-${bedId}`);
            $bed.innerHTML = `Bed  ${bedsCounter}`;
            $bed.appendChild($bedIcon);
            $room_beds.appendChild($bed);
        }
        $room_head.innerHTML = `<h4> Room ${roomsCounter} </h4>`;
        $room.appendChild($room_head);
        $room.appendChild($room_beds);
        $containerRooms.appendChild($room);
    }
    $fragmentRooms.appendChild($containerRooms);
    document.getElementById('rooms-sketch').appendChild($fragmentRooms);
    // if the page is reloaded, the information is not lost
    groomsStateList['beds'].forEach(bedObject => {
        active_bed(bedObject);
    })
    groomsStateList['calls'].forEach(callObject => {
        active_call(callObject['call']);
    })
    groomsStateList['tasks'].forEach(taskObject => {
        active_task(taskObject);
    })
}


function active_bed(bedObject){
    const bedId = bedObject['bed_id'];
    const bedData =  `Patient: ${bedObject.patient}\n Diagnosis: ${bedObject.diagnosis}`
    const activeBedId = `b-${bedId}`;
    const $bedElement = document.getElementById(activeBedId);
    $bedElement.setAttribute('title', `${bedData}`);
    $bedElement.style.backgroundColor = 'lime';
    $bedElement.style.color = 'black';
}


function active_call(callObject){
    const callId = callObject;
    const callIdSplit = callId.split(',');
    const room = callIdSplit[0];
    const bed = callIdSplit[1];
    let activeBedId = `b-${callId}`,
        activeCallId = `c-${callId}`; 
    if (!document.getElementById(`${activeCallId}`)){
        const $callElement = document.getElementById(activeBedId);
        $callElement.style.backgroundColor = 'red';
        $callElement.style.color = 'white';
        const $call = document.createElement('div'),
            $callRow1 = document.createElement('div'),
            $callRow2 = document.createElement('div'),
            $callBedIcon = document.createElement('i');
        $callRow1.setAttribute('class', 'row call-row');
        $callRow2.setAttribute('class', 'row call-row');
        $callBedIcon.setAttribute('class', 'fas fa-bed');
        $callRow1.innerHTML = 'Room ' + room;
        $callRow2.innerHTML = bed;
        $callRow2.appendChild($callBedIcon);
        $call.appendChild($callRow1);
        $call.appendChild($callRow2);
        $call.setAttribute('id', `${activeCallId}`);
        $call.setAttribute('class', 'call shadow-lg rounded');
        document.getElementById('calls').appendChild($call);
    } else {
        console.log('Repeated Call');
    }    
}

function delete_call(callId){
    const callIdSplit = callId.split(',');
    const room = callIdSplit[0];
    // Just one button per room to clear calls
    for (bed = 1; bed <= TOTAL_BEDS; bed++){
        let activeCallId = `c-${room},${bed}`,
            idBed = `${room},${bed}`;
            // active_bed() expects JSON
            bedObject = JSON.parse(`{"bed_id": "${idBed}"}`);
        try{
            const $callRemove = document.getElementById(activeCallId);
            $callRemove.remove();
            active_bed(bedObject);
            } catch {
            console.log('Skip Bed');
        }
    }
}


function active_task(tasksObject){
    const taskBed = tasksObject.bed;
    const programedTime = new Date(tasksObject.programed_time);
    const taskDate = programedTime.toLocaleString();
    const taskBedSplit = taskBed.split(',');
    const room = taskBedSplit[0];
    const bed = taskBedSplit[1];
    let activeBedId = `b-${taskBed}`,
        activeTaskId = `t-${taskBed}`; 
    const $taskElement = document.getElementById(activeBedId);
        $taskElement.style.backgroundColor = 'rgb(0, 119, 255)';
        $taskElement.style.color = 'white';
        const $task = document.createElement('div'),
            $taskRow1 = document.createElement('div'),
            $taskRow2 = document.createElement('div'),
            $taskBedIcon = document.createElement('i');
        $taskRow1.setAttribute('class', 'row task-row task-event');
        $taskRow2.setAttribute('class', 'row task-row task-event');
        $taskBedIcon.setAttribute('class', 'fas fa-bed task-event');
        $taskRow1.innerHTML = 'Room ' + room;
        $taskRow2.innerHTML = bed;
        $taskRow2.appendChild($taskBedIcon);
        $task.appendChild($taskRow1);
        $task.appendChild($taskRow2);
        $task.setAttribute('id', `${activeTaskId}`);
        $task.setAttribute('class', 'task shadow-lg rounded task-event');
        $task.setAttribute('title', `Scheduled time: ${taskDate}\n${tasksObject.task}`);
        document.getElementById('tasks').appendChild($task);   
}

function edit_task(taskId){
    const taskIdSplit = taskId.split('-');
    const roomBedSplit = taskIdSplit[1].split(',');
    clearform();
    document.getElementById("myForm").style.display = "block";
    document.getElementById("task-title").innerHTML = `Task        Room: ${roomBedSplit[0]} - Bed: ${roomBedSplit[1]}`;
    
    console.log(roomBedSplit);
}

function clearform() {
    document.querySelector("#task-text").value = "";
}
