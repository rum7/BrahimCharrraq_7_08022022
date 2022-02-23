import Users from "../models/UserModel.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import multer from "multer";
import path from "path";

export const getUsers = async(req, res) => {
    try {
        const users = await Users.findAll({});
        res.json(users);
    } catch (error) {
        console.log(error);
    }
}

export const Register = async(req, res) => {
    const { nom, prenom, email, password, confPassword } = req.body;
    // const { image } = `${req.protocol}://${req.get("host")}/images/${req.file.path}`;
    if(password !== confPassword) return res.status(400).json({msg: "Veuillez confirmer le mot de passe"});
    const emailExists = await Users.findOne({ where: { email: req.body.email } });
    if (!emailExists) {
    // res.json({msg: user[0].email});
    //if(user[0].email !== null) {
        const salt = await bcrypt.genSalt();
        const hashPassword = await bcrypt.hash(password, salt);
        try {
            await Users.create({
                nom: nom,
                prenom: prenom,
                image: "128x128.png",
                email: email,
                password: hashPassword
            });
            res.json({msg: "Inscription réussie"});
        } catch (error) {
            console.log(error);
        }
    } else {
        return res.status(400).json({msg: "Cette adresse email existe déjà"});
    }
}

export const Login = async(req, res) => {
    try {
        const user = await Users.findAll({
            where:{
                email: req.body.email
            }
        });
        const match = await bcrypt.compare(req.body.password, user[0].password);
        if(!match) return res.status(400).json({msg: "Mot de passe erroné"});
        const userId = user[0].id;
        const nom = user[0].nom;
        const prenom = user[0].prenom;
        const image = user[0].image;
        const email = user[0].email;
        const accessToken = jwt.sign({userId, nom, prenom, image, email}, process.env.ACCESS_TOKEN_SECRET,{
            expiresIn: '15s'
        });
        const refreshToken = jwt.sign({userId, nom, prenom, image, email}, process.env.REFRESH_TOKEN_SECRET,{
            expiresIn: '1d'
        });
        await Users.update({refresh_token: refreshToken},{
            where:{
                id: userId
            }
        });
        res.cookie('refreshToken', refreshToken,{
            httpOnly: true,
            maxAge: 24 * 60 * 60 * 1000
        });
        res.json({ accessToken });
    } catch (error) {
        res.status(404).json({msg:"L'adresse email n'existe pas"});
    }
}

export const Logout = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);
    const user = await Users.findAll({
        where:{
            refresh_token: refreshToken
        }
    });
    if(!user[0]) return res.sendStatus(204);
    const userId = user[0].id;
    await Users.update({refresh_token: null},{
        where:{
            id: userId
        }
    });
    res.clearCookie('refreshToken');
    return res.sendStatus(200);
}

export const updateUser = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);

    try {
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        const userId = user[0].id;
        const req_Id = req.params.id;
        if(userId == req_Id) {
            // const req_Img = req.file.filename;
            // if(!req_Img) {
            //     req_Img = "128x128.png";
            // }
            // const dataUp = {
            //     prenom: req.body.prenom,
            //     nom: req.body.nom,
            //     email: req.body.email,
            //     image: req_Img
            // };

            const userUp = req.file ?
            {
                ...req.body,
                image: req.file.filename
            } : {
                ...req.body
            };

            await Users.update(userUp, {
                where: {
                    id: userId
                }
            });
            res.json({msg: "Les informations de l'utilisateur ont bien été modifié"});
        } else {
            res.status(400).json({msg: "Autorisation de modifier les informations de cet utilisateur refusée"});
        }

    } catch (error) {
        res.json({ msg: error.msg });
    }  
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, '../frontend/public/images')
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname))
    }
})

export const uploadImage = multer({
    storage: storage,
    limits: { fileSize: 2000000 },
    fileFilter: (req, file, cb) => {
        const fileTypes = /jpeg|jpg|png|gif/
        const mimeType = fileTypes.test(file.mimetype)  
        const extname = fileTypes.test(path.extname(file.originalname))

        if(mimeType && extname) {
            return cb(null, true)
        }
        cb('Give proper files formate to upload')
    }
}).single('image')

export const deleteUser = async(req, res) => {
    const refreshToken = req.cookies.refreshToken;
    if(!refreshToken) return res.sendStatus(204);

    try {
        const user = await Users.findAll({
            where:{
                refresh_token: refreshToken
            }
        });
        const userId = user[0].id;
        const req_Id = req.params.id;
        if(userId == req_Id) {
            await Users.destroy({
                where: {
                    id: userId
                }
            });
            res.json({msg: "Utilisateur supprimé"});
        } else {
            res.status(400).json({msg: "Autorisation de supprimer cet utilisateur refusée"});
        }

    } catch (error) {
        res.json({ msg: error.msg });
    }  
}