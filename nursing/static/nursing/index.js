document.addEventListener('DOMContentLoaded', function() {
    ws_manager();
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
        document.getElementById('data').appendChild($data);
        };

        ws.onerror = e => {
            console.log(e);
        };

        ws.onclose = e => {
            console.log('closed');
            console.log(e);
        };
}