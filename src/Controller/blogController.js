const blogModel = require("../Model/blogModel")
const authorModel = require("../Model/authorModel")
const { response } = require("express")
const jwt = require("jsonwebtoken")

const createBlog = async function (req, res) {
    try {

        let data = req.body
        if (data.isPublished != null) data.isPublished = false
        if (data.publishedAt != null) data.publishedAt = ""
        if (data.isDeleted != null) data.isDeleted = false
        if (data.deletedAt != null) data.deletedAt = ""


        if (Object.keys(data).length != 0) {

            let authorId = data.authorId
            let check = await authorModel.findById(authorId)
            //console.log(check)

            if (check) {
                let blogCreated = await blogModel.create(data)
                res.status(201).send({ status: true, msg: blogCreated })
            } else {
                return res.status(400).send({ status: false, msg: "please provide valid author Id" })
            }

        } else {
            res.status(400).send({ status: false, msg: "pls provide data in the body " })
        }

    } catch (err) {
        res.status(400).send({ status: false, msg: err.message })
    }
}



// const allBlogs = async function (req, res) {
//     try {
//         let blogData = await blogModel.find({ isDeleted: false, isPublished: true })

//         if (blogData.length > 0) {
//             res.status(200).send({ status: true, msg: blogData })

//         } else {
//             res.status(404).send({ status: false, msg: "No data found" })
//         }


//     } catch (err) {
//         res.status(400).send({ status: true, msg: err.message })
//     }


// }




const BloglistbyFilter = async function (req, res) {
    try {

        //console.log(req.query)

        let { category, authorId, tags, subCategory } = req.query
        let obj = {}
        if (category != null) obj.category = category
        if (authorId != null) obj.authorId = authorId
        if (tags != null) obj.tags = tags
        if (subCategory != null) obj.subCategory = subCategory
        obj.isDeleted = false
        obj.isPublished = true

        let blogData = await blogModel.find(obj)
        // console.log(blogData)
        if (blogData.length > 0) {
            res.status(200).send({ status: true, msg: blogData })

        } else {
            res.status(404).send({ status: false, msg: "No data found" })
        }


    } catch (err) {
        res.status(400).send({ status: true, msg: err.message })
    }
}




const updateBlog = async function (req, res) {
    try {
        let data = req.body
        if (Object.keys(data).length != 0) {

            let results = await blogModel.findOneAndUpdate(
                { _id: req.blogId },
                { $set: { title: data.title, body: data.body, category: data.category, isPublished: true }, $addToSet: { tags: data.tags, subCategory: data.subCategory }, $currentDate: { publishedAt: true } },

                { new: true }
            )
            return res.status(200).send({ status: true, msg: results })

        } else {
            res.status(404).send({ status: false, msg: "please provide content in the body" })
        }


    } catch (err) {

        res.status(400).send({ status: false, msg: err.message })
    }

}





const deleteBlog = async function (req, res) {
    try {
        // let blogId = req.params.blogId
        // let id = req.params.blogId
        // let check = await blogModel.findById(id)
        // console.log(check)
        // if (check) {
        //     if (check.isDeleted == false) {
        let results = await blogModel.updateOne(
            { _id: req.blogId },
            { $set: { isDeleted: true }, $currentDate : {deletedAt : true} }
        )
        return res.status(200).send()
        //.send({status : true})

        // } else {
        //     res.status(404).send({ status: false, msg: "The post is already removed from the server" })
        // }

        // } else {
        //     res.status(404).send({ status: false, msg: "Please provide valid blog Id" })
        //}



    } catch (err) {

        res.status(400).send({ status: false, msg: err.message })
    }
}





const deletecertainBlog = async function (req, res) {
    try {
        let { category, authorId, tags, subCategory, isPublished } = req.query
        let obj = {}
        if (category != null) obj.category = category
        // if (authorId != null && authorId ){
        //     if(authorId == req.decodeToken.userId){
        //         obj.authorId=authorId
        //     }else{
        //         return res.status(400).send({status : false , msg:"you are trying to delete someone else blog"})
        //     }


        // }


        if (tags != null) obj.tags = tags
        if (subCategory != null) obj.subCategory = subCategory
        if (isPublished != null) {
            if (isPublished == "true") {
                return res.status(400).send({ status: false, msg: "you are trying to delete already published blog" })
            } else {
                obj.isPublished = false

            }
        }

        if (authorId != null) {
            if (authorId != req.decodeToken.userId) {
                res.status(400).send({ status: false, msg: "you are trying to access someone else blog" })
            } else {
                obj.authorId = req.decodeToken.authorId

            }
        } else {
            if (Object.keys(obj).length > 0) {
                obj.authorId = req.decodeToken.userId
            }
        }



        console.log(typeof(obj.category))


        //console.log(Object.keys(obj))
        if (Object.keys(obj).length > 0) {
            
            //console.log(obj)
            // let returnResult = await blogModel.find(obj).count()
            // console.log(returnResult)

            let result = await blogModel.updateMany(
                obj,
                { $set: { isDeleted: true }, $currentDate:{deletedAt:true} }
            )
            //console.log(result)
            if (result) {
                res.status(200).send({ status: true, msg: "done" })

            } else {
                res.status(404).send({ status: false, msg: "following match does not exist" })
            }


        } else {
            res.status(400).send({ status: false, msg: "pls provide filter details in query params" })
        }
    } catch (err) {
        res.status(404).send({ status: false, msg: err.message })
    }


}




const userLogin = async function (req, res) {
    try {
        let data = req.body


        if (Object.keys(data).length == 2) {
            let userName = req.body.emailId
            let password = req.body.password

            const credentialCheck = await authorModel.findOne({ emailId: userName, password: password })
            if (!credentialCheck) return res.status(401).send({ status: false, msg: "username or password is incorrect" })

            let token = jwt.sign(
                { userId: credentialCheck._id.toString() },
                "Ronaldo-007"
            )

            res.setHeader("user-auth-token", token)
            res.status(200).send({ status: true, data: token })
        }
        else res.status(400).send({ status: false, msg: "username or password is missing" })

    } catch (err) {
        res.status(500).send({ msg: "error", error: err.message })

    }


};






module.exports.createBlog = createBlog
//module.exports.allBlogs = allBlogs
module.exports.BloglistbyFilter = BloglistbyFilter
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deletecertainBlog = deletecertainBlog
module.exports.userLogin = userLogin