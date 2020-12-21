document.addEventListener('DOMContentLoaded', function() {
    const $container = document.createElement('div');
    $container.setAttribute('class', 'container');
    
    for (row = 1; row < 6; row++){
        const $row = document.createElement('div');
        $row.setAttribute('class', 'row');
        for (let col=1; col<5; col++){
            const $col = document.createElement('div');
            $col.setAttribute('class', 'col border');
            const $buttonTrueA = document.createElement('button');
            $buttonTrueA.setAttribute('class', 'btn btn-success m-2');
            $buttonTrueA.setAttribute('id', `room${row}${col}bedA`);
            $buttonTrueA.innerHTML = `Room ${row}${col} Bed A`;
            const $buttonTrueB = document.createElement('button');
            $buttonTrueB.setAttribute('class', 'btn btn-success m-2');
            $buttonTrueB.setAttribute('id', `room${row}${col}bedB`);
            $buttonTrueB.innerHTML = `Room ${row}${col} Bed B`;
            const $buttonFalse = document.createElement('button');
            $buttonFalse.setAttribute('class', 'btn btn-danger m-2');
            $buttonFalse.setAttribute('id', `room${row}${col}`);
            $buttonFalse.innerHTML = `room${row}${col}`;
            $col.appendChild($buttonTrueA);
            $col.appendChild($buttonTrueB);
            $col.appendChild($buttonFalse);
            $row.appendChild($col);
        }
    $container.appendChild($row);
    }
    document.getElementById('rooms').appendChild($container);

    document.addEventListener('click', event => {
        const elem = event.target;
        console.log(elem.id);
        call(elem.id);
    });
});

const callSocket = new WebSocket(
    'ws://'
    + window.location.host
    + '/ws/polData/'
);

function call(call_id){
    let state;
    if(call_id.includes('bed')){
        state = true;
    }
    else{
        state = false;
    }
    callSocket.send(JSON.stringify({
        'call': state,
        'value': call_id
    }))
}