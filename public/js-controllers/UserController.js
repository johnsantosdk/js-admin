class UserController {

	constructor(formId, tableId) {

		this.formEl = document.getElementById(formId);
		this.tableEl = document.getElementById(tableId);

		this.onSubmit();

	}

	onSubmit() {

		this.formEl.addEventListener("submit", event => {

			event.preventDefault();

			this.addLine(this.getValues());

		});

	}

	getValues() {

		let user = {};

		this.formEl.elements.forEach(function (field, index) {

			if(field.name == "gender") {

				if(field.checked) {
					user[field.name] = field.name;
				}

			} else {

				user[field.name] = field.value;

			}

		});

		return new User(
			user.name, 
			user.gender, 
			user.birth, 
			user.country, 
			user.email, 
			user.password, 
			user.photo, 
			user.admin
		);

	}

	addLine(objectUser) {

		this.tableEl.innerHTML = 
			`<tr>
	            <td><img src="dist/img/user1-128x128.jpg" alt="User Image" class="img-circle img-sm"></td>
	            <td>${objectUser.name}</td>
	            <td>${objectUser.email}</td>
	            <td>${objectUser.admin}</td>
	            <td>${objectUser.birth}</td>
	            <td>
	            	<button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
	                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
	            </td>
	        </tr>`;

		// document.getElementById("tbody-users").appendChild(tr);
	}


}