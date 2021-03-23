import express, { response } from "express";
import bcryptjs from "bcryptjs";
import jwt from "jsonwebtoken";
import config from "../../config/index";
const {JWT_SECRET} = config;

// Call user model.
import User from '../../models/user';

const router = express.Router();

// @routes  GET api/user
// @Desc    GET all user
// @Acess   public
router.get('/', async(request, response) => {
    try {
        const users = await User.find();
        if (!users) throw Error("No users");
        // ?????send?????
        // axios
        response.status(200).json(users);
        
    } catch(err) {
        console.log(err);
        response.status(400).json({msg: err.message});
        // response.status(404).json({msg: err.message})
    }
});

// @routes  POST api/user
// @Desc    POST all user
// @Acess   public
router.post('/', async(request, response) => {
    console.log('router>user.js: ', request);    
    const {name, email, password} = request.body;

    // simple validation
    if (!name || !email || !password) {
        return response.status(400).json({msg: 'Fill up all of them'});
    }

    // check for exising user
    User.findOne({email}).then((user) => {
        if (user)
            return response.status(200).json({msg: 'User already joined exists.'});
        const newUser = new User({
            name, email, password
        })
        // "10" 2^10
        bcryptjs.genSalt(10, (err, salt) => {
            bcryptjs.hash(newUser.password, salt, (err, hash) => {
                if(err) throw err;
                newUser.password = hash;
                newUser.save().then((user) => {
                    jwt.sign(
                        {id: user.id},
                        JWT_SECRET,
                        {expiresIn: 3600},
                        (err, token) => {
                            if(err) throw err;
                            response.json({
                                token,
                                user: {
                                    id: user.id,
                                    name: user.name,
                                    email: user.email
                                }
                            })
                        }
                    )
                })
            })
        })
    })
})

export default router;




