let {Server: SocketIO} = require("socket.io")
class Socket {
    static instancia;
    constructor(http){
        if(Socket.instancia){
            console.log(Socket.instancia + 'Hola');
            return Socket.instancia;
            
        }
        Socket.instancia = this;
        this.io = new SocketIO(http)
        this.mensajes = [];
        this.usuarios = [];
        this.productos =[];
    }
    init() {
        try {
            this.io.on('connection', socket =>{
                console.log('Usuario Conectado')
                socket.emit('init',this.mensajes)
                socket.emit('initProd',this.productos)

                socket.on('mensaje',data => {
                    this.mensajes.push(data)
                    this.io.sockets.emit('listenserver',this.mensajes)
                })
                socket.on('addUser',data => {
                    if (this.usuarios.length > 0){
                        let verification_user = false
                        this.usuarios = this.usuarios.map(usuario =>{
                            if(usuario.email == data.email){
                                verification_user = true;
                                return{
                                    id: socket.id,
                                    ...data,
                                    active:true
                                }
                            }else{
                                return usuario;
                            }
                        })
                        if (!verification_user){
                            this.usuarios.push({
                                id: socket.id,
                                ...data,
                                active:true
                            })
                        }
                    } else{
                        this.usuarios.push({
                            id: socket.id,
                            ...data,
                            active:true
                        })
                    }
                    this.io.sockets.emit('loadUsers',this.usuarios)
                })

                // socket.emit("addProduct", this.productos);
                socket.on("addProduct", data =>{
                    let coincide = false
                    console.log(data);
                    console.log(this.productos);
                    if(this.productos.length > 0) {                            
                        // this.productos = this.productos.map(producto => {        
                        //     if(producto.name == data.name){
                        //         coincide = true;
                        //         return console.log('Producto ya agregado')
                        //     } else {
                        //         console.log('ELSE');

                        //         return producto
                        //     }
                            
                        // })
                        // if(coincide==false){
                        // console.log('Coincide is false');
                        this.productos.push(
                        { id: this.productos.length+1,
                                    ...data})
                        // }    
                        
                    } else {
                        console.log('no es mayor a 0 lenght');
                        
                        this.productos.push(
                        { id: this.productos.length+1,
                                    ...data})
                        } 
                        
                   
                    this.io.sockets.emit("loadprod", this.productos);
                })

                socket.on('disconnect',data => {
                    this.usuarios = this.usuarios.map(usuario =>{
                        if(usuario.id == socket.id){
                            delete usuario.active;
                            return {
                                ...usuario,
                                active: false
                            };
                        }else{
                            return usuario;
                        }
                    });
                    console.log("Alguien se desconectó", socket.id);
                    this.io.sockets.emit('loadUsers', this.usuarios);
                })
            })
        } catch (error) {
            console.log(error)
        }
    }
}
module.exports = Socket