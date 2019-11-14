<template>
	<section class="login mx-auto my-5 pb-4 bg-light">
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
	import {mapGetters, mapMutations, mapActions} from 'vuex'

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
		created() {
			if (!this.isAdmin) {
				const localStore = this.$storage.get('admin');
				if (localStore) {
					this.SET_ADMIN({
						id: localStore.id,
						name: localStore.name,
						codeError: 0
					});
					this.$router.push('/requisite')
				}
			} else {
				this.$router.push('/requisite')
			}
		},
		computed: {
			...mapGetters('login', [
				'isAdmin',
				'getAdmin',
				'getCodeError'
			]),
		},
		methods: {
			...mapMutations('login', [
				'SET_ADMIN'
			]),
			...mapActions('login', [
				'checkAdmin'
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
						await this.checkAdmin(this.admin);

						this.validLogin = true;

						if (this.isAdmin) {
							const admin = this.getAdmin;
							this.$storage.set('admin', {
								id: admin.id,
								name: admin.name
							});
							this.$router.push('/requisite');
						} else {
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
