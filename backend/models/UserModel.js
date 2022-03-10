import { Sequelize } from "sequelize";
import db from "../config/Database.js";
import Posts from "./PostModel.js";

const { DataTypes } = Sequelize;

const Users = db.define('users',
    {
        nom: { type: DataTypes.STRING, allowNull: false },
        prenom: { type: DataTypes.STRING, allowNull: false },
        email: { type: DataTypes.STRING, allowNull: false },
        userImg: { type: DataTypes.STRING, allowNull: true },
        password: { type: DataTypes.STRING, allowNull: false },
        refresh_token: { type: DataTypes.TEXT }
    }
);

Users.hasMany(Posts);
Posts.belongsTo(Users);

// (async () => { await db.sync(); })();

export default Users;