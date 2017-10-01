const express = require('express');
const router = express.Router();

// bring in comments model
let Comment = require('../models/comment');
// bring in user model
let User = require('../models/user');

// add comments route
router.get('/add', ensureAuthenticated, function(req, res){
	res.render('add_comment', {
		title:'Add Comments'
	});
});

// add submit POST route
router.post('/add', function(req, res){
	req.checkBody('title', 'Title is rquired').notEmpty();
	//req.checkBody('author', 'Author is required').notEmpty();
	req.checkBody('body', 'Body is required').notEmpty();

	// get errors
	let errors = req.validationErrors();

	if(errors){
		res.render('add_comment', {
			title:'Add_Comment',
			errors:errors
		});
	} else {
	
		let comment = new Comment();
		comment.title = req.body.title;
		comment.author = req.user._id;
		comment.body = req.body.body;

		comment.save(function(err){
			if(err){
				console.log(err);
				return;
			} else {
				req.flash('success', 'Comment Added');
				res.redirect('/');
			}
		});
	}
});

// load edit form
router.get('/edit/:id', ensureAuthenticated, function(req, res){
	Comment.findById(req.params.id, function(err, comment){
		if(comment.author != req.user._id){
			req.flash('danger', 'Not Authorized');
			res.redirect('/');
		}
		res.render('edit_comment', {
			title:'Edit Comment',
			comment:comment
		});
	});
});

// update submit POST route
router.post('/edit/:id', function(req, res){
	req.checkBody('title', 'Title is required').notEmpty();
	req.checkBody('author', 'Author is required').notEmpty();
	req.checkBody('body', 'Body is required').notEmpty();

	// get errors
	let errors = req.validationErrors();

	if (errors){
		res.render('add_comment', {
			title: 'Add Comment',
			errors:errors
		});
	} else {
		let comment = {};
		comment.title = req.body.title;
		comment.author = req.body.author;
		comment.body = req.body.body;

		let query = {_id:req.params.id}

		Comment.update(query, comment, function(err){
			if(err){
				console.log(err);
				return;
			} else {
				req.flash('success', 'Comment Updated');
				res.redirect('/');
			}
		});
	}
});

// delete comment
router.delete('/:id', function(req, res){
	if(!req.user._id){
		res.status(500).send();
	}

	let query = {_id:req.params.id}

	Comment.findById(req.params.id, function(err, comment){
		if(comment.author != req.user._id){
			res.status(500).send();
		} else {
			Comment.remove(query, function(err){
				if(err){
					console.log(err);
				}
				res.send('Success');
			});
		}
	});
});

// route to get single comment
router.get('/:id', function(req, res){
	Comment.findById(req.params.id, function(err, comment){
		User.findById(comment.author, function(err, user){
			res.render('comment', {
				comment:comment,
				author:user.name
			});
		});
	});
});

// access control
function ensureAuthenticated(req, res, next){
	if(req.isAuthenticated()){
		return next();
	} else {
		req.flash('danger', 'Please login');
		res.redirect('/users/login');
	}
}

module.exports = router;
