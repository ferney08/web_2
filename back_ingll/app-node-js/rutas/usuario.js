const {Router} = require ('express');
const router = Router();
const Usuario = require('../modelos/Usuario');



// GET http://localhost:4000/usuario/listar
router.get('/listar', async function(req, res) {
    try {
        const usuarios = await Usuario.find();
        res.send(usuarios);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});


// POST http://localhost:4000/usuario/guardar
router.post('/guardar', async function(req, res){

    try{
        console.log(req.body);
        
        const validarExistenciaUsuario = await Usuario.findOne({email: req.body.email});
        
        if(validarExistenciaUsuario){
            return res.send('El email del usuario ingresado ya existe');
        }


        let usuario = new Usuario();
        usuario.nombre = req.body.nombre;
        usuario.foto = req.body.foto;
        usuario.email = req.body.email;
        usuario.estado = req.body.estado;
        usuario.fechaCreacion = new Date();
        usuario.fechaActualizacion = new Date();

        usuario = await usuario.save();

        res.send(usuario);
    }catch(error){
        console.log(error)
        res.send('Ocurrio un error');
    }
    
});


// PUT http://localhost:4000/usuario/editar/id
router.put('/editar/:usuarioId', async function(req, res){

    try{
        console.log('Objeto recibido', req.body, req.params.usuarioId);

        let usuario = await Usuario.findById(req.params.usuarioId);

        if(!usuario){
            return res.send("El usuario ingresado no existe");
        }
        
        const existeUsuario = await Usuario.findOne({email: req.body.email, 
        _id: {$ne: usuario._id}});

        if(existeUsuario){
            return res.send('El email del usuario ingresado ya existe')
        }

        usuario.nombre = req.body.nombre;
        usuario.email = req.body.email;
        usuario.foto = req.body.foto;
        usuario.estado = req.body.estado;
        usuario.fechaCreacion = req.body.fechaCreacion;
        usuario.fechaActualizacion = new Date();
        // guardamos
        usuario = await usuario.save();
        res.send(usuario);
        } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en servidor');
        }
});

// GET http://localhost:4000/usuario/id
router.get('/:usuarioId', async function (req, res) {
    try {
      const usuario = await Usuario.findById(req.params.usuarioId);
      if (!usuario) {
        return res.status(404).send("usuario no existe");
      }
      res.send(usuario);
    } catch (error) {
      console.log(error);
      res.status(500).send("Ocurrio un error al consultar usuario por Id");
    }
  });

module.exports = router;