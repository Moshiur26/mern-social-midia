import express from 'express'
import userCtrl from '../controllers/user.controller'
import authCtrl from '../controllers/auth.controller'
import postCtrl from '../controllers/post.controller'

const router = express.Router()

router.route('/api/posts/new/:userId')
    .get(authCtrl.requireSignin, postCtrl.create)

router.route('/api/posts/photo/:postId')
    .get(postCtrl.photo)

router.route('/api/posts/by/:userId')
    .get(authCtrl.requireSignin, postCtrl.listByUser)

router.route('/api/posts/feed/:userId')
    .get(authCtrl.requireSignin, postCtrl.listNewsFeed)

router.param('userId', userCtrl.userById)
router.param('postId', postCtrl.postByID)

export default router