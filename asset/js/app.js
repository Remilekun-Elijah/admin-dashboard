//esversion: 6

class Admin {}


class UTILS {
	static #phoneCodeUri = "./asset/js/countryPhone.json";
	static #countryNameUri = "./asset/js/countryNames.json";

	static async api(uri) {
		let res = await fetch(uri);
		return await res.json();
	}
	static async getCountries() {
		const countryCode = await this.api(UTILS.#countryNameUri);

		return countryCode;
	}

	static async getCountryName(code) {
		const countryName = await this.api(UTILS.#countryNameUri);
		return countryName[code];
	}

	static async getPhoneCodes() {
		const res = await this.api(UTILS.#phoneCodeUri);
		return res;
	}

	static async getPhoneCode(name) {
		const res = await this.api(UTILS.#phoneCodeUri);
		await this.getPhoneAndCountry();
		return res[name];
	}

	static async getPhoneAndCountry(country) {
		let res = await UTILS.getCountries();
		let code = await UTILS.getPhoneCodes();

		const newData = [],
			phone = {
				codes: Object.values(code),
				countries: Object.values(res)
			};

		for (let i in phone.codes) {
			if (phone.codes[i].length != 0 && phone.codes[i] != "" && phone.codes[i] != " ") {
				const code = phone.codes[i].startsWith("+") ? phone.codes[i] : `+${phone.codes[i]}`,
					number = code + ' ' + phone.countries[i];

				newData.push(number);
			}
		}
		return newData;
	}
}


class UI {
	#initialPage = "create";
	constructor() {

		this.sidebar = {
			_active: false,
			open: function (tag = '.navbar-burger') {
				this._active = true;
				tag != null || undefined ? $(tag).addClass('close') : null;
				$('#aside').css('transform', 'translateX(0)');

				window.innerWidth <= 768 ? ($(".overlay").css("transform", 'translateX(0%)'),
					$('body').css('overflow-y', 'hidden')) : null;
			},
			close: function (tag = '.navbar-burger') {
				this._active = false;
				tag != null || undefined ? $(tag).removeClass('close') : null;
				$('#aside').css('transform', 'translateX(-100%)');

				window.innerWidth <= 768 ? ($(".overlay").css("transform", 'translateX(100%)'),
					$('body').css('overflow-y', 'visible')) : null
			}
		}
	}
	get initialPage() {
		return this.#initialPage;
	}

	toggleSidebar(tag) {
		const {
			sidebar
		} = this;

		sidebar._active ?
			sidebar.close(tag) :
			sidebar.open(tag);
	}
	tag(name) {
		return document.querySelector(name);
	}
	variables() {
		return {
			pages: this.tag("#pages"),
			sidebar: this.tag(".main-wrapper"),
			navbarBurger: this.tag(".navbar-burger")
		}
	}
	displayCurrentPage(name) {
		this.displayPage(name);
	}

	listenForPageChange() {
		const that = this;
		const {
			sidebar
		} = that.variables();

		function then(callback) {
			sidebar.addEventListener("click", function (event) {
				let {
					target
				} = event;
				if (!target.getAttribute("data-id")) target = target.parentElement;

				if (target.getAttribute("data-id")) {
					// hides sidebar on mobile after click
					window.innerWidth <= 768 ? that.sidebar.close() : null;
					// gives the callback the id of the page to be displayed
					const pageId = target.getAttribute("data-id");
					return callback(pageId);
				}
			});
		}

		return {
			then
		};
	}

	changePage(page) {
		this.displayPage(page);
	}
	displayPage(page) {
		const { pages } = this.variables();
		// hide all pages first
		Array.from(pages.children).forEach(element => {
			$(element).hide(200, _=> $(element).removeClass('active'));
		});

		// then display the provided page
		$(`#${page}`).show(250, _=> $(`#${page}`).addClass('active'));
	}
	
	create() {
		function toggleCreateForm() {

			$('#create .createBtn').click(e => {
				$("#create .incoming_shipment_form").show(200)
				$("#create .create-form-btn-container").hide(200)
			});

			$("#create .incoming_shipment_form .close").click(e => {
				$("#create .incoming_shipment_form").hide(200);
				$("#create .create-form-btn-container").show(200);
			})

		}

		function searchCountryCode() {
			function searchCode(e) {
				let value = e.target.value.toLowerCase(),
				countryTag = Array.from(e.target.parentElement.parentElement.children);
	
				countryTag.forEach(element => {
					let country = element.firstElementChild.innerHTML?.toLowerCase();
					if (country) {
						if (country.indexOf(value) != -1) $(element).show(200);
						else $(element).hide(200);
					}
				});
			}
	
			$("#create .number .dropdown-menu .search").on("keyup", searchCode);
		}

		function selectCountryCode(e) {
			function selectCountryCode (e) {
				let code = e.target.textContent.split(" ")[0];
			// update	the country code if the user clicks	on a country
			if (e.target.tagName == 'A') $("#create .number button").text(code);	
			}
			
			$("#create .number .dropdown-menu").on("click", selectCountryCode);
		}


		return {
			toggleCreateForm,
			searchCountryCode,
			selectCountryCode
		}
	}

	personalShopper() {
		let id = parseInt(Math.random() * 10000), timer = 0;
		function addMoreFormFields() {
	
			$("#personal_shopper form .add-more").click(function () {
				
				id++;
				let tagId = `p_shopper_${id}`;
				const html = //html
					`
					<div class="row p_form_field justify-content-around align-items-end mx-md-auto mx-0 px-0 mb-4" style='display:none' id='${tagId}'>
						<div class="col-md-4 col-sm-8 col-8 form-floating  ms-0 ps-0  ms-lg-1 ps-lg-1">
							<input name="url" type="url" class="form-control" id="item-url" placeholder="Item url" required>
							<label for="item-url" class="form-label">Item URL</label>
						</div>
						<div class="col-md-4 mt-3 mt-md-0 order-md-0 order-1 col-10 mx-0 px-0 form-floating ">
							<textarea name="details" type="text" class="form-control" id="detail" placeholder="Item details, e.g brand, color, size etc" required style="height: 100px !important;"></textarea>
							<label for="detail" class="form-label">Item details [color, size etc]</label>
						</div>

						<div class="col-md-2  col-4 form-floating  mx-0 px-0 ">
							<input type="number" min="0" name="quantity" class="form-control" id="quantity" placeholder="Item quantity" required>
							<label for="quantity" class="form-label">Quantity</label>
						</div>
						<div class="col-1 order-sm- order-1 mx-0 px-0">
							<a class="cursor-pointe btn btn-outline-light shadow-sm btn-outline-dange text-dark del__parent"><i class="fas fa-times"></i></a>
						</div>
					</div>
				`;
				this.previousElementSibling.innerHTML += html;

				$(`#${tagId}`).show(150);
				$('.p_form_field .del__parent').click(function(){
				
				$('.p_form_field').length > 1 ? $(this).parent().parent().hide(200,e_=>$(this).parent().parent().remove()) :'';
				});
			});
		}

		function animateHeader (){
				// header descriptive image divs
				const children = $(".p_shopper>div div");
				if(window.innerWidth < 576){
					// hide all the contents
					children.hide();
					// display one each
					$(children[timer]).fadeIn(500);
					// start from 0 if the children has been maxed out
					timer === children.length-1 ? timer = 0 : timer++;
				} else children.show(100);
		}
		return {
			addMoreFormFields,
			animateHeader
		}
	}

	dynamicText(){
		let i = 0;
		setInterval(() => {
				let children = $(".active .dynamic-text");
				i == children.length-1 ?	i = 0 : i++;
				children.hide();
				$(children[i]).fadeIn(150);
		}, 2000); 
	}



	static async start() {
		let code = await UTILS.getPhoneCode("GH");
		$("#create .number button").text(code);

		const phones = await UTILS.getPhoneAndCountry();
		for (let phone of phones) {
			let html = `<li><a class="dropdown-item cursor-pointer text-truncate">${phone}</a></li>`;
			$("#create .number .dropdown-menu").append(html);
		}

		const ui = new this();
		ui.displayCurrentPage(ui.initialPage);
		// open sidebar only on desktop otherwise close it
		window.innerWidth > 768 ? ui.sidebar.open() : ui.sidebar.close();
		// toggle navbar
		ui.variables().navbarBurger.addEventListener("click", function () {
			ui.toggleSidebar(this);
		});

		ui.dynamicText();

		ui.create().selectCountryCode();
		ui.create().searchCountryCode();

		ui.listenForPageChange().then(pageId => ui.displayPage(pageId));

		ui.create().toggleCreateForm();
		ui.personalShopper().addMoreFormFields();
		setInterval(ui.personalShopper().animateHeader, 3000);
	}

}
 
UI.start();