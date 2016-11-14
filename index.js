var Service, Characteristic;
var net = require('net');

module.exports = function(homebridge) {

  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;
  homebridge.registerAccessory("homebridge-vsx", "VSX", VSX);
}

function VSX(log, config) {
  this.log = log;
  this.name = config.name;
  this.HOST = config.ip;
  this.PORT = config.port;

  this.service = new Service.Switch(this.name);
  this.service.getCharacteristic(Characteristic.On)
    .on("set", this.setOn.bind(this))
    .on("get", this.getOn.bind(this));
}

VSX.prototype.getServices = function() {
  return [this.service];
}

VSX.prototype.getOn = function(callback) {
  
  var client = new net.Socket();
  client.connect(this.PORT, this.HOST, function() {
   
    //console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    client.write('?P\r\n');

  }); 
    
    client.on('data', function(data) {
    
      //console.log('DATA: ' + data);
      var str = data.toString();
      
      if (str.includes("PWR1")) {
        console.log("Pioneer Off");
        var on = false;
        client.destroy();
        callback(null,on);
        
      } else if (str.includes("PWR0")) {
        console.log("Pioneer On");
        var on = true;
        client.destroy();
        callback(null,on);
        
      } else {
        console.log("waiting");
      }

  });
  
    client.on('close', function() {
    //console.log('Connection closed');
    
  });

    client.on('error', function(ex) {
      console.log("handled error");
      console.log(ex);
      callback(ex)
    
  }); 
}



VSX.prototype.setOn = function(on, callback) {

  if(on){
    var client = new net.Socket();
    client.connect(this.PORT, this.HOST, function() {

    //console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('PO\r\n');
    
    client.destroy();
  
});
     //Add a 'close' event handler for the client sock
    client.on('close', function() {
    //console.log('Connection closed');

});

    client.on('close', function() {
    //console.log('Connection closed');
    
});
 
    client.on('error', function(ex) {
    console.log("handled error");
    console.log(ex);
    
}); 

  } else {
    var client = new net.Socket();
    client.connect(this.PORT, this.HOST, function() {

    //console.log('CONNECTED TO: ' + this.HOST + ':' + this.PORT);
    // Write a message to the socket as soon as the client is connected, the server will receive it as message from the client 
    client.write('PF\r\n');
    
    client.destroy();
    
    });
    
    //Add a 'close' event handler for the client sock
    client.on('close', function() {
    //console.log('Connection closed');
    
    });
    
    client.on('error', function(ex) {
    console.log("handled error");
    console.log(ex);
    
    }); 
    
  }
  callback();
}
