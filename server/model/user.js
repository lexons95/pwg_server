import bcrypt from 'bcryptjs';
import mongoose from 'mongoose';

const { Schema } = mongoose;

const userSchema = new Schema({
  username: String,
  password: String,
  role: String,
  icNum: String,
  name: String,
  contact: String,
  tokenCount: Number 
},{timestamps: true});

userSchema.statics.readUsers = async function(obj) {
    let filterResult = {};
    let sorterResult = {};
    let skipResult = 0;
    let limitResult = 0;

    if (!Object.entries(obj).length === 0 || obj.constructor === Object) {
        
        filterResult = obj.filter ? obj.filter : {};
        let sorter = obj.sorter ? obj.sorter : {};
        sorterResult = Object.assign({},sorter);

        skipResult = obj.skip ? obj.skip : 0;
        limitResult = obj.limit ? obj.limit : 0;

        const orderBy = {
            "desc": -1,
            "acs": 1
        }
        let sorterKeys = Object.keys(sorter);
        sorterKeys.map(aKey=>{
            sorterResult[aKey] = orderBy[aKey];
        })
    }
    return await this.find(filterResult).sort(sorterResult).skip(skipResult).limit(limitResult);
}

userSchema.statics.findOneOrCreate = async function(user) {
    let newUser = user;
    let response = {
        success: false,
        message: "",
        data: {}
    }

    if (newUser && newUser.username && newUser.password) {
        let findPromise = this.findOne({username: newUser.username});
        await findPromise.then( async (result, error) => {
            console.log("in findone")
            if (error) {
                response = {
                    success: false,
                    message: "error in find",
                    data: error
                }
            }
            else {
                if (result) {
                    response = {
                        success: false,
                        message: "data found, cannot create",
                        data: null
                    }
                }
                else {
                    let newUserWithRole = Object.assign({},newUser,{role: "CUSTOMER"})
                    console.log(newUserWithRole)
                    let createPromise = this.create(newUserWithRole);
                    await createPromise.then((result, error) => {
                        if (error) {
                            response = {
                                success: false,
                                message: "error in create",
                                data: error
                            }
                        }
                        else {
                            console.log(result)
                            response = {
                                success: true,
                                message: "data created",
                                data: result
                            }
                        }
                    });
                }
            }
        })     
        
        // let filter = {
        //     username: newUser.username
        // }
        // let findOrCreatePromise = this.findOneAndUpdate(
        //     filter,
        //     newUser,
        //     {
        //         new: true,
        //         upsert: true
        //     }
        // );
        // await findOrCreatePromise.then((result, error) => {
        //     if (error) {
        //         response = {
        //             success: false,
        //             message: "error in create",
        //             data: error
        //         }
        //     }
        //     else {
        //         response = {
        //             success: true,
        //             message: "data found or created",
        //             data: result
        //         }
        //     }
        // })
    }
    else {
        response = {
            success: false,
            message: "data required not complete",
            data: {}
        }
    }
    
    return response;
}

userSchema.statics.updateUser = async function(user) {

    let response = {
        success: false,
        message: "",
        data: {}
    }

    let filter = {
        username: user.username
    }
    let updatePromise = this.findOneAndUpdate(
        filter,
        user, 
        {
            new: true
        }
    )   
    await updatePromise.then((result, error) => {
        if (error) {
            response = {
                success: false,
                message: "error in update",
                data: error
            }
        }
        else {
            response = {
                success: true,
                message: "data updated",
                data: result
            }
        }
    });

    return response;
}

userSchema.statics.findOneUser = async function(obj) {
    let response = {
        success: false,
        message: "",
        data: {}
    }
    let findPromise = this.findOne(obj);
    await findPromise.then( async (result, error) => {
        if (error) {
            response = {
                success: false,
                message: "error in find",
                data: error
            }
        }
        else {
            if (result) {
                response = {
                    success: true,
                    message: "data found",
                    data: result
                }
            }
            else {
                response = {
                    success: false,
                    message: "user not found",
                    data: null
                }
            }
        }
    })

    return response;
}

userSchema.methods.validatePassword = async function(password) {
    return await bcrypt.compare(password, this.password);
};

const User = mongoose.model('User', userSchema); 

export default {
  model: mongoose.model('User', userSchema),
  schema: userSchema,
  User: User
};

/*
email: String,
    name: String,
    address: String,
    ic: String
*/