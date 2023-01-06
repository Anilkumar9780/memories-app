const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const requireLogin  = require('../middleware/requireLogin')
const Post =  mongoose.model("Post")
const User = mongoose.model("User")


router.get('/user/:id',requireLogin,(req,res)=>{
    User.findOne({_id:req.params.id})
    .select("-password")
    .then(user=>{
         Post.find({postedBy:req.params.id})
         .populate("postedBy","_id name")
         .exec((err,posts)=>{
             if(err){
                 return res.status(422).json({error:err})
             }
             res.json({user,posts})
         })
    }).catch(err=>{
        return res.status(404).json({error:"User not found"})
    })
})


router.put('/follow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.followId,{
        $push:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $push:{following:req.body.followId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})
router.put('/unfollow',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.body.unfollowId,{
        $pull:{followers:req.user._id}
    },{
        new:true
    },(err,result)=>{
        if(err){
            return res.status(422).json({error:err})
        }
      User.findByIdAndUpdate(req.user._id,{
          $pull:{following:req.body.unfollowId}
          
      },{new:true}).select("-password").then(result=>{
          res.json(result)
      }).catch(err=>{
          return res.status(422).json({error:err})
      })

    }
    )
})


router.put('/updatepic',requireLogin,(req,res)=>{
    User.findByIdAndUpdate(req.user._id,{$set:{pic:req.body.pic}},{new:true},
        (err,result)=>{
         if(err){
             return res.status(422).json({error:"pic canot post"})
         }
         res.json(result)
    })
})



router.post('/search-users',(req,res)=>{
    let userPattern = new RegExp("^"+req.body.query)
    User.find({email:{$regex:userPattern}})
    .select("_id email")
    .then(user=>{
        res.json({user})
    }).catch(err=>{
        console.log(err)
    })

})

 // try {
    //     if (!mongoose.Types.ObjectId.isValid(req.body.followId)) {
    //         return res.status(404).json({ error: 'Invalid ID' })
    //     }
    //     if (req.body.user._id === req.body.followId) {
    //         return res.status(400).json({ message: 'You cannot follow yourself' })
    //     }
    //     const user = await User.findById(req.body.followId);
    //     const currentUser = await User.findById(req.body.user._id);
    //     if (!user.followers.includes(req.body.user._id)) {
    //         await user.updateOne({ $push: { followers: req.body.user._id } });
    //         await currentUser.updateOne({ $push: { following: req.body.followId } });
    //         res.status(200).json({ currentUser, message: "user has been followed" });
    // } else {
    //     res.status(403).json({ message: "you allready follow this user" });
    // }
    // } catch (err) {
    //     res.status(400).send({ message: "User Follow Failed", error: err.message })
    // }

    // try {
    //     if (req.body.user._id === req.body.unFollowId) {
    //         return res.status(400).json({ message: 'You cannot unfollow yourself' })
    //     }
    //     const user = await User.findById(req.body.unFollowId);
    //     const currentUser = await User.findById(req.body.user._id);
    //     if (user.followers.includes(req.body.user._id)) {
    //         await user.updateOne({ $pull: { followers: req.body.user._id } });
    //         await currentUser.updateOne({ $pull: { following: req.body.unFollowId } });
    //         res.status(200).json({ currentUser, message: "user has been unfollowed" });
    //     } else {
    //         res.status(403).json({ message: "you don't follow this user" });
    //     }
    // } catch (error) {
    //     res.status(500).send({ message: "User UnFollow Failed", data: error.message });
    // }
module.exports = router

router.patch('/follow/:id', authenticate, async (req, res) => {
    try {
        const id = new ObjectID(req.params.id)
        // check if the id is a valid one
        if (!ObjectID.isValid(req.params.id)) {
            return res.status(404).json({ error: 'Invalid ID' })
        }
        // check if your id doesn't match the id of the user you want to follow
        if (res.user._id === req.params.id) {
            return res.status(400).json({ error: 'You cannot follow yourself' })
        }
        // add the id of the user you want to follow in following array
        const query = {
            _id: res.user._id,
            following: { $not: { $elemMatch: { $eq: id } } }
        }
        const update = {
            $addToSet: { following: id }
        }
        const updated = await User.updateOne(query, update)
        // add your id to the followers array of the user you want to follow
        const secondQuery = {
            _id: id,
            followers: { $not: { $elemMatch: { $eq: res.user._id } } }
        }
        const secondUpdate = {
            $addToSet: { followers: res.user._id }
        }
        const secondUpdated = await User.updateOne(secondQuery, secondUpdate)
        if (!updated || !secondUpdated) {
            return res.status(404).json({ error: 'Unable to follow that user' })
        }
        res.status(200).json(update)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

router.patch('/unfollow/:id', authenticate, async (req, res) => {
    try {
        const { id } = req.params
        // check if the id is a valid one
        if (!ObjectID.isValid(id)) {
            return res.status(404).json({ error: 'Invalid ID' })
        }
        // check if your id doesn't match the id of the user you want to unfollow
        if (res.user._id === id) {
            return res.status(400).json({ error: 'You cannot unfollow yourself' })
        }
        // remove the id of the user you want to unfollow from following array
        const query = {
            _id: res.user._id,
            following: { $elemMatch: { $eq: id } }
        }
        const update = {
            $pull: { following: id }
        }
        const updated = await User.updateOne(query, update)
        // remove your id from the followers array of the user you want to unfollow
        const secondQuery = {
            _id: id,
            followers: { $elemMatch: { $eq: res.user._id } }
        }
        const secondUpdate = {
            $pull: { followers: res.user._id }
        }
        const secondUpdated = await User.updateOne(secondQuery, secondUpdate)

        if (!updated || !secondUpdated) {
            return res.status(404).json({ error: 'Unable to unfollow that user' })
        }
        res.status(200).json(update)
    } catch (err) {
        res.status(400).send({ error: err.message })
    }
})

const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
    {

        name: {
            type: String,
            trim: true,
        },

        following: {
            type: Array
        },
        followers: {
            type: Array
        },

    },
    {
        timestamps: true,
    }
);

const User = mongoose.model("User", userSchema);
module.exports = User;


const mongoose = require('mongoose')
const {ObjectId} = mongoose.Schema.Types
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    password:{
        type:String,
        required:true
    },
    resetToken:String,
    expireToken:Date,
    pic:{
     type:String,
     default:"https://res.cloudinary.com/cnq/image/upload/v1586197723/noimage_d4ipmd.png"
    },
    followers:[{type:ObjectId,ref:"User"}],
    following:[{type:ObjectId,ref:"User"}]
})

mongoose.model("User",userSchema)



try {
    let whomFollowed = await User.findByIdAndUpdate({ _id: req.body.followingId },
        { $push: { following: req.body.followerId } }
    );
    let whoFollowedMe = await User.findByIdAndUpdate({ _id: req.body.followerId },
        { $push: { followers: req.body.followingId } }
    )
    return res.status(200).send({ message: "User Follow Success" });
} catch (e) {
    return res.status(500).send({ message: "User Follow Failed", data: e.message });
}



try {
    let whomUnFollowed = await User.findByIdAndUpdate({ _id: req.body.followingId },
        { $pull: { following: req.body.followerId } }
    );
    let whoUnFollowedMe = await User.findByIdAndUpdate({ _id: req.body.followerId },
        { $pull: { followers: req.body.followingId } }
    )
    return res.status(200).send({ message: "User UnFollow Success" });
} catch (e) {
    return res.status(500).send({ message: "User UnFollow Failed", data: e.message });
}





import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'
import {useParams} from 'react-router-dom'
const Profile  = ()=>{
    const [userProfile,setProfile] = useState(null)
    
    const {state,dispatch} = useContext(UserContext)
    const {userid} = useParams()
    const [showfollow,setShowFollow] = useState(state?!state.following.includes(userid):true)
    useEffect(()=>{
       fetch(`/user/${userid}`,{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           //console.log(result)
         
            setProfile(result)
       })
    },[])


    const followUser = ()=>{
        fetch('/follow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                followId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
        
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
             setProfile((prevState)=>{
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:[...prevState.user.followers,data._id]
                        }
                 }
             })
             setShowFollow(false)
        })
    }
    const unfollowUser = ()=>{
        fetch('/unfollow',{
            method:"put",
            headers:{
                "Content-Type":"application/json",
                "Authorization":"Bearer "+localStorage.getItem('jwt')
            },
            body:JSON.stringify({
                unfollowId:userid
            })
        }).then(res=>res.json())
        .then(data=>{
            
            dispatch({type:"UPDATE",payload:{following:data.following,followers:data.followers}})
             localStorage.setItem("user",JSON.stringify(data))
            
             setProfile((prevState)=>{
                const newFollower = prevState.user.followers.filter(item=>item != data._id )
                 return {
                     ...prevState,
                     user:{
                         ...prevState.user,
                         followers:newFollower
                        }
                 }
             })
             setShowFollow(true)
             
        })
    }
   return (
       <>
       {userProfile ?
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
               display:"flex",
               justifyContent:"space-around",
               margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={userProfile.user.pic}
                   />
               </div>
               <div>
                   <h4>{userProfile.user.name}</h4>
                   <h5>{userProfile.user.email}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{userProfile.posts.length} posts</h6>
                       <h6>{userProfile.user.followers.length} followers</h6>
                       <h6>{userProfile.user.following.length} following</h6>
                   </div>
                   {showfollow?
                   <button style={{
                       margin:"10px"
                   }} className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>followUser()}
                    >
                        Follow
                    </button>
                    : 
                    <button
                    style={{
                        margin:"10px"
                    }}
                    className="btn waves-effect waves-light #64b5f6 blue darken-1"
                    onClick={()=>unfollowUser()}
                    >
                        UnFollow
                    </button>
                    }
                   
                  

               </div>
           </div>
     
           <div className="gallery">
               {
                   userProfile.posts.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
               }

           
           </div>
       </div>
       
       
       : <h2>loading...!</h2>}
       
       </>
   )
}


export default Profile











router.post("/user/:user_id/follow-user",  passport.authenticate("jwt", { session:false}), (req,res) => {

    // check if the requested user and :user_id is same if same then 

    if (req.user.id === req.params.user_id) {
        return res.status(400).json({ alreadyfollow : "You cannot follow yourself"})
    } 

    User.findById(req.params.user_id)
        .then(user => {

            // check if the requested user is already in follower list of other user then 

            if(user.followers.filter(follower => 
                follower.user.toString() === req.user.id ).length > 0){
                return res.status(400).json({ alreadyfollow : "You already followed the user"})
            }

            user.followers.unshift({user:req.user.id});
            user.save()
            User.findOne({ email: req.user.email })
                .then(user => {
                    user.following.unshift({user:req.params.user_id});
                    user.save().then(user => res.json(user))
                })
                .catch(err => res.status(404).json({alradyfollow:"you already followed the user"}))
        })
})
\





router.put("/:id/follow", async (req, res) => {
    if (req.body.userId !== req.params.id) {
      try {
        const user = await User.findById(req.params.id);
        const currentUser = await User.findById(req.body.userId);
        if (!user.followers.includes(req.body.userId)) {
          await user.updateOne({ $push: { followers: req.body.userId } });
          await currentUser.updateOne({ $push: { followings: req.params.id } });
          res.status(200).json("user has been followed");
        } else {
          res.status(403).json("you allready follow this user");
        }
      } catch (err) {
        res.status(500).json(err);
      }
    } else {
      res.status(403).json("you cant follow yourself");
    }
  });
  
  //unfollow a user
  
  router.put("/:id/unfollow", async (req, res) => {
      if (req.body.userId !== req.params.id) {
        try {
          const user = await User.findById(req.params.id);
          const currentUser = await User.findById(req.body.userId);
          if (user.followers.includes(req.body.userId)) {
            await user.updateOne({ $pull: { followers: req.body.userId } });
            await currentUser.updateOne({ $pull: { followings: req.params.id } });
            res.status(200).json("user has been unfollowed");
          } else {
            res.status(403).json("you dont follow this user");
          }
        } catch (err) {
          res.status(500).json(err);
        }
      } else {
        res.status(403).json("you cant unfollow yourself");
      }
    });
  
  module.exports = router;












//   / try {
    // if (!mongoose.Types.ObjectId.isValid(req.body.followId)) {
    //     return res.status(404).json({ error: 'Invalid ID' })
    // }
    // if (req.body.user._id === req.body.followId) {
    //     return res.status(400).json({ message: 'You cannot follow yourself' })
    // }
    //     const user = await User.findById(req.body.followId);
    //     const currentUser = await User.findById(req.body.user._id);
    //     if (!user.followers.includes(req.body.user._id)) {
    //         await user.updateOne({ $push: { followers: req.body.user._id } }, { new: true });
    //         await currentUser.updateOne({ $push: { following: req.body.followId } }, { new: true });
    //         await user.save();
    //         await currentUser.save();
    //         res.status(200).json({ currentUser, user, message: "user has been followed" });
    //     } else {
    //         res.status(403).json({ message: "you allready follow this user" });
    //     }
    // } catch (err) {
    //     res.status(400).send({ message: "User Follow Failed", error: err.message })
    // }


     // try {
    //     if (req.body.user._id === req.body.unFollowId) {
    //         return res.status(400).json({ message: 'You cannot unfollow yourself' })
    //     }
    //     const user = await User.findById(req.body.unFollowId);
    //     const currentUser = await User.findById(req.body.user._id);
    //     if (user.followers.includes(req.body.user._id)) {
    //         await user.updateOne({ $pull: { followers: req.body.user._id } }, { new: true });
    //         await currentUser.updateOne({ $pull: { following: req.body.unFollowId } }, { new: true });
    //         await user.save();
    //         await currentUser.save();
    //         res.status(200).json({ currentUser, user, message: "user has been unfollowed" });
    //     } else {
    //         res.status(403).json({ message: "you don't follow this user" });
    //     }
    // } catch (error) {
    //     res.status(500).send({ message: "User Follow Failed", data: error.message });
    // }








    user.friends = user.friends.filter(id => id !== friendId) //and this
    friend.friends = friend.friends.filter(id => id !== friendId) //and this
  } else {
    user.friends = [...user.friends, friend]
    friend.friends = [...friend.friends, user]
  }

  await user.save()
  await friend.save()








  export const add_followers = async (req: Request, res: Response) => {
    reqInfo(req)
    let user: any = req.header('user'),
        body = req.body,
        response: any
    console.log("user", user);

    try {
        response = await userModel.findOne({
            _id: ObjectId(body.id), isActive: true, "follow.followers": { $elemMatch: { followedBy: ObjectId(user?._id) } }
        }) // body.id -> jene follow karvanu 6    //  user.id je follow kare 6 
        console.log("response", response);

        if (response) {
            console.log("response cond 1")
            let data = await userModel.findOneAndUpdate({ _id: ObjectId(body.id), isActive: true }, {
                $pull: { "follow.followers": { followedBy: ObjectId(user._id) } }
            }, { new: true })
            data = await userModel.findOneAndUpdate({ _id: ObjectId(user._id), isActive: true }, {
                $pull: { "follow.following": { followingBy: ObjectId(body.id) } }
            }, { new: true })
            return res.status(200).json(await apiResponse(200, "unFollow Successfully", data, {}));
        }
        if (!response) {
            console.log("response cond 2")
            response = await userModel.findOneAndUpdate({ _id: ObjectId(body.id), isActive: true }, {
                $push: {
                    "follow.followers": {
                        followedBy: ObjectId(user?._id),
                        name: user?.userName,
                        image: user?.userImage
                    },
                    $count: "follow.followers"
                },

            }, { new: true })
            await userModel.findOneAndUpdate({ _id: ObjectId(user._id), isActive: true }, {
                $addToSet: {
                    "follow.following": {
                        followingBy: ObjectId(body.id),
                        name: body?.userName,
                        image: body?.userImage
                    },
                    $count: "follow.following"
                },
            }, { new: true })
            return res.status(200).json(await apiResponse(200, responseMessage?.addDataSuccess("following"), response, {}));
        } else {
            return res.status(403).json(await apiResponse(403, responseMessage?.getDataNotFound("user"), null, {}))
        }

    } catch (error) {
        console.log(error)
        return res.status(500).json(await apiResponse(500, responseMessage?.internalServerError, {}, error))
    }







    router.get('/follow/:id', isLoggedIn, async function(req, res, next) {
      try {
        const user = await User.findById(req.params.id);
    
         if (!user) {
          req.flash("error", "User does not exist");
          res.redirect('back')
          return res.status(404).json({ error: 'User does not exist' });
    
        }
    
      if (user.followers.indexOf(req.user.id) !== -1) {
        req.flash("error",`You're already following ${user.local.username}` )
        res.redirect('back')
        return res.status(400).json({ error: `You're already following 
    ${user.local.username}` });
      }
    
     user.followers.addToSet(req.user.id);
     await user.save();
    
    const users = await User.findById(req.user.id);
    users.following.addToSet(user.id);
    await users.save();
    req.flash("success", "User added")
    return res.redirect('back')
     } catch (err) {
     return next(err);
    }
    
    });
    
    router.delete('/follow/:id', isLoggedIn, async function(req, res) {
    try {
    
    const user = await User.findById(req.params.id);
    
      if (!user) {
        return res.status(404).json({ error: 'User not found' });
      }
    
      const following = user.followers.indexOf(req.user.id);
      if (following === -1) {
        return res.status(400).json({ error: `You're not following 
    ${user.username}` });
      }
    
      user.followers.splice(following, 1);
      await user.save();
    
      const userLogged = await User.findById(req.user.id);
    
      const positionUnfollow = userLogged.following.indexOf(user.id);
      userLogged.following.splice(positionUnfollow, 1);
    
      await userLogged.save();
      req.flash('success', `You have sucessfully unfollowed 
    ${user.local.username || user.facebook.name}`)
      return res.redirect("back");
    } catch (err) {
      return next(err);
      }
     });








     waterfall([
        (done) => {
            crypto.randomBytes(20, (err, buf) => {
                var token = buf.toString('hex');
                done(err, token);
            });
        },
        (token, done) => {
            User.findOne({ email: req.body.email }, function (err, user) {
                if (!user) {
                    req.flash('error', 'No account with that email address exists.');
                    return res.redirect('/forgot');
                }
                user.resetPasswordToken = token;
                user.resetPasswordExpires = Date.now() + 3600000; // 1 hour

                user.save((err) => {
                    done(err, token, user);
                });
            });
        },
        (token, user, done) => {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: {
                    user: '!!! YOUR SENDGRID USERNAME !!!',
                    pass: '!!! YOUR SENDGRID PASSWORD !!!'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Node.js Password Reset',
                text: 'You are receiving this because you (or someone else) have requested the reset of the password for your account.\n\n' +
                    'Please click on the following link, or paste this into your browser to complete the process:\n\n' +
                    'http://' + req.headers.host + '/reset/' + token + '\n\n' +
                    'If you did not request this, please ignore this email and your password will remain unchanged.\n'
            };
            smtpTransport.sendMail(mailOptions, (err) => {
                req.flash('info', 'An e-mail has been sent to ' + user.email + ' with further instructions.');
                done(err, 'done');
            });
        }
    ], (err) => {
        if (err) return next(err);
        res.redirect('/forgot');
    });








    User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
        if (!user) {
            req.flash('error', 'Password reset token is invalid or has expired.');
            return res.redirect('/forgot');
        }
        res.render('reset', {
            user: req.user
        });
    });









    async.waterfall([
        (done) => {
            User.findOne({ resetPasswordToken: req.params.token, resetPasswordExpires: { $gt: Date.now() } }, function (err, user) {
                if (!user) {
                    req.flash('error', 'Password reset token is invalid or has expired.');
                    return res.redirect('back');
                }
                user.password = req.body.password;
                user.resetPasswordToken = undefined;
                user.resetPasswordExpires = undefined;

                user.save((err) => {
                    req.logIn(user, (err) => {
                        done(err, user);
                    });
                });
            });
        },
        (user, done) => {
            var smtpTransport = nodemailer.createTransport('SMTP', {
                service: 'SendGrid',
                auth: {
                    user: '!!! YOUR SENDGRID USERNAME !!!',
                    pass: '!!! YOUR SENDGRID PASSWORD !!!'
                }
            });
            var mailOptions = {
                to: user.email,
                from: 'passwordreset@demo.com',
                subject: 'Your password has been changed',
                text: 'Hello,\n\n' +
                    'This is a confirmation that the password for your account ' + user.email + ' has just been changed.\n'
            };
            smtpTransport.sendMail(mailOptions, function (err) {
                req.flash('success', 'Success! Your password has been changed.');
                done(err);
            });
        }
    ], (err) => {
        res.redirect('/');
    });






    try {
        crypto.randomBytes(32, async (err, buffer) => {
            if (err) {
                console.log(err)
            }
            const token = buffer.toString("hex")
            const user = await User.findOne({ email: req.body.email });
            if (!user) {
                return res.status(422).json({ error: "User dont exists with that email" })
            }
            user.resetPasswordToken = token
            user.resetPasswordExpires = Date.now() + 3600000
            await user.save();
            transporter.sendMail({
                to: user.email,
                from: "no-replay@insta.com",
                subject: "password reset",
                html: `
                <p>You requested for password reset</p>
                <h5>click in this <a href="http://localhost:3000/user/reset/${token}">link</a> to reset password</h5>
                `
            })
            res.status(200).json({ message: "send your email" })
        })
    } catch (error) {
        res.status(404).send({ message: "Check your email", data: error.message });
    }













    const User = require('../models/user');

const sgMail = require('@sendgrid/mail');
sgMail.setApiKey(process.env.SENDGRID_API_KEY);


// ===PASSWORD RECOVER AND RESET

// @route POST api/auth/recover
// @desc Recover Password - Generates token and Sends password reset email
// @access Public
exports.recover = (req, res) => {
    User.findOne({email: req.body.email})
        .then(user => {
            if (!user) return res.status(401).json({message: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.'});

            //Generate and set password reset token
            user.generatePasswordReset();

            // Save the updated user object
            user.save()
                .then(user => {
                    // send email
                    let link = "http://" + req.headers.host + "/api/auth/reset/" + user.resetPasswordToken;
                    const mailOptions = {
                        to: user.email,
                        from: process.env.FROM_EMAIL,
                        subject: "Password change request",
                        text: `Hi ${user.username} \n 
                    Please click on the following link ${link} to reset your password. \n\n 
                    If you did not request this, please ignore this email and your password will remain unchanged.\n`,
                    };

                    sgMail.send(mailOptions, (error, result) => {
                        if (error) return res.status(500).json({message: error.message});

                        res.status(200).json({message: 'A reset email has been sent to ' + user.email + '.'});
                    });
                })
                .catch(err => res.status(500).json({message: err.message}));
        })
        .catch(err => res.status(500).json({message: err.message}));
};




router.put('/updatepic', requireLogin, (req, res) => {
    User.findByIdAndUpdate(req.user._id, { $set: { pic: req.body.pic } }, { new: true },
        (err, result) => {
            if (err) {
                return res.status(422).json({ error: "pic canot post" })
            }
            res.json(result)
        })
})
import React,{useEffect,useState,useContext} from 'react'
import {UserContext} from '../../App'

const Profile  = ()=>{
    const [mypics,setPics] = useState([])
    const {state,dispatch} = useContext(UserContext)
    const [image,setImage] = useState("")
    useEffect(()=>{
       fetch('/mypost',{
           headers:{
               "Authorization":"Bearer "+localStorage.getItem("jwt")
           }
       }).then(res=>res.json())
       .then(result=>{
           console.log(result)
           setPics(result.mypost)
       })
    },[])
    useEffect(()=>{
       if(image){
        const data = new FormData()
        data.append("file",image)
        data.append("upload_preset","insta-clone")
        data.append("cloud_name","cnq")
        fetch("https://api.cloudinary.com/v1_1/cnq/image/upload",{
            method:"post",
            body:data
        })
        .then(res=>res.json())
        .then(data=>{
    
       
           fetch('/updatepic',{
               method:"put",
               headers:{
                   "Content-Type":"application/json",
                   "Authorization":"Bearer "+localStorage.getItem("jwt")
               },
               body:JSON.stringify({
                   pic:data.url
               })
           }).then(res=>res.json())
           .then(result=>{
               console.log(result)
               localStorage.setItem("user",JSON.stringify({...state,pic:result.pic}))
               dispatch({type:"UPDATEPIC",payload:result.pic})
               //window.location.reload()
           })
       
        })
        .catch(err=>{
            console.log(err)
        })
       }
    },[image])
    const updatePhoto = (file)=>{
        setImage(file)
    }
   return (
       <div style={{maxWidth:"550px",margin:"0px auto"}}>
           <div style={{
              margin:"18px 0px",
               borderBottom:"1px solid grey"
           }}>

         
           <div style={{
               display:"flex",
               justifyContent:"space-around",
              
           }}>
               <div>
                   <img style={{width:"160px",height:"160px",borderRadius:"80px"}}
                   src={state?state.pic:"loading"}
                   />
                 
               </div>
               <div>
                   <h4>{state?state.name:"loading"}</h4>
                   <h5>{state?state.email:"loading"}</h5>
                   <div style={{display:"flex",justifyContent:"space-between",width:"108%"}}>
                       <h6>{mypics.length} posts</h6>
                       <h6>{state?state.followers.length:"0"} followers</h6>
                       <h6>{state?state.following.length:"0"} following</h6>
                   </div>

               </div>
           </div>
        
            <div className="file-field input-field" style={{margin:"10px"}}>
            <div className="btn #64b5f6 blue darken-1">
                <span>Update pic</span>
                <input type="file" onChange={(e)=>updatePhoto(e.target.files[0])} />
            </div>
            <div className="file-path-wrapper">
                <input className="file-path validate" type="text" />
            </div>
            </div>
            </div>      
           <div className="gallery">
               {
                   mypics.map(item=>{
                       return(
                        <img key={item._id} className="item" src={item.photo} alt={item.title}/>  
                       )
                   })
               }

           
           </div>
       </div>
   )
}


export default Profile










router.get('/getsubpost',requireLogin,(req,res)=>{

    // if postedBy in following
    Post.find({postedBy:{$in:req.user.following}})
    .populate("postedBy","_id name")
    .populate("comments.postedBy","_id name")
    .sort('-createdAt')
    .then(posts=>{
        res.json({posts})
    })
    .catch(err=>{
        console.log(err)
    })
})

useEffect(()=>{
    fetch('/getsubpost',{
        headers:{
            "Authorization":"Bearer "+localStorage.getItem("jwt")
        }
    }).then(res=>res.json())
    .then(result=>{
        console.log(result)
        setData(result.posts)
    })
 },[])

 