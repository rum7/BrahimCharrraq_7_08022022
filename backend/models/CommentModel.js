import { Sequelize } from "sequelize";
import db from "../config/Database.js";

const { DataTypes } = Sequelize;

const Comments = db.define('Comments',
    {
        nom: { type: DataTypes.STRING, allowNull: false },
        prenom: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        commentMsg: { type: DataTypes.STRING, allowNull: false }
    }
);

// (async () => { await db.sync(); })();

export default Comments;