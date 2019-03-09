class UserController {

	constructor(formId, tableId) {

		this.formEl = document.getElementById(formId);
		this.tableEl = document.getElementById(tableId);

		this.onSubmit();

	}

	onSubmit() {

		this.formEl.addEventListener("submit", event => {

			event.preventDefault();

			let btn = this.formEl.querySelector("[type=submit]");

			btn.disabled = true;

			let values = this.getValues();			

			this.getPhoto().then(
				(content) => {

					values.photo = content;

					this.addLine(values);

					this.formEl.reset();

					btn.disabled = false;

				},
				(e) => {
					console.error(e);
				}
				);

		});

	}

	getPhoto(callback) {

		return new Promise( (resolve, reject) => {

			let fileReader = new FileReader();

			let elements = [...this.formEl.elements].filter(item => {

				if (item.name === 'photo') {
					
					return item;

				}

			});

			console.log(elements[0].files[0]);

			let file = elements[0].files[0];

			fileReader.onload = () => {

				resolve(fileReader.result);

			};

			fileReader.onerror = () => {

				reject(e);
			
			}

			if(file){
				fileReader.readAsDataURL(file);
			} else {
				resolve('dist/img/boxed-bg.jpg');
			}
			
		});
	}

	getValues() {

		let user = {};
		let isValid = true;

		[...this.formEl.elements].forEach(function (field, index) {

			if(['name', 'email', 'password'].indexOf(field.name) > -1 && !field.value){

				field.parentElement.classList.add(['has-error']);

				isValid = false;

			}

			if(field.name == "gender") {

				if(field.checked) {
					user[field.name] = field.name;
				}

			} else if (field.name === "admin") {

				user[field.name] = field.checked;

			} else {

				user[field.name] = field.value;

			}

		});

		if(!isValid) {
			return false;
		}

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

		let tr = document.createElement('tr');

		tr.innerHTML = 
			`
				<td><img src="${objectUser.photo}" alt="User Image" class="img-circle img-sm"></td>
	            <td>${objectUser.name}</td>
	            <td>${objectUser.email}</td>
	            <td>${(objectUser.admin) ? 'Sim':'Não'}</td>
	            <td>${Utils.dateFormat(objectUser.register)}</td>
	            <td>
	            	<button type="button" class="btn btn-primary btn-xs btn-flat">Editar</button>
	                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
	            </td>
			`;

		this.tableEl.appendChild(tr);

		console.log(objectUser);
	}


}