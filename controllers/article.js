const articleDbModel = require('../models/article')
const articleModel = new articleDbModel();

class articleController {
    constructor() {
        const articles = []
    }

    async getAllArticles(req, res) {
        const articles = await articleModel.findAll()
        res.status(200).json({articles: articles})
    }

    async getArticleBySlug(req, res) {
        const article = await articleModel.findOne(req.params.slug)
        res.status(200).json({article: article})
    }

    async createNewArticle(req, res) {
        const NewArticle = {
            name: req.body.name,
            slug: req.body.slug,
            image: req.body.image,
            body: req.body.body,
            published: new Date().toISOString().slice(0, 19).replace('T', ' '),
            author_id: req.body.author_id
        }
        const createdArticleId = await articleModel.create(NewArticle)
        res.status(201).json({
            message: `Article created with id ${createdArticleId}  `,
            articleId: createdArticleId,
            article: {id: createdArticleId, ...NewArticle}
        })
    }

    async updateArticle(req, res) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ message: 'A valid article id is required' })
        }

        const allowedFields = ['name', 'slug', 'image', 'body', 'published', 'author_id']
        const updatedData = Object.fromEntries(
            allowedFields
                .filter(field => Object.prototype.hasOwnProperty.call(req.body, field))
                .map(field => [field, req.body[field]])
        )
        if (Object.keys(updatedData).length === 0) {
            return res.status(400).json({ message: 'At least one article field is required' })
        }

        const existingArticle = await articleModel.findById(id)
        if (!existingArticle) {
            return res.status(404).json({ message: 'Article not found' })
        }

        await articleModel.update(id, updatedData)
        res.status(200).json({
            message: `Article ${id} updated`,
            article: { ...existingArticle, ...updatedData }
        })
    }

    async deleteArticle(req, res) {
        const id = Number(req.params.id)
        if (!Number.isInteger(id) || id < 1) {
            return res.status(400).json({ message: 'A valid article id is required' })
        }

        const deletedRows = await articleModel.delete(id)
        if (deletedRows === 0) {
            return res.status(404).json({ message: 'Article not found' })
        }

        res.status(200).json({ message: `Article ${id} deleted` })
    }

}

module.exports = articleController
