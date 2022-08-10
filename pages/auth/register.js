import Layout from "../../components/Layout";
import Card from '../../components/Card';
import { Input, Label, Button, Error } from "../../components/Form";
import { useState } from "react";
import axios from "axios";
import { useSetRecoilState } from "recoil";
import { authCheckState } from "../../store/auth";
import { useRouter } from "next/router";
export default function Register() {
    const setAuthCheck = useSetRecoilState(authCheckState);
    const router = useRouter();
    const [errors, setErrors] = useState([]);
    const [form, setForm] = useState({
        username: '', name: '', email: '', password: '', password_confirmation: '',
    });
    const submitHandler = async (e) => {
        e.preventDefault();
        try {
            await axios.post('/register', form);
            setAuthCheck(form);
            router.replace('/dashboard');
        } catch (r) {
            setErrors(r.response.data.errors);
        }
    };
    return (
        <Layout middleware="guest" title="Register">
            <div className="mx-auto max-w-screen-sm px-4">
                <Card header={
                    <>
                        <h1 className="text-gray-800 text-xl font-semibold">
                            Register
                        </h1>
                        <p className="text-sm text-gray-500">
                            Lorem ipsum dolor sit amet consectetur adipisicing elit.
                        </p>
                    </>
                }>
                    <form onSubmit={submitHandler}>
                        <div className="mb-5">
                            <Label htmlFor="username">Username</Label>
                            <Input value={form.username} onChange={(e) => setForm(form => ({ ...form, username: e.target.value }))} type="text" name="username" id="username" />
                            {errors && errors.name && <Error message={errors.name} />}
                        </div>
                        <div className="mb-5">
                            <Label htmlFor="name">Name</Label>
                            <Input value={form.name} onChange={(e) => setForm(form => ({ ...form, name: e.target.value }))} type="text" name="name" id="name" />
                            {errors && errors.name && <Error message={errors.name} />}
                        </div>
                        <div className="mb-5">
                            <Label htmlFor="email">Email</Label>
                            <Input value={form.email} onChange={(e) => setForm(form => ({ ...form, email: e.target.value }))} type="email" name="email" id="email" />
                            {errors && errors.email && <Error message={errors.email} />}
                        </div>
                        <div className="mb-5">
                            <Label htmlFor="password">password</Label>
                            <Input value={form.password} onChange={(e) => setForm(form => ({ ...form, password: e.target.value }))} type="password" name="password" id="password" />
                            {errors && errors.password && <Error message={errors.password} />}
                        </div>
                        <div className="mb-5">
                            <Label htmlFor="password">Confirm Password</Label>
                            <Input value={form.password_confirmation} onChange={(e) => setForm(form => ({ ...form, password_confirmation: e.target.value }))} type="password" name="password_confirmation" id="password_confirmation" />
                        </div>
                        <Button>Register</Button>
                    </form>
                </Card>
            </div>
        </Layout>
    );
}
