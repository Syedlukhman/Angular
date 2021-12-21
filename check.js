const hubspot = require('@hubspot/api-client')
require('dotenv').config()
const path = require('path')
const express = require('express')
const session = require('express-session')
const axios = require('axios').default
var cors = require('cors')
const querystring = require('querystring');
const app = express();
app.use(cors())

const template_path = path.join(__dirname, './templates/views')

const { urlencoded, response, json } = require('express')
const NodeCache = require("node-cache")
const accessTokenCache = new NodeCache()
const CLIENT_ID = process.env.CLIENT_ID;
const CLIENT_SECRET = process.env.CLIENT_SECRET

const db = require('./conn')
const bodyParser = require('body-parser')

app.use(bodyParser.urlencoded({ extended: true }))
app.set('view engine', 'hbs')
app.set("views", template_path)
app.use(express.json())
app.use(express.urlencoded({ extended: false }))
app.use(session({
    secret: Math.random().toString(36).substring(2),
    resave: true,
    saveUninitialized: true
}))
//==================================cors==================================
const corsOptions = {
    origin: 'http://localhost:3000',
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
}
const REDIRECT_URI = 'http://localhost:3000/api/oauth-callback'
const authURL = 'https://app-eu1.hubspot.com/oauth/authorize?client_id=072813f0-eb7a-455f-ae3c-e8836374f673&redirect_uri=http://localhost:3000/api/oauth-callback&scope=crm.objects.contacts.read%20crm.objects.contacts.write%20crm.schemas.contacts.read%20crm.schemas.contacts.write'
const tokenStore = {}
const returnedContacts = []

//==================================storing refresh token in mongoose=======================
async function storeToken(value) {
    try {

        let check = await db.Token.find().select({ _id: 0, refreshToken: 1 })
        console.log("storing token in storeToken function")

        if (check == "") {
            const saveRefresh = new db.Token({
                refreshToken: value
            })
            saveRefresh.save()
        }
        else {
            
            const update = await db.Token.updateOne({ refreshToken: await q() }, { $set: { refreshToken: value } })
         
        }
    } catch (error) {
        console.log(error.message)
    }
}
// ========================================retriveing token from mongoose=============================
const q = async () => {
    let t = []
    t = await db.Token.find().select({ _id: 0, refreshToken: 1 })
    return t[0].refreshToken
}
//=====delete token==================

app.get('/delete', async function (req, res) {
    try {
        
        const deleteToken = await db.Token.deleteMany()
        console.log(deleteToken)

    } catch (error) {
        console.log(error.message)
    }
})


//============================storing contact details===========================
async function Send(FirstName, LastName, Email, ID) {
    const fn = await db.EnterDetail.find({ firstName: FirstName }, { _id: 0, firstName: 1 })
    const sn = await db.EnterDetail.find({ lastName: LastName }, { _id: 0, lastName: 1 })
    const em = await db.EnterDetail.find({ email: Email }, { _id: 0, email: 1 })
    const id = await db.EnterDetail.find({ id: ID }, { _id: 0, id: 1 })

    if (id == '') {
        const doc = new db.EnterDetail({
            firstName: FirstName,
            lastName: LastName,
            email: Email,
            id: ID
        })
        doc.save()
    }
    else {
        const fn = await db.EnterDetail.find({ id: ID }, { _id: 0, firstName: 1 })
        const ln = await db.EnterDetail.find({ id: ID }, { _id: 0, lastName: 1 })
        const em = await db.EnterDetail.find({ id: ID }, { _id: 0, email: 1 })
        await db.EnterDetail.updateOne({ firstName: fn[0].firstName }, { $set: { firstName: FirstName } })
        await db.EnterDetail.updateOne({ lastName: ln[0].lasstName }, { $set: { firstName: FirstName } })
        await db.EnterDetail.updateOne({ email: em[0].email }, { $set: { email: Email } })

    }
}


//======to get refresh token to get new access token====================
const getToken = async (userId) => {
 
    if (accessTokenCache.get(userId)) {
        
        return accessTokenCache.get(userId)
    }
    else {
        try {
            const codeProof = {
                grant_type: 'refresh_token',
                client_id: CLIENT_ID,
                client_secret: CLIENT_SECRET,
                redirect_uri: REDIRECT_URI,
                refresh_token: await q()
            }

            const responseBody = await axios.post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(codeProof))

            accessTokenCache.set(userId, responseBody.data.access_token, 100)
            
            return responseBody.data.access_token

        } catch (error) {
            console.log(error.message)
        }
    }

}


//======to check if a token is stored in tokenStore with sessinId as key===============
const isAuthorized = (userId) => {
    return accessTokenCache.get(userId) ? true : false
}

//send user to authorization page this kicks off initial req to Oauth server==========
app.get('/api', async (req, res) => {

    res.render('index')
})



app.get("/api/getData/:email", async (req, res) => {
    const l = req.params.email
    const o = await db.EnterDetail.find({ email: l })
    res.send(o)
})

app.post('/api/create', async (req, res) => {
    try {
        const accessToken = await getToken(req.sessionID)
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };

        let url = 'https://api.hubapi.com/contacts/v1/contact/'

        var body = req.body
        var resp = await axios.post(url, body, { headers })
        if (resp.status == 200) {
            const newData = db.EnterDetail({
                firstName: req.body.properties[0].value,
                lastName: req.body.properties[1].value,
                email: req.body.properties[2].value,
                id: resp.data.vid
            })
            newData.save()
        }
        res.send(JSON.stringify("new contact has been created"))


    } catch (error) {
        if (error.response.status == 409) {
            res.send(JSON.stringify(error.response.data.errors[0].message))//existing contact with same email
        }
        else if (error.response.status == 400) {
            res.send(JSON.stringify("Invalid data or no properties are inserted! Check the inserted data."))
        }
    }

})

app.put('/api/edit/:email', async (req, res) => {


    try {
        const accessToken = await getToken(req.sessionID)
        const email = req.params.email
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
        let url = `https://api.hubapi.com/contacts/v1/contact/email/${email}/profile`
        var body = req.body
        var Ufn = req.body.properties[0].value
        var Uln = req.body.properties[1].value
        var Uem = req.body.properties[2].value
        var resp = await axios.post(url, body, { headers })
        if (resp.status == 204) {
            // const result = await db.EnterDetail.find({ email: `${email}` }).update({ firstName: `${Ufn}`, lastName: `${Uln}`, email: `${Uem}` })
           const result = await db.EnterDetail.findOneAndUpdate({email: `${email}`},{firstName: `${Ufn}`, lastName: `${Uln}`, email: `${Uem}`})
            res.send(JSON.stringify("updated successfully"))
        }
        else {
            res.send(JSON.stringify("unsuccessfull"))
        }

    } catch (error) {

        res.send(JSON.stringify("Invalid data or no properties are inserted! Check the inserted data."))


    }

})


app.delete('/api/delete/:email', async (req, res) => {
    try {
        const accessToken = await getToken(req.sessionID)
        const headers = {
            Authorization: `Bearer ${accessToken}`,
            'Content-Type': 'application/json'
        };
        const id = await db.EnterDetail.find({ email: req.params.email }, { _id: 0, id: 1 })
        const vid = id[0].id
        console.log(vid)
        let url = `https://api.hubapi.com/contacts/v1/contact/vid/${vid}/`
    
        var resp = await axios.delete(url, { headers })
        if(resp.status==200){
            await db.EnterDetail.deleteOne({email: req.params.email})
            res.send(JSON.stringify("Requested contact with email " + req.params.email + " is deleted"))
        }
       
    } catch (error) {
        if(error.response.status==404){
            res.send(JSON.stringify("Contact with given email address does not exists"))
        }
        else{
            res.send(JSON.stringify("unauthorised request made"))
        }
    }
    console.timeEnd()

})


app.get('/api/Next', async (req, res) => {

    try {
        console.log("try start")
        if (isAuthorized(req.sessionID)) {
            console.log("try enter")
            res.redirect("http://localhost:4200/succefull");

            const accessToken = await getToken(req.sessionID)

            const headers = {
                Authorization: `Bearer ${accessToken}`,
                'Content-Type': 'application/json'
        }

            // const contacts = 'https://api.hubapi.com/contacts/v1/lists/all/contacts/all'
            const contacts = 'https://api.hubapi.com/crm/v3/objects/contacts?limit=50&archived=false'
            const resp = await axios.get(contacts, { headers })
            const data = (resp.data);
            // console.log(data.results)
            data.results.forEach(result => {
                returnedContacts.push(result);

            });


            var fname = []
            var sname = []
            var email = []
            var id = []


            for (let i = 0; i < returnedContacts.length; i++) {
                fname.push(JSON.stringify(returnedContacts[i].properties.firstname).slice(1, -1))
                sname.push(JSON.stringify(returnedContacts[i].properties.lastname).slice(1, -1))
                email.push(JSON.stringify(returnedContacts[i].properties.email).slice(1, -1))
                id.push(JSON.stringify(returnedContacts[i].id).slice(1, -1))
              await Send(fname[i], sname[i], email[i], id[i])

            }
        } else {
            
            res.redirect(authURL)
        
        }
    }
    catch (err) {

        console.log(err.message)
    }

})



app.get('/api/oauth-callback', async (req, res) => {

    try {
        const authCodeProof = {
            grant_type: 'authorization_code',
            client_id: CLIENT_ID,
            client_secret: CLIENT_SECRET,
            redirect_uri: REDIRECT_URI,
            code: req.query.code
        }

        const responseBody = await axios.post('https://api.hubapi.com/oauth/v1/token', querystring.stringify(authCodeProof))
        tokenStore[req.sessionID] = responseBody.data.refresh_token
        accessTokenCache.set(req.sessionID, responseBody.data.access_token, 100)
        storeToken(responseBody.data.refresh_token)
        res.redirect("/api/Next")
    } catch (error) {
        res.send(error)
        
    }
})

//=======================sending data=======================================
app.get('/api/send', async (req, res) => {
    const result = await db.EnterDetail.find().select({ _id: 0, firstName: 1, lastName: 1, email: 1 })
    // const fn = await db.EnterDetail.find({ firstName: 'Maria' }, { _id: 0, firstName: 1 })
    res.send(result)
})

port = process.env.PORT
app.listen(port, () => {
    console.log(`app is running on port ${port}`)
})


