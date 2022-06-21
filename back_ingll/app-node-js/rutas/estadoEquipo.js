const {Router} = require ('express');
const router = Router();
const EstadoEquipo = require('../modelos/EstadoEquipo');

// GET http://localhost:4000/equipoEquipo/listar
router.get('/listar', async function(req, res) {
    try {
        const estadoEquipo = await EstadoEquipo.find();
        res.send(estadoEquipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});


// POST http://localhost:4000/estadoEquipo/guardar
router.post('/guardar', async function(req, res){

    try{
        console.log(req.body.nombre);
        
        let equipoEstado = new EstadoEquipo();
        equipoEstado.nombre = req.body.nombre;
        equipoEstado.estado = req.body.estado;
        equipoEstado.foto = req.body.foto;
        equipoEstado.fechaCreacion = new Date();
        equipoEstado.fechaActualizacion = new Date();

        equipoEstado = await equipoEstado.save();

        res.send(equipoEstado);
    }catch(error){
        console.log(error)
        res.send('Ocurrio un error');
    }
});


// PUT http://localhost:4000/estadoEquipo/editar/id
router.put('/editar/:estadoEquipoId', async function(req, res){

    try{
        console.log('Objeto recibido', req.body, req.params.estadoEquipoId);

        let estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);

        if(!estadoEquipo){
            return res.send("El tipo de equipo ingresado no existe");
        }
        
        const existeEquipo = await EstadoEquipo.findOne({nombre: req.body.nombre, 
        _id: {$ne: estadoEquipo._id}});

        if(existeEquipo){
            return res.send('El nombre del tipo de equipo ingresado ya existe')
        }

        estadoEquipo.nombre = req.body.nombre;
        estadoEquipo.estado = req.body.estado;
        equipoEstado.foto = req.body.foto;
        estadoEquipo.fechaCreacion = req.body.fechaCreacion;
        estadoEquipo.fechaActualizacion = new Date();
        // guardamos
        estadoEquipo = await estadoEquipo.save();
        res.send(estadoEquipo);
        } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en servidor');
        }
});

// GET http://localhost:4000/estadoEquipo/id
router.get('/:estadoEquipoId', async function (req, res) {
    try {
      const estadoEquipo = await EstadoEquipo.findById(req.params.estadoEquipoId);
      if (!estadoEquipo) {
        return res.status(404).send("Estado no existe");
      }
      res.send(estadoEquipo);
    } catch (error) {
      console.log(error);
      res.status(500).send("Ocurrio un error al consultar estado equipo por Id");
    }
  });


module.exports = router;