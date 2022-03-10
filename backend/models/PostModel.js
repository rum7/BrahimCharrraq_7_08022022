import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Comments from "./CommentModel.js";

const { DataTypes } = Sequelize;

const Posts = db.define('Posts',
    {
        nom: { type: DataTypes.STRING, allowNull: false },
        prenom: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        userImg: { type: DataTypes.STRING, allowNull: true },
        postMsg: { type: DataTypes.STRING, allowNull: false },
        postImg: { type: DataTypes.STRING, allowNull: true }
    }
);

Posts.hasMany(Comments);
Comments.belongsTo(Posts);

// (async () => { await db.sync(); })();

export default Posts;