import Comments from "../models/CommentModel.js";

export const getComment = async(req, res) => {
    try {
        const comments = await Comments.findAll({});
        res.json(comments);
    } catch (error) {
        res.json({ msg: error.msg });
    }  
}

export const publishComment = async(req, res) => {
    try {
        const comment = req.body;
        await Comments.create(comment);
        res.json({msg: "Publication réussie"});
    } catch (error) {
        res.json({ msg: error.msg });
    }  
}

export const deleteComment = async(req, res) => {
    try {
        const commentId = req.params.id;
        await Comments.destroy({
            where: {
                id: commentId
            }
        });
        res.json({msg: "Publication supprimée"});
    } catch (error) {
        res.json({ msg: error.msg });
    }  
}