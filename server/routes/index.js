const express = require('express')
const router = express.Router()

router.get('/', (req, res) => {
    res.json("index")
})

module.exports = router