const authorModel = require("../Model/authorModel")

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true
}
const isValidTitle = function (title) {
    return ['Mr', "Mrs", "Miss"].indexOf(title) !== -1
}




const createAuthor = async function (req, res) {
    try {
        let data = req.body


        if (Object.keys(data).length != 0) {

            // extract params
            const { fname, lname, title, emailId, password } = data

            //validation
            if (!isValid(fname)) {
                res.status(400).send({ status: false, msg: "Fist name is required" })
            }

            if (!isValid(lname)) {
                res.status(400).send({ status: false, msg: "Last name is required" })
            }

            if (!isValid(title)) {
                res.status(400).send({ status: false, msg: "valid title is required" })
            }

            if (!isValidTitle(title)) {
                res.status(400).send({ status: false, msg: "Title should be among Mr, Mrs and Miss" })
            }

            if (!isValid(password)) {
                res.status(400).send({ status: false, msg: "password is required" })
            }

            

        const isEmailalredyUsed = await authorModel.findOne({ emailId }) //{email :email} object shorthand property
        console.log(isEmailalredyUsed)
        if (isEmailalredyUsed) {
            res.status(400).send({ status: false, msg: "email already in use" })
            return
        }
        const authorData = await authorModel.create(data)

            res.status(201).send({ status: true, msg: authorData })

        } else {
            res.status(400).send({ status: false, msg: "Pls provide author details" })
        }



    } catch (err) {
        res.status(500).send({ status: false, error: err.message })
    }

}


module.exports.createAuthor = createAuthor