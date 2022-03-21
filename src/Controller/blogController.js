const blogModel = require("../Model/blogModel")
const authorModel = require("../Model/authorModel")
const { default: mongoose } = require("mongoose")
//const { response } = require("express")
//const jwt = require("jsonwebtoken")


const isValid = function (value) {
    if (typeof value === 'undefined' || value == null) return false
    if (typeof value === 'String' && value.trim().length === 0) return false
    return true
}

const isValidObjectId = function (objectId) {
    return mongoose.Types.ObjectId.isValid(objectId)
}




const createBlog = async function (req, res) {
    try {

        let data = req.body
        const { title, body, authorId, tags, category, subCategory, isPublished } = data

        if (isValid(title)) {
            res.status(400).send({ status: false, msg: "Blog title is required" })
        }
        if (isValid(body)) {
            res.status(400).send({ status: false, msg: "Blog body is required" })
        }
        if (isValid(authorId)) {
            res.status(400).send({ status: false, msg: "Blog author is required" })
        }
        if (isValidObjectId(authorId)) {
            res.status(400).send({ status: false, msg: "valid authorId is required" })
        }
        if (isValid(category)) {
            res.status(400).send({ status: false, msg: "Blog title is required" })
        }

        if (!Array.isArray(tags)) {
            res.status(400).send({ status: false, msg: "tags should be in array format" })

        }
        if (!Array.isArray(subCategory)) {
            res.status(400).send({ status: false, msg: "subCategory should be in array format" })

        }

        if (isPublished != null) data.isPublished = false
        if (data.publishedAt != null) data.publishedAt = null
        if (data.isDeleted != null) data.isDeleted = false
        if (data.deletedAt != null) data.deletedAt = null


        if (Object.keys(data).length != 0) {

            let authorId = data.authorId
            let check = await authorModel.findById(authorId)
            //console.log(check)

            if (check) {
                let blogCreated = await blogModel.create(data)
                res.status(201).send({ status: true, msg: blogCreated })
            } else {
                return res.status(400).send({ status: false, msg: "author does not exist" })
            }

        } else {
            res.status(400).send({ status: false, msg: "pls provide data in the body " })
        }

    } catch (err) {
        res.status(400).send({ status: false, msg: err.message })
    }
}






const BloglistbyFilter = async function (req, res) {
    try {

        //console.log(req.query)

        let { category, authorId, tags, subCategory } = req.query
        let obj = {}
        if (isValid(authorId) && isValidObjectId(authorId)) {
            obj.authorId = authorId
        }

        if (isValid(category)) {
            obj.category = category.trim()
        }

        if (isValid(tags)) {
            const tagsArr = tags.trim().split(',').map(tag => tag.trim());
            obj.tags = { $all: tagsArr }

        }

        if (isValid(subCategory)) {
            const subCategoryArr = subCategory.trim().split(',').map(subCat => subCat.trim());
            obj.tags = { $all: subCategoryArr }

        }
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
        res.status(500).send({ status: true, msg: err.message })
    }
}




const updateBlog = async function (req, res) {
    try {
        let data = req.body
        const { title, body, tags, category, subCategory } = data
        let blogId = req.params.blogId

        if (isValidObjectId(blogId)) {
            res.status(400).send({ status: false, msg: `{blogId} is not valid` })
        }

        if (isValid(title)) {
            res.status(400).send({ status: false, msg: "title is not valid" })
        }

        if (isValid(body)) {
            res.status(400).send({ status: false, msg: "body is not valid" })
        }

        if (isValid(category)) {
            res.status(400).send({ status: false, msg: "title is not valid" })
        }

        if (!Array.isArray(tags)) {
            res.status(400).send({ status: false, msg: "tags should be in array format" })

        }

        if (!Array.isArray(subCategory)) {
            res.status(400).send({ status: false, msg: "subCategory should be in array format" })

        }

        if (isValid(category)) {
            res.status(400).send({ status: false, msg: "title is not valid" })
        }






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
        let blogId = req.params.blogId

        if (!isValidObjectId(blogId)) {
            res.status(400).send({ status: false, msg: "blog id is not valid" })
        }


        let results = await blogModel.updateOne(
            { _id: req.blogId },
            { $set: { isDeleted: true }, $currentDate: { deletedAt: true } }
        )
        return res.status(200).send()

    } catch (err) {

        res.status(400).send({ status: false, msg: err.message })
    }
}





const deletecertainBlog = async function (req, res) {
    try {
        let { category, authorId, tags, subCategory, isPublished } = req.query
        let obj = {}

        if (isValid(authorId) && isValidObjectId(authorId)) {
            obj.authorId = authorId
        }

        if (isValid(category)) {
            obj.category = category.trim()
        }

        if (isValid(tags)) {
            const tagsArr = tags.trim().split(',').map(tag => tag.trim());
            obj.tags = { $all: tagsArr }

        }

        if (isValid(subCategory)) {
            const subCategoryArr = subCategory.trim().split(',').map(subCat => subCat.trim());
            obj.tags = { $all: subCategoryArr }
        }    

        

        
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

        if (Object.keys(obj).length > 0) {

            let result = await blogModel.updateMany(
                obj,
                { $set: { isDeleted: true }, $currentDate: { deletedAt: true } }
            )
            
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










module.exports.createBlog = createBlog
//module.exports.allBlogs = allBlogs
module.exports.BloglistbyFilter = BloglistbyFilter
module.exports.updateBlog = updateBlog
module.exports.deleteBlog = deleteBlog
module.exports.deletecertainBlog = deletecertainBlog
