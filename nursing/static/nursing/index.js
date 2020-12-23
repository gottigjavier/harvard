document.addEventListener('DOMContentLoaded', function() {
    ws_manager();
    rooms_sketch();
})

const TOTAL_ROOMS = 30,
TOTAL_BEDS = 2;


function ws_manager(){
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/polData/');
        ws.onopen = () => {
            console.log('contected');
        };

        ws.onmessage = e => {
            const msg = JSON.parse(e.data);
            console.log(msg);
            if (msg.state){
                create_call(msg);
            } else {
                delete_call(msg);
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

function create_call(msg){
    const msga = msg.source.split(',');
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
    const msga = msg.source.split(',');
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
            //document.getElementById(call_id).style.display = 'none';
        } catch {
            console.log('Skip Bed');
        }
    }
}

function rooms_sketch(){
        const $containerRooms = document.createElement('div');
        $containerRooms.setAttribute('class', 'row justify-content-center');
        const $fragmentRooms = document.createDocumentFragment();
    
    for (roomsCounter=1; roomsCounter<=TOTAL_ROOMS; roomsCounter++){
        const $room = document.createElement('div');
        $room.setAttribute('id', `${roomsCounter}`);
        $room.setAttribute('class', 'col-2 shadow-lg bg-light rounded m-1');
        const $room_head = document.createElement('div');
        $room_head.setAttribute('class', 'row justify-content-center shadow-lg bg-light rounded');
        const $room_beds = document.createElement('div');
        $room_beds.setAttribute('class', 'row text-center shadow-lg bg-light rounded');
        //console.log('room  ', roomsCounter);
        for (bedsCounter=1; bedsCounter<=TOTAL_BEDS; bedsCounter++){
            const $bed = document.createElement('div'),
            $bedIcon = document.createElement('i');
            $bedIcon.setAttribute('class', 'fas fa-bed');
            $bed.setAttribute('class', 'col shadow-lg rounded');
            $bed.setAttribute('id', `s-${roomsCounter},${bedsCounter}`);
            $bed.innerHTML = `Bed  ${bedsCounter}`;
            $bed.appendChild($bedIcon);
            $room_beds.appendChild($bed);
            //console.log('bed  ', bedsCounter);
        }
        $room_head.innerHTML = `<h4> Room ${roomsCounter} </h4>`;
        $room.appendChild($room_head);
        $room.appendChild($room_beds);
        $containerRooms.appendChild($room);
    }
    $fragmentRooms.appendChild($containerRooms);
    document.getElementById('rooms-sketch').appendChild($fragmentRooms);
}