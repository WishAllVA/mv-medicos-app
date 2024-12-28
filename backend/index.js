const express = require('express')

const app = express()
const API_LISTENER_PORT = process.env.PORT || 3000

app.use('/health', (req, res, next) => {
    res.status(200).json({
        success: 'ok'
    })
})

app.listen(API_LISTENER_PORT, () => {
    console.log('Server started on PORT:%d', API_LISTENER_PORT)
})
