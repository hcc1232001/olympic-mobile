import io from 'socket.io-client';

const withSocketio = ({
  host,
  eventListeners,
  eventEmitters
}) => {
  const socket = io(host);
  
  // console.log(socket);
  
  socket.on('connect', () => {
    console.log('connected !');
    // socket.emit('joinRoom', props.match.match.params.userId);
    // wait join result msg from server
    eventEmitters.forEach(event => {
      socket.emit(event.emitter, event.data);
    });
  });

  eventListeners.forEach(event => {
    socket.on(event.listener, event.callback);
  });

  return socket;
}

export default withSocketio;