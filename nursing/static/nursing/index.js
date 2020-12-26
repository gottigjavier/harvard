document.addEventListener('DOMContentLoaded', function() {
    rooms_sketch();
    ws_manager();
})

// Section websocket - channel through consumer.py ------------------------------
function ws_manager(){
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/polData/');
        ws.onopen = () => {
            console.log('contected');
        };

        ws.onmessage = e => {
            const msg = JSON.parse(e.data);
            console.log(msg);
            if (msg.state){
                create_call(msg.source);
            } else {
                delete_call(msg.source);
            }
        };

        ws.onerror = e => {
            console.log(e);
        };

        ws.onclose = e => {
            console.log('closed');
            console.log(e);
        };
}
// End section websocket - channel --------------------------

// Section http trhough views.py --------------------------
const TOTAL_ROOMS = 30,
TOTAL_BEDS = 2; // per room

let gListActiveBeds = [],
    gListActiveCalls =[],
    gListActiveTasks = [];


async function rooms_sketch(){
        const $containerRooms = document.createElement('div');
        $containerRooms.setAttribute('class', 'row justify-content-center');
        const $fragmentRooms = document.createDocumentFragment();

    // query to db for active beds, calls and tasks
    await fetch('http://localhost:8000/load')
    .then(response => response.json())
    .then(roomsState => {
        roomsState.forEach(element => {
            console.log('roomState element -> ', element);
            bedsElement = element['beds'];
            callsElement = element['calls'];
            tasksElement = element['tasks'];
            bedsElement.forEach(elementBed => {
                gListActiveBeds.push(elementBed['id_bed']);
            })
            //console.log('gListActiveBeds:  ', gListActiveBeds);
            callsElement.forEach(elementCall => {
                gListActiveCalls.push(elementCall['call']);
            })
            //console.log('gListActiveCall:  ', gListActiveCalls);
            tasksElement.forEach(elementTask => {
                gListActiveTasks.push(elementTask['programed_task']);
            })
            console.log('gListActiveTasks:  ', gListActiveTasks);
        })
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
            $bed.setAttribute('class', 'col shadow-lg rounded');
            $bed.setAttribute('id', `s-${bedId}`);
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
    gListActiveCalls.forEach(callElement => {
        create_call(callElement);
    })
}

function create_call(msg){
    const msga = msg.split(',');
    const room = msga[0];
    const bed = msga[1];
    let call_id = `${room},${bed}`; 
    if (!document.getElementById(`${call_id}`)){
        const $callElement = document.getElementById(`s-${call_id}`)
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
        $call.setAttribute('id', `${call_id}`);
        $call.setAttribute('class', 'call shadow-lg rounded');
        document.getElementById('calls').appendChild($call);
    } else {
        console.log('Repeated Call');
    }    
}

function delete_call(msg){
    const msga = msg.split(',');
    const room = msga[0];
    // Just one button per room to clear calls
    for (bed = 1; bed <= TOTAL_BEDS; bed++){
        let call_id = `${room},${bed}`;
        try{
            const $bedRemove = document.getElementById(`s-${call_id}`),
                $callRemove = document.getElementById(call_id);
            $bedRemove.style.backgroundColor = 'white';
            $bedRemove.style.color = 'black';
            $callRemove.remove()
            } catch {
            console.log('Skip Bed');
        }
    }
}