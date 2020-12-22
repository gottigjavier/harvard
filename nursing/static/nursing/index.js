document.addEventListener('DOMContentLoaded', function() {
    ws_manager();
    rooms_sketch();
})

function ws_manager(){
    const ws = new WebSocket('ws://127.0.0.1:8000/ws/polData/');
        ws.onopen = () => {
            console.log('contected');
        };

        ws.onmessage = e => {
            const msg = JSON.parse(e.data);
            console.log(msg);
            const $data = document.createElement('li');
        $data.innerHTML = 'state:  ' + msg.call + '    room: ' + msg.value;
        document.getElementById('calls').appendChild($data);
        };

        ws.onerror = e => {
            console.log(e);
        };

        ws.onclose = e => {
            console.log('closed');
            console.log(e);
        };
}

function rooms_sketch(){
    const TOTAL_ROOMS = 30,
        TOTAL_BEDS = 2;
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
        console.log('room  ', roomsCounter);
        for (bedsCounter=1; bedsCounter<=TOTAL_BEDS; bedsCounter++){
            const $bed = document.createElement('div'),
            $bedIcon = document.createElement('i');
            $bedIcon.setAttribute('class', 'fas fa-bed');
            $bed.setAttribute('class', 'col shadow-lg bg-light rounded');
            $bed.setAttribute('id', `${roomsCounter},${bedsCounter}`);
            $bed.innerHTML = `Bed: ${bedsCounter}`;
            $bed.appendChild($bedIcon);
            $room_beds.appendChild($bed);
            console.log('bed  ', bedsCounter);
        }
        $room_head.innerHTML = `<h4> Room ${roomsCounter} </h4>`;
        $room.appendChild($room_head);
        $room.appendChild($room_beds);
        $containerRooms.appendChild($room);
    }
    $fragmentRooms.appendChild($containerRooms);
    document.getElementById('rooms-sketch').appendChild($fragmentRooms);
}