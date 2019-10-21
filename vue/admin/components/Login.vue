<template>
	<section class="login mx-auto my-5 pb-4 bg-light">
		<div>
			<b-button v-b-modal.modal-1>Launch demo modal</b-button>

			<b-modal id="modal-1" modal-class="in" title="BootstrapVue">
				<p class="my-4">Hello from modal!</p>
			</b-modal>
		</div>

		<div
			class="title d-flex align-items-center justify-content-between mb-3 p-3 alert-primary"
		>
			<div class="fa-3x">
				<font-awesome-icon icon="user-lock"/>
			</div>

			<h4 class="text-center">Войти в панель администрирования</h4>
		</div>

		<b-form
			ref="form"
			class="mx-5"
			@submit.prevent="onSubmit()"
		>
			<b-form-group
				label="Логин"
				label-for="login"
			>
				<b-form-input
					id="login"
					v-model="admin.name"
					type="text"
					placeholder="Введите свой логин"
					:state="validLogin"
					@input="checkLogin"
					@blur="checkLogin"
				></b-form-input>
				<b-form-invalid-feedback :state="validLogin">
					{{errorLogin}}
				</b-form-invalid-feedback>
			</b-form-group>

			<b-form-group
				label="Пароль:"
				label-for="password">
				<b-form-input
					id="password"
					v-model="admin.password"
					type="password"
					placeholder="Введите пароль"
					:state="validPassword"
					@input="checkPassword"
					@blur="checkPassword"
				></b-form-input>
				<b-form-invalid-feedback :state="validPassword">
					{{errorPassword}}
				</b-form-invalid-feedback>
			</b-form-group>

			<b-button
				class="d-block mx-auto mt-3"
				type="submit"
				variant="primary"
				:disabled="!validLogin || !validPassword"
			>Войти
			</b-button>
		</b-form>
	</section>
</template>

<script>
	import {mapGetters, mapActions} from 'vuex'

	export default {
		name: 'login',
		data() {
			return {
				admin: {
					name: '',
					password: ''
				},
				validLogin: null,
				validPassword: null,
				errorLogin: '',
				errorPassword: ''
			}
		},
		computed: {
			...mapGetters('login', [
				'isAdmin',
				'getCodeError'
			]),
		},
		methods: {
			...mapActions('login', [
				'setAdmin'
			]),
			checkLogin() {
				//this.validLogin = (this.form.login.trim() === '' ? false : true)
				if (this.admin.name.trim() === '') {
					this.errorLogin = 'Логин не может быть пустым';
					this.validLogin = false;
				} else {
					this.validLogin = true
				}
			},
			checkPassword() {
				//this.validPassword = (this.form.password.trim() === '' ? false : true)
				if (this.admin.password.trim() === '') {
					this.errorPassword = 'Пароль не может быть пустым';
					this.validPassword = false
				} else if (this.admin.password.trim().length < 5) {
					this.errorPassword = 'Длина пароля должна быть не меньше 5 символов';
					this.validPassword = false
				} else {
					this.validPassword = true
				}
			},
			async onSubmit() {
				if (this.$refs.form.checkValidity()) {
					try {
						/*const formData = {
							login: this.admin.login,
							password: this.admin.password
						};

						await this.$store.dispatch('auth/login', formData);

						if (this.$store.getters['auth/isAuth']) {
							this.$router.push('/admin/requisite');
						}
					} catch (e) {
						console.log('Ошибка авторизации:', e.message);
					}*/
						await this.setAdmin(this.admin);

						this.validLogin = true;

						if (this.isAdmin)
							this.$router.push('/requisite');
						else {
							this.validLogin = false;
							switch (this.getCodeError) {
								case -1:
									this.errorLogin = `Пользователь ${this.admin.name} не найден`;
									break;
								case -2:
									this.errorLogin = 'Неверные имя или пароль';
									break;
								case -3:
									this.errorLogin = `Пользователь ${this.admin.name} не является администратором`;
									break;
							}
						}
					} catch (e) {
						console.log('Ошибка авторизации:', e.message);
					}
				}
			}
		}
	}
</script>

<style lang="scss">
	.login {
		max-width: 350px;
		box-shadow: 0 0 2em 0 rgba(0, 123, 255, 0.5);
	}

	.title {
		border-bottom: 1px solid #007bff
	}

	.modal-header .close {
		order: 10
	}
</style>
