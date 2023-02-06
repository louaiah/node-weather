const path = require('path')
const express = require('express')
const geocode = require('./utils/geocode')
const forecast = require('./utils/forecast')
const hbs = require('hbs')


const app = express()
const publicDirectoryPath = path.join(__dirname, '../public')
const viewsPath = path.join(__dirname, '../templates/views')
const partialsPath = path.join(__dirname, '../templates/partials')

app.set('view engine','hbs')
app.set('views', viewsPath)
hbs.registerPartials(partialsPath)

app.use(express.static(publicDirectoryPath))

app.get('',(req,res)=>{
    res.render('index', {
        title: 'Weather',
        name: 'Louai Abo Hamdan'
    })

})

app.get('/about', (req, res) => {
    res.render('about', {
        title: 'About Me',
        name: 'Louai Abo Hamdan'
    })
})

app.get('/help', (req, res) => {
    res.render('help', {
        helpText: 'This is some helpful text.',
        title: 'Help',
        name: 'Louai Abo Hamdan'
    })
})





app.get('/weather', (req, res) => {
    if (!req.query.address) {
        return res.send({
            error: 'You Must PROVIDE an addRESS!!!!1'
        })
    }
    geocode(req.query.address, (error,{latitude,longitude,location}={})=>{
        if(error) {
            return res.send({error})
        }

        forecast(latitude,longitude,(error, forecastData)=>{
            if(error) {
                return res.send({error})
            }

            res.send({
                forecast: forecastData,
                location,
                address: req.query.address
            })

        })

    })
    
})

app.get('/products', (req, res) => {
    if (!req.query.search) {
        return res.send({
            error: 'You Must PROVIDE a search TERM!!!!1'
        })
    }
    console.log(req.query)
    res.send({
        products: []
    })
})

app.get('/help/*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Louai Abo Hamdan',
        errorMessage: 'Help article not found.'
    })
})

app.get('*', (req, res) => {
    res.render('404', {
        title: '404',
        name: 'Louai Abo Hamdan',
        errorMessage: 'Page not found.'
    })
})


app.listen(3000, () => {
    console.log('Server is up on port 3000.')
})