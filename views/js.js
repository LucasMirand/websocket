
let student = null
let socket = null;
let input = document.getElementById('inputtext')
let parrafo = document.getElementById('contenedor_texto')
let boton = document.getElementById('sendmsj')
let form_data_user = document.getElementById('data_user')
let user_list = document.getElementById("user_list");
let container_chat = document.getElementById('container_chat')


    form_data_user.addEventListener('submit', e=>{
            e.preventDefault();
            student={
                name:e.target[0].value,
                email:e.target[1].value,
            }
            if(student.name == '' || student.email ==''){
                window.location.reload()
            } else
            socket = io();
            socket.emit('addUser', student)
            container_chat.classList = 'active'
            readSockets()
    })
    function readSockets(){
            loadChat()
            
            socket.on('listenserver', data =>{
                // parrafo.innerHTML = data
                console.log('Recibiendo... ',data);
                let inner = ''
                data.forEach(element => {
                    inner += `<div><b>${element.name}:</b> ${element.mensaje}</div> </br>`
                });
                parrafo.innerHTML = inner;
            })
            
    }
        function loadChat(){
            socket.on('init', data =>{
                let inner = ''
                data.forEach(element => {
                    inner += `<div><b>${element.name}:</b> ${element.mensaje}</div> </br>`
                });
                parrafo.innerHTML = inner;
            })

            socket.on('loadUsers', data =>{
                console.log('Nuevo Usuario');
                let inner = ``;
                data.forEach(element => {
                    let status = element.active ? "(conectado)" : "(desconectado)";
                    inner += `<li><b>${element.name}:</b> ${status}</li>`;
                });
                user_list.innerHTML = inner;
            })

            socket.on('initProd', data =>{
                let inner = ''
                data.forEach(element => {
                    inner += `
                        <thead>
                            <th scope="row">${element.id}</th>
                            <td> ${element.name}</td>
                            <td>$${element.price}</td>
                            <td><img src="${element.image}" class="img-thumbnail" style="width:50px, height:50px;" alt="FOTO"></td>
                        </thead>`
                });
                product_list.innerHTML = inner;
            })
        }

        
        
        boton.addEventListener('click', e =>{
            let sendMessage = {
                ...student,
                mensaje: input.value
            }
            socket.emit('mensaje', sendMessage)
            input.value = ''
        })
//Agregar Productos
        let prod_data = document.getElementById('data_prods')
        let product_list = document.getElementById('product_list')


        prod_data.addEventListener('submit', e=>{
            e.preventDefault();
            product={
                name:e.target[0].value,
                price:e.target[1].value,
                image: e.target[2]
            }
            if(product.name == '' || product.price =='' || product.image ==''){
                window.location.reload()
            } else
            socket.emit('addProduct', product)
            
            loadProds()
        })



        function loadProds(){

            
            console.log('recibiendo');
            socket.on('loadprod', data =>{

                console.log('Producto... ',data);
                let inner = ''
                data.forEach(element => {
                    inner += `
                        <thead>
                            <th scope="row">${element.id}</th>
                            <td> ${element.name}</td>
                            <td>$${element.price}</td>
                            <td><img src="${element.image}" class="img-thumbnail" style="width:50px, height:50px;" alt="FOTO"></td>
                        <thead>`             
                    // <li> Producto:${element.name} Precio: $${element.price}  ${element.image}</li>
                });
                console.log(inner);
                product_list.innerHTML = inner;
                inner=''
            })

        }
        // input.addEventListener('keyup', e => {
        //     console.log('Key', input.value);
        //     socket.emit('filP', input.value )
        // })

