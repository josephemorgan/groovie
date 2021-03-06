const express = require('express');
const router = express.Router();
const passport = require("passport");
const fetch = require("node-fetch");
const flash = require("connect-flash");
const User = require("../models/user.js");
const middleware = require("../middleware/middleware.js");

/* GET home page. */
router.get('/', (req, res) => {
	res.redirect("/login");
});

router.get('/register', (req, res) => {
	res.render("../views/register.ejs", {title: 'Groovie - Register'});
});

router.post('/register', (req, res) => {
	User.register(new User({username: req.body.username}), req.body.password, (err, user) => {
		if (err) {
			req.flash(err);
			return res.redirect("back");
		} else {
			passport.authenticate("local") (req, res, () => {
				res.redirect('/');
			});
		}
	})
})

router.get('/login', function(req, res, next) {
	res.render('login.ejs', { title: 'Groovie - The Granny Movie Request Interface' });
});

router.post('/login', (req, res, next) => {
	passport.authenticate('local', (err, user, info) => {
		if (err) {
			req.flash("error", "Something went wrong.");
			return next(err);
		} else if (!user) {
			req.flash("error", "Incorrect username or password");
			return res.redirect('/login');
		}
		req.logIn(user, (err) => {
			if (err) {
				return next(err);
			} else {
				req.flash("success", "You've successfully logged in!");
				res.redirect("/");
			}
		});

		// Log user IP
		let filter = {username: user.username};
		let update = {last_ip: req.ip};
		User.findOneAndUpdate(filter, update, (err, updatedUser) => {
			if (err) {
				req.flash(err);
			}
		});
	})
	(req, res, next);
});

router.get('/logout', (req, res) => {
	req.logout();
	res.redirect("/login");
});

// TODO: Add auth middleware
router.get('/all_requests', (req, res) => {
	User.find({}, (err, users) => {
		if (err) {
			req.flash("error", err);
		} else {
			res.render('all_requests.ejs', {title: "Groovie - Admin Overview", users: users});
		}
	})
});

module.exports = router;
