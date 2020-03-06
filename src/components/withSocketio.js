import io from 'socket.io-client';

const withSocketio = ({
  host,
  eventListeners,
  eventEmitters
}) => {
  const socket = io(host, {secure: false});
  
  // console.log(socket);
  
  socket.on('connect', () => {
    console.log('connected !');
    // socket.emit('joinRoom', props.match.match.params.userId);
    // wait join result msg from server
    eventEmitters.forEach(event => {
      const ack = (typeof(event.ack) === "function"? event.ack: null);
      socket.emit(event.emitter, event.data, ack);
    });
  });

  eventListeners.forEach(event => {
    socket.on(event.listener, event.callback);
  });

  return socket;
}

export default withSocketio;