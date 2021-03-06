const mongoose = require("mongoose");
const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = new mongoose.Schema({
	username: String,
	password: String,
	last_ip: String,
	requested_movies: [
		{
			movie_id: String,
			movie_title: String,
			movie_release_date: String,
			movie_description: String,
			movie_rating: String,
			movie_poster: String
		}
	],
	requested_tv_shows: [
		{
			tv_show_id: String,
			tv_show_title: String,
			tv_show_first_air_date: String,
			tv_show_description: String,
			tv_show_rating: String,
			tv_show_poster: String
		}
	]
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model("User", UserSchema);
