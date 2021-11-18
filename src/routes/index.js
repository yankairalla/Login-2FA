const jwt = require('jsonwebtoken')
const StormDB = require("stormdb");
const { Router } = require('express');
const uuid = require('uuid');

const sendgrid = require("@sendgrid/mail");

const router = Router();

const secret_jwt = 'fatecrl';
// start db with "./db.stormdb" storage location
const engine = new StormDB.localFileEngine("./db.stormdb");
const db = new StormDB(engine);

// set default db value if db is empty
db.default({ users: [] });

sendgrid.setApiKey(process.env.SENDGRID_API);

router.get('/', (req, res) => {
    res.render('login')
})

router.post('/', async (req, res) => {

    const id = uuid.v4();
    const email = req.body.email;
    const pass = req.body.pass;
    console.log(req.body)

    try {
        const token = jwt.sign({ id, email }, secret_jwt);
        await sendgrid.send({
            to: email,
            from: 'marina.lopes2@fatec.sp.gov.br',
            subject: 'Código de verificação',
            html: `<p>Olá, este é seu código de verificação:
            <br/> <strong>${token}</strong>
            <br/> 
            Copie este código, vá até o site e cole ele no campo indicado como "Código de verificação.</p>`
        })


        db.get('users').push({
            id,
            email,
            secret: token
        })


        db.save();
    } catch (error) {
        console.error(error)
    }
    res.redirect('/verify')
})

router.get('/verify', (req, res) => {
    res.render('verify', { validationClass: '', verify: undefined })
});


router.post('/verify', (req, res) => {
    const token = req.body.token

    try {
        const decoded = jwt.verify(token, secret_jwt);
        return res.render('verify', {
            verify: true,
            validationClass: 'is-valid'
        })
    } catch (err) {
        return res.render('verify', {
            verify: false,
            validationClass: 'is-invalid'
        })
    }
});



module.exports = router;