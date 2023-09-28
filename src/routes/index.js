const { Router } = require ('express');
const { db } = require('../firebase');
const { QueryDocumentSnapshot } = require('firebase-admin/firestore');

const router = Router();

router.get('/', async (req, res) => {
    const querySnatshop = await db.collection('contactos').get();
    const contactos = querySnatshop.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
    }));  
    res.render('index', { contactos });
});

router.post('/agregar', async (req, res) => {
    const { nombre, apellido, email, fono } = req.body;
    await db.collection('contactos').add({
        nombre,
        apellido,
        email,
        fono
    });
    res.redirect('/');
});

router.get('/editar/:id', async (req, res) => {
    const doc = await db.collection('contactos').doc(req.params.id).get();    
    res.render('index', { contacto: { id: doc.id, ...doc.data() } } );
}); 

router.get('/borrar/:id', async (req, res) => {
    await db.collection('contactos').doc(req.params.id).delete();    
    res.redirect('/');
}); 

router.post('/modificar/:id', async (req, res) => {
    const { id } = req.params;
    await db.collection('contactos').doc(id).update(req.body);
    res.redirect('/');
});

module.exports = router;