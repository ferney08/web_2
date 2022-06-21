const {Router} = require ('express');
const router = Router();
const TipoEquipo = require('../modelos/TipoEquipo');

// GET http://localhost:4000/tipoEquipo/listar
router.get('/listar', async function(req, res) {
    try {
        const tipoEquipo = await TipoEquipo.find();
        res.send(tipoEquipo);
    } catch (error) {
       console.log(error);
       res.status(500).send('Ocurrio un error en servidor');
    }
});

// POST http://localhost:4000/tipoEquipo/guardar
router.post('/guardar', async function(req, res){

    try{
        console.log(req.body.nombre);
        
        const validarNombre = req.body.nombre;
        const validarEstado = req.body.estado;
        
        if(validarNombre != "Movil" && validarNombre != "Computo"){
            return res.send('El nombre ingresado no es válido, solo se aceptan los nombres: "Computo" y "Movil"');
        }

        if(validarEstado != "Activo" && validarEstado != "Inactivo"){
            return res.send('El estado ingresado no es válido, solo se aceptan los estados: "Activo" y "Inactivo"');
        }


        let tipoEquipo = new TipoEquipo();
        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.foto = req.body.foto;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.fechaCreacion = new Date();
        tipoEquipo.fechaActualizacion = new Date();

        tipoEquipo = await tipoEquipo.save();

        res.send(tipoEquipo);
    }catch(error){
        console.log(error)
        res.send('Ocurrio un error');
    }

    
    
});

// PUT http://localhost:4000/tipoEquipo/editar/id
router.put('/editar/:tipoEquipoId', async function(req, res){

    try{
        console.log('Objeto recibido', req.body, req.params.tipoEquipoId);

        let tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);

        if(!tipoEquipo){
            return res.send("El tipo de equipo ingresado no existe");
        }
        
        const existeEquipo = await TipoEquipo.findOne({nombre: req.body.nombre, 
        _id: {$ne: tipoEquipo._id}});

        if(existeEquipo){
            return res.send('El nombre del tipo de equipo ingresado ya existe')
        }

        tipoEquipo.nombre = req.body.nombre;
        tipoEquipo.estado = req.body.estado;
        tipoEquipo.foto = req.body.foto;
        tipoEquipo.fechaCreacion = req.body.fechaCreacion;
        tipoEquipo.fechaActualizacion = new Date();
        // guardamos
        tipoEquipo = await tipoEquipo.save();
        res.send(tipoEquipo);
        } catch (error) {
        console.log(error);
        res.status(500).send('Ocurrio un error en servidor');
        }
});

// GET http://localhost:4000/tipoEquipo/id
router.get('/:tipoEquipoId', async function (req, res) {
    try {
      const tipoEquipo = await TipoEquipo.findById(req.params.tipoEquipoId);
      if (!tipoEquipo) {
        return res.status(404).send("Tipo no existe");
      }
      res.send(tipoEquipo);
    } catch (error) {
      console.log(error);
      res.status(500).send("Ocurrio un error al consultar tipo por Id");
    }
  });

module.exports = router;