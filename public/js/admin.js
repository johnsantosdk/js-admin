var fields = document.querySelectorAll("#form-user-create [name]");

var user = {};

document.getElementById("#form-user-create").addEventListener("submit", function(event){

	event.preventDefault();

	fields.foreEach(function (field, index) {

		if(field.name == "gender") {

			if(field.checked) {
				user[field.name] = field.name;
			}

		} else {

			user[field.name] = field.value;

		}

	});

	console.log(user);

});