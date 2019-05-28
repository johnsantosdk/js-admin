class UserController {

	constructor(formIdCreate, formIdUpdate, tableId) {

		this.formEl = document.getElementById(formIdCreate);
		this.formUpdateEl = document.getElementById(formIdUpdate);
		this.tableEl = document.getElementById(tableId);

		this.onSubmit();
		this.onEdit();

	}

	onEdit() {

		document.querySelector("#box-user-update .btn-cancel").addEventListener("click", e => {

			this.showPanelCreate();

		});

		this.formUpdateEl.addEventListener("submit", event => {

			event.preventDefault();

			let btn = this.formUpdateEl.querySelector("[type=submit]");

			btn.disabled = true;

			let values = this.getValues(this.formUpdateEl);

			let index = this.formUpdateEl.dataset.trIndex;

			let tr = this.tableEl.rows[index];

			tr.dataset.user = JSON.stringify(values);

			tr.innerHTML = `
				<td><img src="${values.photo}" alt="User Image" class="img-circle img-sm"></td>
	            <td>${values.name}</td>
	            <td>${values.email}</td>
	            <td>${(values.admin) ? 'Sim':'Não'}</td>
	            <td>${Utils.dateFormat(values.register)}</td>
	            <td>
	            	<button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
	                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
	            </td>
			`;

			this.addEventsTr(tr);

			this.updateCount();

		});

	}

	onSubmit() {

		this.formEl.addEventListener("submit", event => {

			event.preventDefault();

			let btn = this.formEl.querySelector("[type=submit]");

			btn.disabled = true;

			let values = this.getValues(this.formEl);

			if (!values) return false;	

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

			console.log(elements[0]);

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

	getValues(formEl) {

		let user = {};
		let isValid = true;

		[...formEl.elements].forEach(function (field, index) {

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

		tr.dataset.user = JSON.stringify(objectUser);

		tr.innerHTML = 
			`
				<td><img src="${objectUser.photo}" alt="User Image" class="img-circle img-sm"></td>
	            <td>${objectUser.name}</td>
	            <td>${objectUser.email}</td>
	            <td>${(objectUser.admin) ? 'Sim':'Não'}</td>
	            <td>${Utils.dateFormat(objectUser.register)}</td>
	            <td>
	            	<button type="button" class="btn btn-primary btn-edit btn-xs btn-flat">Editar</button>
	                <button type="button" class="btn btn-danger btn-xs btn-flat">Excluir</button>
	            </td>
			`;

		this.addEventsTr(tr);

		this.tableEl.appendChild(tr);

		this.updateCount();

	}

	addEventsTr(tr) {

		tr.querySelector(".btn-edit").addEventListener("click", e => {
			
			let json = JSON.parse(tr.dataset.user);
			let form = document.querySelector("#form-user-update");

			form.dataset.trIndex = tr.sectionRowIndex;

			for (let name in json) {

				let field = form.querySelector("[name="+name.replace("_", "N")+"]");

				//console.log("aqui!!!",name, field.type);
				
				if (field) {


					switch (field.type) {
						case 'file':
							continue;
						break;

						case 'radio':
							field = form.querySelector("[name="+name.replace("_", "N")+"][value="+json[name]+"]");
							//console.log(field.type, field.checked);
							//field.checked = true;
						break;

						case 'checkbox':
							field.checked = json[name];
						break;

						default:

							field.value = json[name];
					}
				}
			}

			this.showPanelUpdate();

		});
	}

	showPanelCreate() {

		document.querySelector("#box-user-create").style.display = "block";
		document.querySelector("#box-user-update").style.display = "none";

	}

	showPanelUpdate() {
		console.log("EXECUTOU");
		document.querySelector("#box-user-create").style.display = "none";
		document.querySelector("#box-user-update").style.display = "block";
		
	}

	updateCount() {

		let numberUser = 0;
		let numberAdmin = 0;

		[...this.tableEl.children].forEach(tr => {

			numberUser++;

			let user = JSON.parse(tr.dataset.user);

			if (user._admin) numberAdmin++;

		});

		document.querySelector("#number-users-comomn").innerHTML = numberUser;
		document.querySelector("#number-users-admin").innerHTML = numberAdmin;

	}



}